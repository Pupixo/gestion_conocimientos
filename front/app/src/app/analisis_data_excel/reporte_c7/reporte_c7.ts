import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { WordToPdfService } from 'src/app/services/buscar_archivos/visualizador-archivos.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';


import Fuse from 'fuse.js';
import * as JSZip from 'jszip';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

import { FlatpickrOptions } from 'ng2-flatpickr';
import { Spanish } from 'flatpickr/dist/l10n/es';


import { UsuariosCrudService } from 'src/app/services/usuarios/usuarios-crud.service';
import { ReporteExcelService } from 'src/app/services/reportesexcel/reportesexcel.service';
import { ReporteExcelGenericService } from 'src/app/services/reportesexcel/reportesexcel_generic.service';

import * as moment from 'moment';
import 'moment/locale/es';

@Component({
  moduleId: module.id,
  selector: 'app-reporte_c7',
  templateUrl: './reporte_c7.html',
  styleUrls: ['./reporte_c7.css'],
  animations: [
    trigger('toggleAnimation', [
      transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
      transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
    ]),
  ],
})
export class AnalisisReporteC7Component {
  uploadZip: FormGroup;
  fileData!: File;
  fileDatatxt!: File;

  rangeCalendar: FlatpickrOptions;
  formulario!: FormGroup;
  isLoading = true;
  store: any;

  constructor(
    private wordToPdfService: WordToPdfService,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    public storeData: Store<any>,
    private usuarioscrudService: UsuariosCrudService,


    private reporteexcel: ReporteExcelService,
    private reporteexcelgenerico: ReporteExcelGenericService
  ) {

        this.initStore();
        // this.isLoading = false;
        // this.initForm();

        this.formulario = this.formBuilder.group({
            fechas_rango: [],
        });
        this.uploadZip = this.formBuilder.group({
          file: [''],
          file_txt : [''],
        });

        this.rangeCalendar = {
            defaultDate: '',
            dateFormat: 'Y-m-d',
            mode: 'range',
            position: 'auto right',
            // position: this.store.rtlClass === 'rtl' ? 'auto right' : 'auto left',
            locale: Spanish,  // Configuración del idioma a español
        };

  }
  
  async initStore() {
    this.storeData
        .select((d) => d.index)
        .subscribe((d) => {
            const hasChangeTheme = this.store?.theme !== d?.theme;
            const hasChangeLayout = this.store?.layout !== d?.layout;
            const hasChangeMenu = this.store?.menu !== d?.menu;
            const hasChangeSidebar = this.store?.sidebar !== d?.sidebar;

            if (hasChangeTheme || hasChangeLayout || hasChangeMenu || hasChangeSidebar) {
                if (this.isLoading || hasChangeTheme) {
             
                } else {
                    setTimeout(() => {
                    }, 100000);
                }
            }
        });
  }




  // funciones del modal actual
  initForm() {

      const startDate = new Date();
      startDate.setDate(1);  // Primer día del mes actual

      const endDate = new Date(startDate);
      endDate.setDate(15);  // Día 15 del mes actual

      const startDateString = startDate.toISOString().split('T')[0];
      const endDateString = endDate.toISOString().split('T')[0];

      // fechas_rango: ['2023-07-05 a 2023-07-10'],
      // `${startDateString} a ${endDateString}`

      this.formulario = this.formBuilder.group({
        fechas_rango: [],
      });

      // this.rangeCalendar.defaultDate = `${startDateString} to ${endDateString}`;

  }

  coloredToast(color: string, msg: string) {
    const toast = Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 3000,
      showCloseButton: true,
      customClass: {
        popup: `color-${color}`
      }
    });
    toast.fire({ title: msg });
  }

  subirArchivo(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.fileData = file;
    }
  }
  subirArchivoZiptxt(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.fileDatatxt = file;
    }
  }


  

  async uploadData() {
    if (this.fileData || this.fileDatatxt ) {

      let timerInterval: any;
      Swal.fire({
        title: 'Se analizará el excel!',
        html: 'Por favor espere. <b></b>', // Asegúrate de que haya un elemento <b> en el HTML
        timer: 3000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
          const b: any = Swal.getHtmlContainer()?.querySelector('b');
          if (b) {
            timerInterval = setInterval(() => {
              const timerLeft = Swal.getTimerLeft();
              if (timerLeft !== undefined) {
                b.textContent = timerLeft.toString();
              }
            }, 100);
          }
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
      }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
          console.log('I was closed by the timer');
        }
      });







      setTimeout(() => {
          this.storeData.dispatch({ type: 'toggleMainLoader', payload: true });
      }, 500);
      var fechas_rango = this.formulario.get('fechas_rango')?.value ?? '';
      console.log("🚀 ~ AnalisisReporteC7Component ~ uploadData ~ fechas_rango:", fechas_rango)
      console.log("🚀 ~ AnalisisReporteC7Component ~ uploadData ~ fechas_rango:", )
      console.log("🚀 ~ AnalisisReporteC7Component ~ uploadData ~ fechas_rango:", fechas_rango[1])

      const fechaini = moment(fechas_rango[0]).format('YYYY-MM-DD');
      const fechafin = moment(fechas_rango[1]).format('YYYY-MM-DD');

      const formData = new FormData();
      formData.append('fechas_ini',fechaini);
      formData.append('fechas_fin',fechafin);
      formData.append('archivo', this.fileData);
      formData.append('archivotxt', this.fileDatatxt);

      try{
        const url = await this.subirExcelC7(formData);
      
        console.log("🚀 ~ AnalisisReporteC7Component ~ uploadData ~ url:", url)
        window.open(url, '_blank');
   
        const formElminar = new FormData();
        const rutaDirectorio = url.substring(0, url.lastIndexOf('/'));
        console.log(rutaDirectorio);
  
        formElminar.append('ruta_directorio',rutaDirectorio);
      
        setTimeout(() => {
            try{
              this.EliminarC7(formElminar);
              setTimeout(() => {
                  this.storeData.dispatch({ type: 'toggleMainLoader', payload: false });
              }, 500);
            } catch (error:any) {
              console.log("🚀 ~ AnalisisReporteC7Component ~ uploadData ~ error:", error)
              console.log("🚀 ~ AnalisisReporteC7Component ~ uploadData ~ error:",  error.error.detail)

              let text_data = this.removeDynamicPath( error.error.detail);

              console.log(text_data);
              Swal.fire({
                icon: "error",
                title: "¡Oops...!",
                text: "Se encontro errores de validación de datos",
                footer: '<div  style="overflow-wrap: break-word;word-wrap: break-word; /* For IE */word-break: break-word;white-space: normal;">'+  text_data +'</div>',
                padding: '2em',
              
              });

              setTimeout(() => {
                this.storeData.dispatch({ type: 'toggleMainLoader', payload: false });
              }, 500);

            }
        }, 2000);
      } catch (error:any) {
        
        let text_data = this.removeDynamicPath( error.error.detail);

        console.log(text_data);


          Swal.fire({
            icon: "error",
            title: "¡Oops...!",
            text: "Se encontro errores de validación de datos",
            footer: '<div style="overflow-wrap: break-word;word-wrap: break-word; /* For IE */word-break: break-word;white-space: normal;">'+  text_data +'</div>',
            padding: '2em',
          });

          setTimeout(() => {
            this.storeData.dispatch({ type: 'toggleMainLoader', payload: false });
          }, 500);
      }

    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "!Debes subir un archivo!",
        footer: '<div style="overflow-wrap: break-word;word-wrap: break-word; /* For IE */word-break: break-word;white-space: normal;">Si tienes mas problemas recarga la pagina</div>',
        padding: '2em',
      });

      setTimeout(() => {
        this.storeData.dispatch({ type: 'toggleMainLoader', payload: false });
    }, 500);
    }
  }
  
  async subirExcelC7(formData: FormData): Promise<any> {
    try {
          const result = this.reporteexcelgenerico.registrar(formData).toPromise();
  
        return result;
    } catch (error) {
          throw new Error((error as any).message); // Use `as any` to assert
    }
  }
  
  async EliminarC7(formData: FormData): Promise<any> {
    try {
          const result = this.reporteexcelgenerico.modificar(formData,1).toPromise();
  
        return result;
    } catch (error) {
          throw new Error((error as any).message); // Use `as any` to assert
    }
  }

  removeDynamicPath(text: string): string {
    return text.replace(/\/usr\/src\/app\/media\/C7\/[^\/]+\//, '');
  }

  

}