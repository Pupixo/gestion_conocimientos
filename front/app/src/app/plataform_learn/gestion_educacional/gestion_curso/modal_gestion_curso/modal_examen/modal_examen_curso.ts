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
    selector: 'app-modal_examen_curso.',
    templateUrl: './modal_examen_curso.html',
    styleUrls: ['./modal_examen_curso.css'],
    animations: [
        trigger('toggleAnimation', [
            transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
            transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
        ]),
    ],
})

export class ModalExamenCursoComponent implements OnInit  {
    @Output() eventoHijo = new EventEmitter<void>();
    private suscripcion: Subscription;


    formulario_modal!: FormGroup;
    usuario_data: any={};
    data: any={};
    params_examen!: FormGroup;
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
                case 'listar_preguntas_examen_curso':
                    this.ListarPreguntasExamenCurso();
                break;
                case 'cerrar_modal_preguntas_examen_curso':
                    this.ModalPreguntasExamenCerrar();
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

    PreguntasExamenCursoList: any[] = [];

    columnasPreguntasExamen = [
        { field: 'id', title: 'ID', isUnique: true, filter: false, hide: true },
        { field: 'pregunta', title: 'Pregunta' },
        { field: 'opcion1', title: 'Opción 1' },
        { field: 'opcion2', title: 'Opción 2' },
        { field: 'opcion3', title: 'Opción 3' },
        { field: 'opcion4', title: 'Opción 4' },
        { field: 'opcion5', title: 'Opción 5' },
        { field: 'action', title: '', sort: false  ,filter: false}
    ];

    initForm() {
        this.params_examen = this.fb.group({
            id: [0],
            curso: ['', Validators.required],
            titulo_examen: ['', Validators.compose([Validators.required, Validators.email])],
            tiempo_examen: ['', Validators.required],
            imagen_examen: ['', Validators.required],
            objetivo_examen: ['', Validators.required],
        });

        this.params_preguntas = this.fb.group({
            id: [0],
        });

    }

    ngOnInit() {
        this.initForm();
        this.InicializarDatos();
        this.ListarPreguntasExamenCurso();
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
       console.log("🚀 ~ ModalExamenCursoComponent ~ InicializarDatos ~ this.data:", this.data)

       if (Object.keys(this.data).length === 1) {
        console.log('Data is null or undefined');
            this.params_examen.patchValue({
                curso: this.data.curso,
                // Add other fields if necessary
            });
       } else {
        console.log('----------------------------------------');

            this.params_examen.patchValue({
                id: this.data.id,
                curso: this.data.curso,
                titulo_examen: this.data.titulo_examen,
                objetivo_examen: this.data.objetivo_examen,
                tiempo_examen: this.data.tiempo_examen,
            });
            this.selectedFiles['imagen_examen'] = this.data.imagen_examen;
            console.log('---------------------------------------------');

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
                this.params_examen.get(form_control)!.setValue('');
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
       
        const fileUrl = this.params_examen.get(controlName)?.value ?? '';
        console.log("🚀 ~ ModalGestionCursoComponent ~ verArchivo ~ fileUrl:", fileUrl)
    }
        
    CerrarModal() {
        this.eventoHijo.emit();
        this.notificarPadre("cerrar_modal");          
    }
    
    ListarPreguntasExamenCurso(){
        var id_examen_curso=this.data.id;

        if (typeof id_examen_curso === 'undefined') {
            
        }else{
            this.gestioncursoservice.ListPreguntasExamenCurso('examen_curso',id_examen_curso).subscribe(
                (data) => {
                        this.PreguntasExamenCursoList=[];
                        this.PreguntasExamenCursoList=data;
                        console.log("🚀 ~ ModalExamenCursoComponent ~ ListarPreguntasExamenCurso ~ this.PreguntasExamenCursoList:", this.PreguntasExamenCursoList)

                        this.PreguntasExamenCursoList = this.PreguntasExamenCursoList.map((row) => {
                            return {
                                ...row,
                                color_correcto1: this.ColorRespuestaCorrecta(row,0),
                                color_correcto2: this.ColorRespuestaCorrecta(row,1),
                                color_correcto3: this.ColorRespuestaCorrecta(row,2),
                                color_correcto4: this.ColorRespuestaCorrecta(row,3),
                                color_correcto5: this.ColorRespuestaCorrecta(row,4),

                            };
                        });
                        console.log("🚀 ~ ModalExamenCursoComponent ~ this.PreguntasExamenCursoList=this.PreguntasExamenCursoList.map ~ this.PreguntasExamenCursoList:", this.PreguntasExamenCursoList)

                },
                (error) => {
                    if(error.status == 401){
                    this.logout();
                    }
                }
            )  
        }
    }

    GuardarDataExamenCurso() {
        const formData = new FormData();
        const id = Object.keys(this.data).length === 1 ? 0 : this.data.id;

        const titulo_examen = this.params_examen.get('titulo_examen')?.value ?? '';
        if (!titulo_examen) {
            Swal.fire({ icon: "error", title: "Oops...", text: "Debe ingresar el titulo para el quiz",
                padding: '2em',
                 });
            return;
        }
    
        const tiempo_examen = this.params_examen.get('tiempo_examen')?.value ?? '';
        if (!tiempo_examen) {
            Swal.fire({ icon: "error", title: "Oops...", text: "Debe ingresar el tiempo del quiz",
                padding: '2em',
                 });
            return;
        }

        const objetivo_examen = this.params_examen.get('objetivo_examen')?.value ?? '';
        if (!objetivo_examen) {
            Swal.fire({ icon: "error", title: "Oops...", text: "Debe ingresar el onjetivo del quiz",
                padding: '2em',
                 });
            return;
        }

        if(id == 0){
            const imagen_examen = this.params_examen.get('imagen_examen')?.value ?? '';
            if (!imagen_examen) {
                // Swal.fire({ icon: "error", title: "Oops...", text: "Debe ingresar la imagen del quiz" });
                // return;
            }else{
                formData.append('imagen_examen', this.selectedFiles['imagen_examen']);
            }

            var tiempo_examen_update = tiempo_examen+':00'

            formData.append('curso', this.data.curso);
            formData.append('titulo_examen', titulo_examen);
            formData.append('objetivo_examen', objetivo_examen);
            formData.append('tiempo_examen', tiempo_examen_update);
            
            formData.append("usuario_reg", localStorage.getItem("current_user") ?? '');
            formData.append('creado', moment().format("YYYY-MM-DD HH:mm:ss"));
            formData.append('status', 'true');
        
            this.gestioncursoservice.registrarExamenCurso(formData).subscribe(
                respuesta => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Se registro',
                        text: '!',
                        padding: '2em',
                        
                    });
                    this.eventoHijo.emit();
                    this.notificarPadre("cerrar_modal_examen_curso");
                    this.notificarPadre("listar_examen_curso");
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

            var imagen_examen = this.params_examen.get('imagen_examen')?.value ?? '';
            if (!imagen_examen) {
                imagen_examen= null
            }else{
                imagen_examen=this.selectedFiles['imagen_examen'];
                formData.append('imagen_examen', imagen_examen);

            }                
            
            formData.append('curso', this.data.curso);
            formData.append('titulo_examen', titulo_examen);
            formData.append('objetivo_examen', objetivo_examen);
            formData.append('tiempo_examen', tiempo_examen);
            formData.append('status', 'true');

            formData.append("usuario_act", localStorage.getItem("current_user") ?? '');
            formData.append('editado', moment().format("YYYY-MM-DD HH:mm:ss"));

            this.gestioncursoservice.EditarExamenCurso(formData,id).subscribe(
                respuesta => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Se Actualizo',
                        text: '!',
                        padding: '2em',
                        
                    });
                    this.eventoHijo.emit();
                    this.notificarPadre("cerrar_modal_examen_curso");
                    // this.listarPreguntas( this.data.id )
                    this.notificarPadre("listar_examen_curso");
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

    ModalPreguntasExamenCursoOpen(fila_datos: any = null){
        this.ModalPreguntas.open()
        // this.initForm();
        if (fila_datos== null) {
                const id = this.params_examen.get('id')?.value ?? '';
                var datas : any={examen_curso:id};
                this.gestioncursoservicegeneric.setData(datas);
            return
        }else{
            this.params_preguntas.patchValue({
                id: fila_datos.id,
            });
            this.gestioncursoservicegeneric.setData(fila_datos);
        }
    }

    ModalPreguntasExamenCerrar(){
        this.ModalPreguntas.close()
        this.params_preguntas.setValue({
            id:  [0],
        });
    }
        
    EliminarPreguntaExamenCurso(fila_datos: any = null){

        console.log("🚀 ~ ModalQuizComponent ~ EliminarPreguntaExamenCurso ~ fila_datos:", fila_datos)
            
            Swal.fire({
                title: "¿Estas seguro ?",
                text: "Usted no será capaz de revertir esto",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Si, eliminar!",
                padding: '2em',
                
            }).then((result) => {
                if (result.isConfirmed) {

                    this.gestioncursoservice.EliminarPreguntasExamenCursoId(fila_datos.id).subscribe(
                        (data) => {

                            this.eventoHijo.emit();
                            this.notificarPadre("listar_preguntas_examen_curso");
                            Swal.fire({
                                title: "Eliminado!",
                                text: "Tu data ha sido eliminado",
                                icon: "success",
                                padding: '2em',
                                
                            });


                     
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
  

    ColorRespuestaCorrecta(fila:any,num: number) {
        console.log("🚀 ~ ModalExamenCursoComponent ~ ColorRespuestaCorrecta ~ num:", num)
        console.log("🚀 ~ ModalExamenCursoComponent ~ ColorRespuestaCorrecta ~ fila:", fila)
        var opcionesCorrectasArray = JSON.parse(fila.opciones_correctas); // Convierte el string a un array
        let arr = opcionesCorrectasArray;
        let val =arr.includes(num);

        if(val){
            return "cornflowerblue";
        }else{
            return "white";
        }
    }



    

}
