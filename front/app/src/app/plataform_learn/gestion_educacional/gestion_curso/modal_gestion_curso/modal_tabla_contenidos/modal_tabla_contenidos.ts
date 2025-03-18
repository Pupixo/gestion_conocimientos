import { Component, OnInit,ViewChild,ElementRef,Renderer2 } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormGroup , Validators } from '@angular/forms';
import Swiper, { Autoplay, Navigation, Pagination } from 'swiper';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

import * as moment from 'moment';
import 'moment/locale/es';

import 'moment-duration-format';

import { EventEmitter, Output } from '@angular/core';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';


import { GestionCursoGenericService } from 'src/app/services/gestion_curso/gestion_curso_generic.service';
import { GestionCursoService } from 'src/app/services/gestion_curso/gestion_curso.service';
import { ModalComponent } from 'angular-custom-modal';


import { Subscription } from 'rxjs';


@Component({
    selector: 'app-modal_tabla_contenidos.',
    templateUrl: './modal_tabla_contenidos.html',
    styleUrls: ['./modal_tabla_contenidos.css'],
    animations: [
        trigger('toggleAnimation', [
            transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
            transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
        ]),
    ],
})

export class ModalTablaContenidoComponent implements OnInit  {
    @Output() eventoHijo = new EventEmitter<void>();
    private suscripcion: Subscription;

    formulario_modal!: FormGroup;
    usuario_data: any={};
    data: any={};
    params_tbl_content!: FormGroup;
    params_quiz!: FormGroup;
    

    params_temas!: FormGroup;
    moment = moment; // Declare moment here


    files: File[] = [];

    fileEdit: any[] = [];


    @ViewChild('fileInputMultiple') fileInputMultiple!: ElementRef;
    @ViewChild('ModalQuiz') ModalQuiz!: ModalComponent;

    @ViewChild('ModalTemas') ModalTemas!: ModalComponent;

    


    selectedFiles: { [key: string]: File } = {};
    selectedFilesMultiple: { [key: string]: File | File[] } = {};

    QuizContenidoList: any =   [];
    TemasContenidoList: any =   [];
    isLoading = true;


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
                case 'listar_quiz_contenido':
                    this.ListarQuizContenido();
                break;
                case 'listar_tema_contenido':
                    this.ListarTemasContenido();
                break;
                case 'cerrar_modal_quiz':
                    this.ModalQuizCerrar();
                break;
                case 'cerrar_modal_tema':
                    this.ModalTemasOpenCerrar();
                break;


              // Agrega más casos según sea necesario
              default:
                console.log('Acción no reconocida');
            }
        });

    }

    store: any;
    // async initStore() {
    //     this.storeData
    //         .select((d) => d.index)
    //         .subscribe((d) => {
    //             this.store = d;
    //         });
    // }

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

      

    initForm() {

        this.params_tbl_content = this.fb.group({
            id: [0],
            curso: [0],
            titulo_content: ['', Validators.required],
            resumen_content: ['', Validators.compose([Validators.required, Validators.email])],
            video_content: ['', Validators.required],
            video_content_url: ['', Validators.required],
            img_fondo: ['', Validators.required],
        });
        
        
        this.params_quiz = this.fb.group({
            id: [0],
        });

        this.params_temas = this.fb.group({
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
        this.ListarTemasContenido();

        setTimeout(() => {
            this.scrollToTop();
        }, 3000);

        this.ListarQuizContenido()

    }

    getFileNameUrl(url: string): string {
        return url.split('/').pop() || '';
    }

    InicializarDatos(){

        this.data = this.gestioncursoservicegeneric.getData();
       
       if (Object.keys(this.data).length === 1) {
        console.log('Data is null or undefined');
      
            this.params_tbl_content.patchValue({
                curso: this.data.curso,
                // Add other fields if necessary
            });

       } else {

            this.params_tbl_content.patchValue({
                id: this.data.id,
                curso: this.data.curso,
                titulo_content: this.data.titulo_content,
                resumen_content: this.data.resumen_content,
            });

            this.selectedFiles['img_fondo'] = this.data.img_fondo;
            this.selectedFiles['video_content'] = this.data.video_content;

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

    GuardarDataCursoTblContenido() {
        const formData = new FormData();
        const id = Object.keys(this.data).length === 1 ? 0 : this.data.id;

        if(id == 0){

            const titulo_content = this.params_tbl_content.get('titulo_content')?.value ?? '';
            if (!titulo_content) {
                Swal.fire({ icon: "error", title: "Oops...", text: "Debe ingresar el titulo para el contenido",
                    padding: '2em',
                     });
                return;
            }
        
            formData.append('curso', this.data.curso);

            formData.append('titulo_content', titulo_content);

            formData.append("usuario_reg", localStorage.getItem("current_user") ?? '');
            formData.append('creado', moment().format("YYYY-MM-DD HH:mm:ss"));
            formData.append('status', 'true');
        

            setTimeout(() => {
                this.storeData.dispatch({ type: 'toggleMainLoader', payload: true });
            }, 500);

            this.gestioncursoservice.registrarContenido(formData).subscribe(
                respuesta => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Se registro',
                        text: '!',
                        padding: '2em',
                        
                    });
                    this.eventoHijo.emit();
                    this.notificarPadre("listar_curso_contenido");
                    this.notificarPadre("cerrar_modal_contenido");
                    setTimeout(() => {
                        this.storeData.dispatch({ type: 'toggleMainLoader', payload: false });
                    }, 500);

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

            const titulo_content = this.params_tbl_content.get('titulo_content')?.value ?? '';
            if (!titulo_content) {
                Swal.fire({ icon: "error", title: "Oops...", text: "Debe ingresar el titulo para el contenido",
                    padding: '2em',
                     });
                return;
            }
                  
            // formData.append('id', id.toString());
            formData.append('curso', this.data.curso);

            formData.append('titulo_content', titulo_content);            
            formData.append('status', 'true');

            formData.append("usuario_act", localStorage.getItem("current_user") ?? '');
            formData.append('editado', moment().format("YYYY-MM-DD HH:mm:ss"));
            setTimeout(() => {
                this.storeData.dispatch({ type: 'toggleMainLoader', payload: true });
            }, 500);
            this.gestioncursoservice.EditarContenidoCurso(formData,id).subscribe(
                respuesta => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Se Actualizo',
                        text: '!',
                        padding: '2em',
                        
                    });
                    this.eventoHijo.emit();
                    this.notificarPadre("listar_curso_contenido");
                    this.files=[]
                    setTimeout(() => {
                        this.storeData.dispatch({ type: 'toggleMainLoader', payload: false });
                    }, 500);
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

    notificarPadre(accion: string) {
        const valor = { mensaje: `¡Hola desde el hijo para ${accion}!` };
        this.gestioncursoservicegeneric.llamarFuncionPadre(accion, valor);
    }
    
    CerrarModal() {
        this.eventoHijo.emit();
        this.notificarPadre("cerrar_modal");          
    }

    ModalQuizOpen(fila_datos: any = null){
        setTimeout(() => {
            this.scrollToTop();
        }, 3000);
        console.log("🚀 ~ ModalTablaContenidoComponent ~ ModalQuizOpen ~ fila_datos:", fila_datos)
        this.ModalQuiz.open()
        // this.initForm();
        if (fila_datos== null) {
                const id = this.params_tbl_content.get('id')?.value ?? '';
                var datas : any={contenido:id};
                this.gestioncursoservicegeneric.setData(datas);
            return
        }else{
            this.params_quiz.setValue({
                id: fila_datos.id,
            });
            this.gestioncursoservicegeneric.setData(fila_datos);
        }
    }

    ModalQuizCerrar(){
        this.ModalQuiz.close()
        this.params_quiz.setValue({
            id:  [0],
        });
    }

    EliminarQuizContenido(fila_datos: any = null){

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

                this.gestioncursoservice.EliminarQuizContenidoId(fila_datos.id).subscribe(
                    (data) => {
                        // this.TemasContenidoList = data
                        // console.log("🚀 ~ ModalTablaContenidoComponent ~  this.TemasContenidoList:",  this.TemasContenidoList)
                        this.eventoHijo.emit();
                        this.notificarPadre("listar_quiz_contenido");
                        // this.notificarPadre("listar_curso_contenido");
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


    ListarQuizContenido(){
        var id_contenido=this.data.id;
        console.log("🚀 ~ ModalTablaContenidoComponent ~ id_contenido:", id_contenido)

        if (typeof id_contenido === 'undefined') {
            
        }else{
            this.gestioncursoservice.ListQuizContenido('contenido',id_contenido).subscribe(
                (data) => {
                    this.QuizContenidoList = data
                    console.log("🚀 ~ ModalTablaContenidoComponent ~  this.QuizContenidoList:",  this.QuizContenidoList)
                },
                (error) => {
                    if(error.status == 401){
                    this.logout();
                    }
                }
            )    
        }          
    }
  
    //// temas

    ListarTemasContenido(){
        var id_contenido=this.data.id;

        if (typeof id_contenido === 'undefined') {
            
        }else{
            this.gestioncursoservice.listarPorTemaByType(id_contenido,'contenido').subscribe(
                (data) => {
                    this.TemasContenidoList = data
                    console.log("🚀 ~ ModalTablaContenidoComponent ~  this.TemasContenidoList:",  this.TemasContenidoList)
                },
                (error) => {
                    if(error.status == 401){
                    this.logout();
                    }
                }
            )  

        }
             
    }



    ModalTemasOpen(fila_datos: any = null){
        setTimeout(() => {
            this.scrollToTop();
        }, 3000);
        this.ModalTemas.open()
        if (fila_datos== null) {
                const id = this.params_tbl_content.get('id')?.value ?? '';
                var datas : any={contenido:id};
                this.gestioncursoservicegeneric.setData(datas);
            return
        }else{
            this.params_temas.setValue({
                id: fila_datos.id,
            });
            this.gestioncursoservicegeneric.setData(fila_datos);
        }
    }

    
    ModalTemasOpenCerrar(){
        this.ModalTemas.close()
        this.params_temas.setValue({
            id:  [0],
        });
    }


    EliminartemasCurso(fila_datos: any = null){
        console.log("🚀 ~ ModalTablaContenidoComponent ~ EliminartemasCurso ~ fila_datos:", fila_datos)
        fila_datos.id         
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

                this.gestioncursoservice.EliminarTema(fila_datos.id).subscribe(
                    (data) => {
                        // this.TemasContenidoList = data
                        // console.log("🚀 ~ ModalTablaContenidoComponent ~  this.TemasContenidoList:",  this.TemasContenidoList)
                        this.eventoHijo.emit();
                        this.notificarPadre("listar_tema_contenido");
                        // this.notificarPadre("listar_curso_contenido");
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

    normalOptions = {
        multiDrag: true,
        group: "group",
        onEnd: (event: any) => {
            // console.log("🚀 ~ ModalCrudComponent ~ event onEnd:", event)
            
          // Handle the `onEnd` event here
        },
        onMove: (event: any) => {
        //   console.log("🚀 ~ ModalCrudComponent ~ event onMove:", event)
          // Handle the `onMove` event here
        },
        // Called when dragging element changes position
        onChange: (event: any) => {
            console.log("🚀 ~ ModalCrudComponent ~ event: Onchange", event)

            // this.seccionesSave();
            // same properties as onEnd
        }
    };

    onReorder(event: any) {
        const nuevoOrden = event.map((seccion: any) => seccion.id); // Supongamos que cada sección tiene un ID único
        console.log("🚀 ~ ModalGestionCursoComponent ~ onReorder ~ nuevoOrden:", nuevoOrden)
    
        // Enviar el nuevo orden al backend
        // this.http.patch(`/api/cursos/${cursoId}`, { ordenSecciones: nuevoOrden }).subscribe(
        //   (response) => {
        //     console.log('Orden de secciones actualizado correctamente');
        //   },
        //   (error) => {
        //     console.error('Error al actualizar el orden de las secciones', error);
        //   }
        // );
    }


    DuracionTiempo(timeString: string): string {
        const duration = moment.duration(timeString);
    
        const hours = duration.hours();
        const minutes = duration.minutes();
        const seconds = duration.seconds();
    
        const parts: string[] = [];
        if (hours > 0) parts.push(`${hours} hora${hours > 1 ? 's' : ''}`);
        if (minutes > 0) parts.push(`${minutes} minuto${minutes > 1 ? 's' : ''}`);
        if (seconds > 0) parts.push(`${seconds} segundo${seconds > 1 ? 's' : ''}`);
    
        return parts.join(', ');
      }
    


}
