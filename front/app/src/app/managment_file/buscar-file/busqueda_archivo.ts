import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { BuscarArchivoService } from 'src/app/services/buscar_archivos/buscar-archivos.service';
import { BuscarArchivoDetalleService } from 'src/app/services/buscar_archivos/buscar-archivos-detallado.service';
import { WordToPdfService } from 'src/app/services/buscar_archivos/visualizador-archivos.service';
import { DomSanitizer,SafeResourceUrl, SafeUrl,SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';


@Component({
    moduleId: module.id,
    selector: 'app-busqueda_archivo.',
    templateUrl: './busqueda_archivo.html',
    styleUrls: ['./busqueda_archivo.css'],
    animations: [
        trigger('toggleAnimation', [
            transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
            transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
        ]),
    ],
})

export class BusquedaArchivoComponent {

    doculink: string = '';
    htmlResponse: SafeHtml='';

    urlMain: string = '';
    urlgoogle!: SafeResourceUrl;

    search = '';
    searchQuery: string = '';
    busquedaResultados: string[] = [];
    // doculink: string = 'https://calibre-ebook.com/downloads/demos/demo.docx';
    click_nombre_documento: string = 'nombre del archivo'; // Set a default value

    constructor(
        private busqueda_archivo: BuscarArchivoService,
        private busqueda_archivo_det: BuscarArchivoDetalleService,
        private wordToPdfService: WordToPdfService,
        private sanitizer: DomSanitizer, // Inyecta el DomSanitizer
        private http: HttpClient,

    ) {}


    ViewDoc(nombrefile: string): void {
      if (!nombrefile) return;
      this.doculink ='';
      this.htmlResponse ='';      
      // Normalize the URL

      const filePath = nombrefile;
      const basePathLength = '/usr/src/app/'.length;
      const relativePath = filePath.slice(basePathLength); // Corta desde la longitud del prefijo
      console.log(relativePath); // 'media/archivos/Manual Autoguardado.docx'


      var wordUrl = 'http://localhost:8000/' + encodeURIComponent(relativePath) ;
      const encodedUrl =wordUrl;  

      this.urlMain = encodeURIComponent(wordUrl);

      relativePath

      const basePathLengthoffie = 'media/archivos/'.length;
      const relativePathoffice = relativePath.slice(basePathLengthoffie); // Corta desde la longitud del prefijo
      console.log(relativePathoffice); // 'media/archivos/Manual Autoguardado.docx'

      this.click_nombre_documento=relativePathoffice;
      // Extract file extension
      const extension = this.getFileExtension(encodedUrl);
      // Handle different file types
      switch (extension) {
          case '.docx':
            // Handle Word document
            this.handleDocumentOffice(relativePathoffice);
            break;
          case '.doc':
            // Handle Word document
            this.handleDocumentOffice(relativePathoffice);
            break;
          case '.xlsx':
            this.handleDocumentOffice(relativePathoffice);
            break;
          case '.xls':
            // Handle Excel document
            this.handleDocumentOffice(relativePathoffice);
            break;
          // case '.pptx':
          //   this.handleDocumentOffice(relativePathoffice);
          //   break;

          // case '.ppt':
          //   // Handle PowerPoint document
          //   this.handleDocumentOffice(relativePathoffice);
          //   break;
          case '.pdf':
            // Handle PDF document
            this.handlePdfDocument(encodedUrl);
            break;
          case '.txt':
            // Handle PDF document
            this.handleDocumentOffice(relativePathoffice);
            break;
          case '.jpg':
              // Handle jpg document
              this.handleImages(encodedUrl);
              break;
          case '.jpeg':
            // Handle jpeg document
            this.handleImages(encodedUrl);
            break;
          case '.png':
              // Handle png document
              this.handleImages(encodedUrl);
              break;
          default:
            console.error('Unsupported file extension.');
            this.NoPreview();
      }
    }
    
    getFileExtension(url: string): string {
      const segments = url.split('.');
      if (segments.length > 1) {
        return '.' + segments.pop()!.toLowerCase();
      }
      return '';
    }

    // -----------------------------------------------
    handleDocumentOffice(DocURL: string): void {
      const formDatas = new FormData();
      formDatas.append('docfile', DocURL);
      try {
          // const result = this.busqueda_archivo_det.converttopdf(formDatas).toPromise();
          this.busqueda_archivo_det.converttopdf(formDatas).subscribe(
            response => {
              this.htmlResponse = this.sanitizer.bypassSecurityTrustHtml(response.html);

            },
            error => {
              console.error('Error:', error);
            }
          );
      } catch (error) {
            throw new Error((error as any).message); // Use `as any` to assert
      }
    }
    
    handlePdfDocument(url: string): void {
      this.doculink = url;
    }

    NoPreview(): void {
      var url = 'http://localhost:8000/media/archivos_sistema/no_view.png';
      this.htmlResponse = `<img style="max-width: fit-content !important" src="${url}" alt="No previsualización">`;
    }

    handleImages(url: string): void {
      this.htmlResponse = `<img style="max-width: fit-content !important;" src="${url}" alt="Imagen previsualización">`;
    }

    DescargarDocu(wordUrl: string): void {
        if (!wordUrl) return;

        const filePath = wordUrl;
        const basePathLength = '/usr/src/app/'.length;
        const relativePath = filePath.slice(basePathLength); // Corta desde la longitud del prefijo
        console.log(relativePath); // 'media/archivos/Manual Autoguardado.docx'
        var wordUrl ='http://localhost:8000/'+encodeURIComponent(relativePath) ;
        // HTTP GET request to download the file as a Blob
        this.http.get(wordUrl, { responseType: 'blob' }).subscribe((blob) => {
          this.downloadBlob(blob, 'downloaded_file.pdf'); // Change the file name as needed
        });
    }

    private downloadBlob(blob: Blob, fileName: string): void {
        const downloadLink = document.createElement('a');
        const objectUrl = window.URL.createObjectURL(blob);
        downloadLink.href = objectUrl;
        downloadLink.download = fileName; // Set the default download file name
        downloadLink.click(); // Trigger the download
        window.URL.revokeObjectURL(objectUrl); // Clean up the object URL to free memory
    }

    removeBasePath(path: string): string {
        return path.replace("/usr/src/app/media/archivos/", "");
    }

    //------------------------------------------------------
    Busqueda(): void {
        console.log("🚀 ~ BusquedaArchivoComponent ~ Busqueda ~ this.searchQuery.trim():", this.searchQuery.trim())

        if (this.searchQuery.trim() !== '') {
          this.busqueda_archivo_det.searchFiles(this.searchQuery).subscribe(
            (data) => {
              this.busquedaResultados = data;
            },
            (error) => {
              console.error('Error fetching search results:', error);
            }
          );
        }else{

            this.busqueda_archivo_det.searchFiles(null).subscribe(
                (data) => {
                    console.log("🚀 ~ BusquedaArchivoComponent ~ Busqueda ~ data:", data)
                    setTimeout(() => {
                        this.busquedaResultados = [];
                    }, 500);
                },
                (error) => {
                  console.error('Error fetching search results:', error);
                }
              );

              
        }
    }
}