import { Component, OnInit,ViewChild,ElementRef,Renderer2 } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormGroup , Validators } from '@angular/forms';
import Swiper, { Autoplay, Navigation, Pagination } from 'swiper';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

import * as moment from 'moment';
import 'moment/locale/es';
import { EventEmitter, Output } from '@angular/core';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';


import { GestionCursoGenericService } from 'src/app/services/gestion_curso/gestion_curso_generic.service';
import { GestionCursoService } from 'src/app/services/gestion_curso/gestion_curso.service';
import { ModalComponent } from 'angular-custom-modal';


import { Subscription } from 'rxjs';


@Component({
    selector: 'app-modal_temas.',
    templateUrl: './modal_temas.html',
    styleUrls: ['./modal_temas.css'],
    animations: [
        trigger('toggleAnimation', [
            transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
            transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
        ]),
    ],
})

export class ModalTemasComponent implements OnInit  {
    @Output() eventoHijo = new EventEmitter<void>();
    private suscripcion: Subscription;

    formulario_modal!: FormGroup;
    usuario_data: any={};
    data: any={};
    params_tbl_tema!: FormGroup;
    params_quiz!: FormGroup;
    
    files: File[] = [];

    fileEdit: any[] = [];

    ArchivosData: any[] = [];

    @ViewChild('fileInputMultiple') fileInputMultiple!: ElementRef;
    @ViewChild('ModalQuiz') ModalQuiz!: ModalComponent;
    selectedFiles: { [key: string]: File } = {};
    selectedFilesMultiple: { [key: string]: File | File[] } = {};

    QuizContenidoList: any =   [];

    constructor(
        public fb: FormBuilder,
        public router: Router,
        public storeData: Store<any>,
        private gestioncursoservicegeneric: GestionCursoGenericService,
        private gestioncursoservice: GestionCursoService,
        private renderer: Renderer2

    ){
        this.initStore();


        this.suscripcion = this.gestioncursoservicegeneric.invocarFuncionPadre.subscribe((evento) => {
            switch (evento.accion) {
 
                // case 'cerrar_modal_quiz':
                //     this.ModalQuizCerrar();
                // break;
              // Agrega más casos según sea necesario
              default:
                console.log('Acción no reconocida');
            }
        });

    }

    store: any;
    async initStore() {
        this.storeData
            .select((d) => d.index)
            .subscribe((d) => {
                this.store = d;
            });
    }

    initForm() {

        this.params_tbl_tema = this.fb.group({
            id: [0],
            contenido: [0],
            titulo_tema: ['', Validators.required],
            resumen_tema: ['', Validators.compose([Validators.required, Validators.email])],
            video_tema: ['', Validators.required],
            video_tema_url: ['', Validators.required],
            img_fondo: ['', Validators.required],
        });
        
        
        this.params_quiz = this.fb.group({
            id: [0],
        });
    }

    scrollToTop() {
        this.renderer.listen('window', 'load', () => {
            window.scroll({
              top: 100,
              left: 100,
              behavior: 'smooth'
            });
          });
    }

    ngOnInit() {

        this.initForm();
        this.InicializarDatos();
        
        setTimeout(() => {
            this.scrollToTop();
        }, 3000);


    }

    getFileNameUrl(url: string): string {
        return url.split('/').pop() || '';
    }

    InicializarDatos(){
        this.data = this.gestioncursoservicegeneric.getData();
       
        if (Object.keys(this.data).length === 1) {
            console.log('Data is null or undefined');
        
                this.params_tbl_tema.patchValue({
                    contenido: this.data.contenido,
                    // Add other fields if necessary
                });

        } else {

                this.params_tbl_tema.patchValue({
                    id: this.data.id,
                    contenido: this.data.contenido,
                    titulo_tema: this.data.titulo_tema,
                    resumen_tema: this.data.resumen_tema,
                });
                this.selectedFiles['img_fondo'] = this.data.img_fondo;
                this.selectedFiles['video_tema'] = this.data.video_tema;

                this.ListaArchivosSubidos(this.data.archivos)
        }
    }

    ListaArchivosSubidos(archivos: any){
        this.ArchivosData = archivos;
        this.fileEdit=[];
        for (let i = 0; i < this.ArchivosData.length; i++) {
            this.fileEdit.push({url:this.ArchivosData[i].archivo,id_archivo_contenido:this.ArchivosData[i].id }); // Update component state with the files
        }
    }

    logout(){
        localStorage.clear();
        this.router.navigate(['/signin']);
    }    

    coloredToast(color:string,msg:string){
        const toast = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            showCloseButton: true,
            customClass: {
                popup: `color-${color}`
            },
            // target: document.getElementById(color + '-toast')
        });
        toast.fire({
            title: msg,
        });
    }; 

    GuardarDataTemas() {
        const formData = new FormData();
        const id = Object.keys(this.data).length === 1 ? 0 : this.data.id;


        const titulo_tema = this.params_tbl_tema.get('titulo_tema')?.value ?? '';
        if (!titulo_tema) {
            Swal.fire({ icon: "error", title: "Oops...", text: "Debe ingresar el titulo para el contenido" });
            return;
        }
    
        const resumen_tema = this.params_tbl_tema.get('resumen_tema')?.value ?? '';
        if (!resumen_tema) {
            Swal.fire({ icon: "error", title: "Oops...", text: "Debe ingresar el resumen de contenido" });
            return;
        }

        if(id == 0){

            var  video_tema = this.params_tbl_tema.get('video_tema')?.value ?? '';
            if(video_tema == ''){
                video_tema = null
            }else{
                video_tema = this.selectedFiles['video_tema']
                formData.append('video_tema', video_tema);
            }
            var datos_img_fondo =this.selectedFiles['img_fondo']
            if (typeof datos_img_fondo === 'undefined') {
                Swal.fire({ icon: "error", title: "Oops...", text: "Debe ingresar la imagen del contenido" });
                return;
            }else{
                formData.append('img_fondo', this.selectedFiles['img_fondo']);
            }

            const multipleFiles =this.files 
            console.log("🚀 ~ ModalTemasComponent ~ GuardarDataTemas ~ multipleFiles:", multipleFiles)

            if (Array.isArray(multipleFiles)) {
                for (const file of multipleFiles) {
                    console.log("🚀 ~ ModalTemasComponent ~ GuardarDataTemas ~ file:", file)
                    formData.append('multiple_files', file);
                }
            } else {
                Swal.fire({ icon: "error", title: "Oops...", text: "Debe ingresar los archivos del contenido" });
                return;
            }

            formData.append('contenido', this.data.contenido);

            formData.append('titulo_tema', titulo_tema);
            formData.append('resumen_tema', resumen_tema);

            formData.append("usuario_reg", localStorage.getItem("current_user") ?? '');
            formData.append('creado', moment().format("YYYY-MM-DD HH:mm:ss"));
            formData.append('status', 'true');
        
            this.gestioncursoservice.registrarTemasContenido(formData).subscribe(
                respuesta => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Se registro',
                        text: '!',
                        padding: '2em',
                    });
                    this.eventoHijo.emit();
                    this.notificarPadre("cerrar_modal_tema");
                    this.notificarPadre("listar_tema_contenido");
                    this.notificarPadre("listar_curso_contenido");

                },
                error => {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Algo sucedio con el servidor",
                        padding: '2em',
                    });
                }
            );

        }else{

       

            var  video_tema = this.params_tbl_tema.get('video_tema')?.value ?? '';

            if(video_tema == ''){
                video_tema = null
            }else{
                video_tema = this.selectedFiles['video_tema']
                formData.append('video_tema', video_tema);
            }


            var img_fondo = this.params_tbl_tema.get('img_fondo')?.value ?? '';
            console.log("🚀 ~ ModalTemasComponent ~ GuardarDataTemas ~ img_fondo:", img_fondo)

            var datos_img_fondo =this.selectedFiles['img_fondo']
            console.log("🚀 ~ ModalTemasComponent ~ GuardarDataTemas ~ datos_img_fondo:", datos_img_fondo)

            
            if (!img_fondo) {
                img_fondo= null
            }else{
                img_fondo=this.selectedFiles['img_fondo']
                formData.append('img_fondo', img_fondo);

            }                

            const multipleFiles =this.files 

            if (Array.isArray(multipleFiles)) {
                for (const file of multipleFiles) {
                    formData.append('multiple_files', file);
                }
            } else {

                if(this.fileEdit.length === 0 ? 0 : this.data.id){

                }else{
                    Swal.fire({ icon: "error", title: "Oops...", text: "Debe ingresar los archivos del contenido",
                        padding: '2em',
                       });
                    return;
                }

            }
 
            formData.append('contenido', this.data.contenido);

            formData.append('titulo_tema', titulo_tema);
            formData.append('resumen_tema', resumen_tema);
            formData.append('status', 'true');

            formData.append("usuario_act", localStorage.getItem("current_user") ?? '');
            formData.append('editado', moment().format("YYYY-MM-DD HH:mm:ss"));

            this.gestioncursoservice.EditarTemasContenido(formData,id).subscribe(
                respuesta => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Se Actualizo',
                        text: '!',
                        padding: '2em',
                    });
                    this.eventoHijo.emit();
                    this.notificarPadre("listar_tema_contenido");
                    this.notificarPadre("listar_curso_contenido");
                    this.listarArchivos( this.data.id )
                    this.files=[]
                },
                error => {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Algo sucedio con el servidor",
                        padding: '2em',
                    });
                }
            );
        }
    }

    notificarPadre(accion: string) {
        const valor = { mensaje: `¡Hola desde el hijo para ${accion}!` };
        this.gestioncursoservicegeneric.llamarFuncionPadre(accion, valor);
    }
    
    CerrarModal() {
        this.eventoHijo.emit();
        this.notificarPadre("cerrar_modal");          
    }

    onFileChange(event: Event) {
        this.files=[]

        const input = event.target as HTMLInputElement;
        if (input.files) {
            this.files = Array.from(input.files); // Update component state with the files
            // this.selectedFilesMultiple['multiple_files'] = Array.from(input.files);
        }
    }

    // procesar imagenes y videos
    subirArchivo(event: any, tipo_file: string, form_control: string) {
        const file: File = event.target.files[0];
        const inputElement = event.target;
        if (!file) {
            console.log('No file selected!');
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Archivo no seleccionado",
                padding: '2em',
            });
            return;
        }else{
            this.selectedFiles[form_control] = file;
        }
    
        if ((tipo_file === 'vid' && !this.isValidVideo(file.type)) || (tipo_file === 'img' && !this.isValidImage(file.type))) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `Tipo de archivo no válido para ${tipo_file === 'vid' ? 'vídeo' : 'imagen'}. Seleccione un archivo adecuado.`,
                padding: '2em',
            });
                inputElement.value = '';  // Clear the file input
                // form_control
                this.params_tbl_tema.get(form_control)!.setValue('');
                console.log(`Invalid file type for ${tipo_file}. Please select a ${tipo_file === 'vid' ? 'video' : 'image'} file.`);
        }else{
            this.selectedFiles[form_control] = file;
        }
        // this.params.get(form_control)?.setValue(file.name); // Optionally update the form control with the file name
    }
    
    isValidVideo(fileType: string): boolean {
        return ['video/mp4', 'video/webm'].includes(fileType);
    }

    isValidImage(fileType: string): boolean {
        return ['image/jpeg', 'image/png'].includes(fileType);
    }

    verArchivo(controlName: string) {
        const fileData = this.selectedFiles[controlName];
        if (fileData) {
            
            if (controlName === 'video_tema') {
                if (typeof fileData === 'string') {

                    const newWindow = window.open('', '', 'width=640,height=360');
                    newWindow!.document.write(`
                        <video width="640" height="360" controls>
                            <source src="${fileData}" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                    `);

                } else {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const fileData =reader.result as string
                        const newWindow = window.open('', '', 'width=640,height=360');
                        newWindow!.document.write(`
                            <video width="640" height="360" controls>
                                <source src="${fileData}" type="video/mp4">
                                Your browser does not support the video tag.
                            </video>
                        `);
                    };
                    reader.readAsDataURL(fileData);
                }
            }else{
                if (typeof fileData === 'string') {
                    const image = new Image();
                    image.src = fileData;
                    image.onload = () => {
                    const width = image.width;
                    const height = image.height;
                    const newWindow = window.open('', '', `width=${width},height=${height}`);
                    newWindow!.document.write(`<img src="${fileData}" width="${width}" height="${height}"/>`);
                    };
                } else {
                    const reader = new FileReader();
                    reader.onload = () => {
                    const image = new Image();
                    image.src = reader.result as string;
                    image.onload = () => {
                        const width = image.width;
                        const height = image.height;
                        const newWindow = window.open('', '', `width=${width},height=${height}`);
                        newWindow!.document.write(`<img src="${reader.result}" width="${width}" height="${height}"/>`);
                    };
                    };
                    reader.readAsDataURL(fileData);
                }
            }
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No se ha subido ningún archivo',
                padding: '2em',
              });
        }

        const fileUrl = this.params_tbl_tema.get(controlName)?.value ?? '';
    }
  
    EliminarArchivoAntesDeSubir(index: number) {
        // Verifica y elimina el archivo de la lista 'files'
        if (index > -1 && index < this.files.length) {
          this.files.splice(index, 1);
        }
    
        // Verifica si el array está vacío después de eliminar el archivo
        if (this.files.length === 0) {
          this.fileInputMultiple.nativeElement.value = '';
        }
    }
    
    EliminarArchivo(id_archivo_tema: number) {


        Swal.fire({
            title: "¿Estas seguro ?",
            text: "Usted no será capaz de revertir esto",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, eliminar!"
        }).then((result) => {
            if (result.isConfirmed) {



                        // // const formData = new FormData();
                        // // formData.append('id_archivo_tema', id_archivo_tema.toString()); // Convertir el número a string
                        this.gestioncursoservice.EliminarArchivoTema(id_archivo_tema).subscribe(
                            respuesta => {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Se elimino',
                                    text: '!',
                                    padding: '2em',
                                });

                                this.listarArchivos( this.data.id )

                            },
                            error => {
                                Swal.fire({
                                    icon: "error",
                                    title: "Oops...",
                                    text: "Algo sucedio con el servidor",
                                    padding: '2em',
                                });
                            }
                        );

            }
        });        
           
    }

    listarArchivos(id: number) {
        // listarPorcontenidobyId
        this.gestioncursoservice.listarPorTemaByType(id,'id').subscribe(
          resultado => {

            this.ListaArchivosSubidos(resultado[0].archivos)                       
          },
          error => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Algo sucedió con el servidor",
              padding: '2em',
            });
          }
        );
    }

  
}
