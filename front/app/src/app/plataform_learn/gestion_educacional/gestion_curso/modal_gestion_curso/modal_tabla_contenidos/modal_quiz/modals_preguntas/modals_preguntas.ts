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


@Component({
    selector: 'app-modals_preguntas.',
    templateUrl: './modals_preguntas.html',
    styleUrls: ['./modals_preguntas.css'],
    animations: [
        trigger('toggleAnimation', [
            transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
            transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
        ]),
    ],
})

export class ModalPreguntasComponent implements OnInit  {
    @Output() eventoHijo = new EventEmitter<void>();
    formulario_modal!: FormGroup;
    usuario_data: any={};
    data: any={};
    params_quiz!: FormGroup;
    selectedFiles: { [key: string]: File } = {};


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
        // this.formulario_modal = this.formBuilder.group({
        //     rol_nom: [''],
        //     descrip: [''],
        //     acroni: ['']
        // });
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

    initForm() {
        this.params_quiz = this.fb.group({
            id: [0],
            quiz: ['', Validators.required],
            pregunta: ['', Validators.compose([Validators.required, Validators.email])],
          
            opcion1: ['', Validators.required],
            opcion1_correcta: [false],
            opcion2: ['', Validators.required],
            opcion2_correcta: [false],
            opcion3: [''],
            opcion3_correcta: [false],
            opcion4: [''],
            opcion4_correcta: [false],
            opcion5: [''],
            opcion5_correcta: [false],

            imagen_pregunta: ['', Validators.required],

        });

      
    }

    ngOnInit() {
        this.initForm();
        this.InicializarDatos();

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


    logout(){
        localStorage.clear();
        this.router.navigate(['/signin']);
    } 

    InicializarDatos(){
       // Recuperar datos del servicio
       this.data = this.gestioncursoservicegeneric.getData();
       console.log("🚀 ~ ModalPreguntasComponent ~ InicializarDatos ~ this.data:", this.data)

       if (Object.keys(this.data).length === 1) {
            console.log('Data is null or undefined');
            this.params_quiz.patchValue({
                quiz: this.data.quiz,
                // Add other fields if necessary
            });
       } else {
            this.params_quiz.patchValue({
                id: this.data.id,
                quiz: this.data.quiz,
                pregunta: this.data.pregunta,
                opcion1: this.data.opcion1,
                opcion2: this.data.opcion2,
                opcion3: this.data.opcion3,
                opcion4: this.data.opcion4,
                opcion5: this.data.opcion5,


            });

            let opciones_correctas: number[] = JSON.parse( this.data.opciones_correctas);
            console.log("🚀 ~ ModalPreguntasComponent ~ InicializarDatos ~ opciones_correctas:", opciones_correctas)

                    
            // Iterar sobre opciones_correctas y actualizar el formulario
            opciones_correctas.forEach(opcion => {

                console.log("🚀 ~ ModalPreguntasComponent ~ InicializarDatos ~ opcion:", opcion)

                switch (opcion) {
                    case 1:
                        this.params_quiz.patchValue({
                            opcion1_correcta:  [true],
                        });
                        break;
                    case 2:
                        this.params_quiz.patchValue({
                            opcion2_correcta:  [true],
                        });
                        break;
                    case 3:
                        this.params_quiz.patchValue({
                            opcion3_correcta:  [true],
                        });
                        break;
                    case 4:
                        this.params_quiz.patchValue({
                            opcion4_correcta:  [true],
                        });
                        break;
                    case 5:
                        this.params_quiz.patchValue({
                            opcion5_correcta:  [true],
                        });
                        break;
                    default:
                        // Handle unexpected values in opciones_correctas
                        break;
                }
            });


            this.selectedFiles['imagen_pregunta'] = this.data.imagen_pregunta;
       }
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

    GuardarDataPreguntas() {
        const formData = new FormData();
        const id = Object.keys(this.data).length === 1 ? 0 : this.data.id;

        const pregunta = this.params_quiz.get('pregunta')?.value ?? '';
        if (!pregunta) {
            Swal.fire({ icon: "error", title: "Oops...", text: "Debe ingresar el titulo para el quiz",
                padding: '2em',
                 });
            return;
        }
    
        const opcion1 = this.params_quiz.get('opcion1')?.value ?? '';
        if (!opcion1) {
            Swal.fire({ icon: "error", title: "Oops...", text: "Debe ingresar el tiempo del quiz",
                padding: '2em',
                 });
            return;
        }

        const opcion2 = this.params_quiz.get('opcion2')?.value ?? '';
        if (!opcion2) {
            Swal.fire({ icon: "error", title: "Oops...", text: "Debe ingresar el onjetivo del quiz",
                padding: '2em',
                 });
            return;
        }

        const opcion3 = this.params_quiz.get('opcion3')?.value ?? '';
        if (!opcion3) {
            Swal.fire({ icon: "error", title: "Oops...", text: "Debe ingresar el onjetivo del quiz",
                padding: '2em',
                 });
            return;
        }

        const opcion4 = this.params_quiz.get('opcion4')?.value ?? '';
        if (!opcion4) {
            Swal.fire({ icon: "error", title: "Oops...", text: "Debe ingresar el onjetivo del quiz",
                padding: '2em',
                 });
            return;
        }

        const opcion5 = this.params_quiz.get('opcion5')?.value ?? '';
        if (!opcion5) {
            Swal.fire({ icon: "error", title: "Oops...", text: "Debe ingresar el onjetivo del quiz",
                padding: '2em',
                 });
            return;
        }

        // Manejo de opciones correctas
        const opciones_correctas = [];

        if (this.params_quiz.get('opcion1_correcta')?.value) {
        opciones_correctas.push(0);
        }
        if (this.params_quiz.get('opcion2_correcta')?.value) {
        opciones_correctas.push(1);
        }
        if (this.params_quiz.get('opcion3_correcta')?.value) {
        opciones_correctas.push(2);
        }
        if (this.params_quiz.get('opcion4_correcta')?.value) {
        opciones_correctas.push(3);
        }
        if (this.params_quiz.get('opcion5_correcta')?.value) {
        opciones_correctas.push(4);
        }
        console.log("🚀 ~ ModalPreguntasComponent ~ GuardarDataPreguntas ~ opciones_correctas:", opciones_correctas)

        formData.append('opciones_correctas', JSON.stringify(opciones_correctas)); // Enviar opciones correctas como JSON string
        // formData.append('opciones_correctas',opciones_correctas); // Enviar opciones correctas como JSON string


        if(id == 0){
            var imagen_pregunta = this.params_quiz.get('imagen_pregunta')?.value ?? '';
            if (!imagen_pregunta) {
                imagen_pregunta= null

            }else{
                formData.append('imagen_pregunta', this.selectedFiles['imagen_pregunta']);
            }


            formData.append('quiz', this.data.quiz);
            formData.append('pregunta', pregunta);
            formData.append('opcion1', opcion1);
            formData.append('opcion2', opcion2);
            formData.append('opcion3', opcion3);
            formData.append('opcion4', opcion4);
            formData.append('opcion5', opcion5);

            
            formData.append("usuario_reg", localStorage.getItem("current_user") ?? '');
            formData.append('creado', moment().format("YYYY-MM-DD HH:mm:ss"));
            formData.append('status', 'true');
        
            this.gestioncursoservice.registrarPreguntasContenido(formData).subscribe(
                respuesta => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Se registro',
                        text: '!',
                        padding: '2em',
                        
                    });
                    this.eventoHijo.emit();
                    this.notificarPadre("listar_preguntas_quiz");
                    this.notificarPadre("cerrar_modal_preguntas");
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

            var imagen_pregunta = this.params_quiz.get('imagen_pregunta')?.value ?? '';
            if (!imagen_pregunta) {
                imagen_pregunta= null
            }else{
                imagen_pregunta=this.selectedFiles['imagen_pregunta']
                formData.append('imagen_pregunta',imagen_pregunta);

            }                
  
            formData.append('quiz', this.data.quiz);
            formData.append('pregunta', pregunta);
            formData.append('opcion1', opcion1);
            formData.append('opcion2', opcion2);
            formData.append('opcion3', opcion3);
            formData.append('opcion4', opcion4);
            formData.append('opcion5', opcion5);
            

            formData.append("usuario_act", localStorage.getItem("current_user") ?? '');
            formData.append('editado', moment().format("YYYY-MM-DD HH:mm:ss"));
            formData.append('status', 'true');

            this.gestioncursoservice.EditarPreguntasContenido(formData,id).subscribe(
                respuesta => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Se Actualizo',
                        text: '!',
                        padding: '2em',
                        
                    });
                    this.eventoHijo.emit();
                    this.notificarPadre("listar_preguntas_quiz");
                    this.notificarPadre("cerrar_modal_preguntas");
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
    
    // procesar imagenes y videos
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

  
}
