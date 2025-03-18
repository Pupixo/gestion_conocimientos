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
    selector: 'app-modal_quiz.',
    templateUrl: './modal_quiz.html',
    styleUrls: ['./modal_quiz.css'],
    animations: [
        trigger('toggleAnimation', [
            transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
            transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
        ]),
    ],
})

export class ModalQuizComponent implements OnInit  {
    @Output() eventoHijo = new EventEmitter<void>();
    private suscripcion: Subscription;


    formulario_modal!: FormGroup;
    usuario_data: any={};
    data: any={};
    params_quiz!: FormGroup;
    params_preguntas!: FormGroup;

    selectedFiles: { [key: string]: File } = {};

    @ViewChild('ModalPreguntas') ModalPreguntas!: ModalComponent;

    constructor(
        public fb: FormBuilder,
        public router: Router,
        private formBuilder: FormBuilder,
        public storeData: Store<any>,
        private gestioncursoservicegeneric: GestionCursoGenericService,
        private gestioncursoservice: GestionCursoService,
        private renderer: Renderer2
    ){
        this.initStore();
        this.suscripcion = this.gestioncursoservicegeneric.invocarFuncionPadre.subscribe((evento) => {
            switch (evento.accion) {
                case 'listar_preguntas_quiz':
                    this.ListarPreguntasQuiz();
                break;
                case 'cerrar_modal_preguntas':
                    this.ModalPreguntasCerrar();
                break;
              // Agrega más casos según sea necesario
              default:
                console.log('Acción no reconocida');
            }
        });
    }

    tiempomascara = [/\d/, /\d/, ':', /\d/, /\d/];
    store: any;
    async initStore() {
        this.storeData
            .select((d) => d.index)
            .subscribe((d) => {
                this.store = d;
            });
    }

    PreguntasQuizList: any[] = [];

    columnasPreguntasQuiz = [
        { field: 'id', title: 'ID', isUnique: true, filter: false, hide: true },
        { field: 'pregunta', title: 'Pregunta' },
        { field: 'opcion1', title: 'Opción 1' },
        { field: 'opcion2', title: 'Opción 2' },
        { field: 'opcion3', title: 'Opción 3' },
        { field: 'opcion4', title: 'Opción 4' },
        { field: 'opcion5', title: 'Opción 5' },
        { field: 'action', title: 'Acciones', sort: false  ,filter: false}
    ];

    initForm() {
        this.params_quiz = this.fb.group({
            id: [0],
            contenido: ['', Validators.required],
            titulo_quiz: ['', Validators.compose([Validators.required, Validators.email])],
            tiempo_quiz: ['', Validators.required],
            imagen_quiz: ['', Validators.required],
            objetivo_quiz: ['', Validators.required],
        });

        this.params_preguntas = this.fb.group({
            id: [0],
        });

    }

    ngOnInit() {
        this.initForm();
        this.InicializarDatos();

        this.ListarPreguntasQuiz();
        setTimeout(() => {

            this.scrollToPosition();
        }, 3000);
    }

    scrollToPosition() {
        this.renderer.listen('window', 'load', () => {
          window.scroll({
            top: 100,
            left: 100,
            behavior: 'smooth'
          });
        });
    }

    InicializarDatos(){
       // Recuperar datos del servicio
       this.data = this.gestioncursoservicegeneric.getData();

       if (Object.keys(this.data).length === 1) {
        console.log('Data is null or undefined');
            this.params_quiz.patchValue({
                contenido: this.data.contenido,
                // Add other fields if necessary
            });
       } else {
            this.params_quiz.patchValue({
                id: this.data.id,
                contenido: this.data.contenido,
                titulo_quiz: this.data.titulo_quiz,
                objetivo_quiz: this.data.objetivo_quiz,
                tiempo_quiz: this.data.tiempo_quiz,
            });
            this.selectedFiles['imagen_quiz'] = this.data.imagen_quiz;
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

    notificarPadre(accion: string) {
        const valor = { mensaje: `¡Hola desde el hijo para ${accion}!` };
        this.gestioncursoservicegeneric.llamarFuncionPadre(accion, valor);
    }
    
    CerrarModal() {
        this.eventoHijo.emit();
        this.notificarPadre("cerrar_modal");          
    }
    
    ListarPreguntasQuiz(){
        var id_quiz=this.data.id;

        if (typeof id_quiz === 'undefined') {
            
        }else{
            this.gestioncursoservice.ListPreguntasContenido('quiz',id_quiz).subscribe(
                (data) => {
                        console.log("🚀 ~ ModalQuizComponent ~ ListarPreguntasQuiz ~ data:", data)
                            // var filas: any[] =  [];
                            // for (const item of data) {

                            //     const objeto = {
                            //         id:item['id'],
                            //         nom_curso:item['nom_curso'],
                            //         acerca_curso:item['acerca_curso'],
                            //         resumen_curso:item['resumen_curso'],
                            //         introdu_curso:item['introdu_curso'],
                            //         sobre_autor:item['sobre_autor'],

                            //         cant_tiempo:item['id'],
                            //         cant_contenidos:item['id'],

                            //         docente_data:item['docente_data'],
                            //         docente:item['docente'],

                            //         img_fondo:item['img_fondo'],
                            //         img_logo:item['img_logo'],
                            //         vid_trailer_url: item['vid_trailer_url'],
                            //         vid_trailer: item['vid_trailer'],

                            //         creado: item['creado'] ,

                            //         usuario_reg:item['usuario_reg'],
                            //         status:item['status'],

                            //         cursousuarios:item['cursousuarios'],
                            //     };

                            //     filas.push(objeto);
                            // };
                        this.PreguntasQuizList=data;
                        console.log("🚀 ~ ModalTablaContenidoComponent ~  this.PreguntasQuizList:",  this.PreguntasQuizList);

                },
                (error) => {
                    if(error.status == 401){
                    this.logout();
                    }
                }
            )  
        }
    }

    GuardarDataCursoTblContenido() {
        const formData = new FormData();
        const id = Object.keys(this.data).length === 1 ? 0 : this.data.id;

        const titulo_quiz = this.params_quiz.get('titulo_quiz')?.value ?? '';
        if (!titulo_quiz) {
            Swal.fire({ icon: "error", title: "Oops...", text: "Debe ingresar el titulo para el quiz",
                padding: '2em',
                 });
            return;
        }
    
        const tiempo_quiz = this.params_quiz.get('tiempo_quiz')?.value ?? '';
        if (!tiempo_quiz) {
            Swal.fire({ icon: "error", title: "Oops...", text: "Debe ingresar el tiempo del quiz",
                padding: '2em',
                 });
            return;
        }

        const objetivo_quiz = this.params_quiz.get('objetivo_quiz')?.value ?? '';
        if (!objetivo_quiz) {
            Swal.fire({ icon: "error", title: "Oops...", text: "Debe ingresar el onjetivo del quiz",
                padding: '2em',
                 });
            return;
        }

        if(id == 0){
            const imagen_quiz = this.params_quiz.get('imagen_quiz')?.value ?? '';
            if (!imagen_quiz) {
                // Swal.fire({ icon: "error", title: "Oops...", text: "Debe ingresar la imagen del quiz" });
                // return;
            }else{
                formData.append('imagen_quiz', this.selectedFiles['imagen_quiz']);
            }

            var tiempo_quiz_update = tiempo_quiz+':00'

            formData.append('contenido', this.data.contenido);
            formData.append('titulo_quiz', titulo_quiz);
            formData.append('objetivo_quiz', objetivo_quiz);
            formData.append('tiempo_quiz', tiempo_quiz_update);
            
            formData.append("usuario_reg", localStorage.getItem("current_user") ?? '');
            formData.append('creado', moment().format("YYYY-MM-DD HH:mm:ss"));
            formData.append('status', 'true');
        
            this.gestioncursoservice.registrarQuizContenido(formData).subscribe(
                respuesta => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Se registro',
                        text: '!',
                        padding: '2em',
                        
                    });
                    this.eventoHijo.emit();
                    this.notificarPadre("cerrar_modal_quiz");
                    this.notificarPadre("listar_quiz_contenido");
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

            var imagen_quiz = this.params_quiz.get('imagen_quiz')?.value ?? '';
            if (!imagen_quiz) {
                imagen_quiz= null
            }else{
                imagen_quiz=this.selectedFiles['imagen_quiz'];
                formData.append('imagen_quiz', imagen_quiz);

            }                
            
            formData.append('contenido', this.data.contenido);
            formData.append('titulo_quiz', titulo_quiz);
            formData.append('objetivo_quiz', objetivo_quiz);
            formData.append('tiempo_quiz', tiempo_quiz);
            formData.append('status', 'true');

            formData.append("usuario_act", localStorage.getItem("current_user") ?? '');
            formData.append('editado', moment().format("YYYY-MM-DD HH:mm:ss"));

            this.gestioncursoservice.EditarQuizContenido(formData,id).subscribe(
                respuesta => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Se Actualizo',
                        text: '!',
                        padding: '2em',
                        
                    });
                    this.eventoHijo.emit();
                    this.notificarPadre("listar_quiz_contenido");
                    // this.listarPreguntas( this.data.id )
                    // this.notificarPadre("cerrar_modal");
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

    subirArchivo(event: any, tipo_file: string, form_control: string) {
        console.log("🚀 ~ ModalGestionCursoComponent ~ subirArchivo ~ tipo_file:", tipo_file);
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
    
        if  (tipo_file === 'img' && !this.isValidImage(file.type)) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `Tipo de archivo no válido para imagen. Seleccione un archivo adecuado.`,
                padding: '2em',
                
            });
                inputElement.value = '';  // Clear the file input
                // form_control
                this.params_quiz.get(form_control)!.setValue('');
                console.log(`Invalid file type for ${tipo_file}. Please select a image file.`);
        }else{
            this.selectedFiles[form_control] = file;
        }
        // this.params.get(form_control)?.setValue(file.name); // Optionally update the form control with the file name
    }

    isValidImage(fileType: string): boolean {
        return ['image/jpeg', 'image/png'].includes(fileType);
    }

    verArchivo(controlName: string) {
        const fileData = this.selectedFiles[controlName];
        if (fileData) {
            console.log("🚀 ~ ModalGestionCursoComponent ~ verArchivo ~ fileData:", fileData)
            
            
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
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No se ha subido ningún archivo',
                padding: '2em',
                
              });
        }
       
        const fileUrl = this.params_quiz.get(controlName)?.value ?? '';
        console.log("🚀 ~ ModalGestionCursoComponent ~ verArchivo ~ fileUrl:", fileUrl)
    }
    
    ModalPreguntasOpen(fila_datos: any = null){
        console.log("🚀 ~ ModalTablaContenidoComponent ~ ModalPreguntas ~ fila_datos:", fila_datos)
        this.ModalPreguntas.open()
        // this.initForm();
        if (fila_datos== null) {
                const id = this.params_quiz.get('id')?.value ?? '';
                var datas : any={quiz:id};
                this.gestioncursoservicegeneric.setData(datas);
            return
        }else{
            this.params_preguntas.patchValue({
                id: fila_datos.id,
            });
            this.gestioncursoservicegeneric.setData(fila_datos);
        }
    }

    ModalPreguntasCerrar(){
        this.ModalPreguntas.close()
        this.params_preguntas.setValue({
            id:  [0],
        });
    }
    
    EliminarPregunta(fila_datos: any = null){

        console.log("🚀 ~ ModalQuizComponent ~ EliminarPregunta ~ fila_datos:", fila_datos)
            
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

                    this.gestioncursoservice.EliminarPreguntasContenidoId(fila_datos.id).subscribe(
                        (data) => {

                            this.eventoHijo.emit();
                            this.notificarPadre("listar_preguntas_quiz");
                            Swal.fire({
                                title: "Eliminado!",
                                text: "Tu data ha sido eliminado",
                                icon: "success",
                                padding: '2em',
                                
                            });


                            // this.TemasContenidoList = data
                            // console.log("🚀 ~ ModalTablaContenidoComponent ~  this.TemasContenidoList:",  this.TemasContenidoList)
                        
                            // this.notificarPadre("listar_curso_contenido");
                        },
                        (error) => {
                            if(error.status == 401){
                            this.logout();
                            }
                        }
                    )    

            
                }
            });        
       
    }
  
}
