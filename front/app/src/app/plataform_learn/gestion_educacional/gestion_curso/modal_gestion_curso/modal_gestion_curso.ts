import { Component, OnInit,ViewChild,ElementRef,Renderer2  } from '@angular/core';
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
import { UsuariosCrudService } from 'src/app/services/usuarios/usuarios-crud.service';
import { ModalComponent } from 'angular-custom-modal';


import { Subscription } from 'rxjs';


@Component({
    selector: 'app-modal_gestion_curso.',
    templateUrl: './modal_gestion_curso.html',
    styleUrls: ['./modal_gestion_curso.css'],
    animations: [
        trigger('toggleAnimation', [
            transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
            transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
        ]),
    ],
})

export class ModalGestionCursoComponent implements OnInit  {
    @Output() eventoHijo = new EventEmitter<void>();
    private suscripcion: Subscription;

    // formulario_modal!: FormGroup;
    usuario_data: any={};
    data:  any={};
    params!: FormGroup;
    params_tbl_cont!: FormGroup;
    params_examen_curso!: FormGroup;
    
    usuarios_profesores: any =   [];
    usuarios_alumnos: any =   [];
    lista_secciones:any = [];
    selectedFiles: { [key: string]: File } = {};

    ContenidoCursoList: any =   [];

    Registro_ExamenCurso: any = [];

    intervalo: any;
    moment = moment; // Declare moment here
    isLoading = true;


    @ViewChild('ModalTblContenidos') ModalTblContenidos!: ModalComponent;
    @ViewChild('ModalExamenCurso') ModalExamenCurso!: ModalComponent;

    constructor(
        public fb: FormBuilder,
        public router: Router,
        private formBuilder: FormBuilder,
        public storeData: Store<any>,

        private usuarioscrudService: UsuariosCrudService,
        private gestioncursoservicegeneric: GestionCursoGenericService,
        private gestioncursoservice: GestionCursoService,
        private renderer: Renderer2
    ){
        this.initStore();
        
        this.suscripcion = this.gestioncursoservicegeneric.invocarFuncionPadre.subscribe((evento) => {
            switch (evento.accion) {
                case 'listar_curso_contenido':
                    this.ListarCursoContenido();
                break;
                case 'cerrar_modal_contenido':
                    this.ModalTablaContentsCerrar();
                break;
                case 'cerrar_modal_examen_curso':
                    this.ModalExamenCursoCerrar();
                break;
                case 'listar_examen_curso':
                    this.ListarExamenCurso();
                break;

               

              // Agrega más casos según sea necesario
              default:
                console.log('Acción no reconocida');
            }
        });
    }
    
    // data_profesor = [];
    // data_alumno = [];
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

    
    ngOnInit() {
        this.initForm();
        this.ListarProfesor();
        this.ListarAlumnos();
        this.InicializarDatos();
        this.ListarCursoContenido();

        this.ListarExamenCurso();

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

    // funciones del modal actual
    initForm() {
        this.params = this.fb.group({
            id: [0],
            nom_curso: ['', Validators.required],
            introdu_curso: ['', Validators.required],
            img_logo: ['', Validators.required],
            img_fondo: ['', Validators.required],
            vid_trailer: ['', Validators.required],
            vid_trailer_url:[''],
            resumen_curso: ['', Validators.required],
            acerca_curso: ['', Validators.required],
            sobre_autor: ['', Validators.required],
            profesor: [[], Validators.required],
            alumno: [[], Validators.required],
        });
    
        this.selectedFiles = {};


        this.params_tbl_cont = this.fb.group({
            id: [0],
        });

        this.params_examen_curso = this.fb.group({
            id: [0],
        });
    }

    InicializarDatos(){
       // Recuperar datos del servicio
       this.data = this.gestioncursoservicegeneric.getData();
       if (Object.keys(this.data).length === 0) {
           console.log('Data is null or undefined');
       } else {
    

        //    const alumnossArray = this.data.cursousuarios.map((item: any) => item.usuarios);
            const alumnossArray = this.data.cursousuarios
            .filter((item: any) => item.status === true) // Filtra los elementos con status true
            .map((item: any) => item.usuarios); // Mapea solo el campo usuarios de los elementos filtrados



           this.params.setValue({
               id: this.data.id,
               nom_curso: this.data.nom_curso,
               introdu_curso: this.data.introdu_curso,
               img_logo: '', 
               img_fondo:  '', 
               vid_trailer: '',
               vid_trailer_url:this.data.vid_trailer_url,
               resumen_curso: this.data.resumen_curso,
               acerca_curso: this.data.acerca_curso,
               sobre_autor: this.data.sobre_autor,
               profesor:  this.data.docente,
               alumno:  alumnossArray ,
           });

           this.selectedFiles['img_logo'] = this.data.img_logo;
           this.selectedFiles['img_fondo'] = this.data.img_fondo;
           this.selectedFiles['vid_trailer'] = this.data.vid_trailer;
       }       
    } 

    ListarProfesor() {
        this.usuarioscrudService.listar().subscribe((data) => {
            var filas: any[] =  [];
            for (const item of data) {
                console.log("🚀 ~ this.usuarioscrudService.listar ~ item.perfil_data.rol:", item.perfil_data.rol)

                if(item.perfil_data.rol ==4){
                    const objeto = {
                        value:item['id'],
                        label: item['first_name'] +' '+item['last_name']+ ' ('+item['username']+ ')'
                    };
                    filas.push(objeto);
                }
                  
            }
            this.usuarios_profesores=filas
        })
    }

    ListarAlumnos() {
        this.usuarioscrudService.listar().subscribe((data) => {
            var filas: any[] =  [];
            for (const item of data) {
                // if (item.perfil_data.rol === 1 || item.perfil_data.rol === 2) {
                console.log("🚀 ~ this.usuarioscrudService.listar ~ item.perfil_data.rol:", item.perfil_data.rol)

                if (item.perfil_data.rol === 1 || item.perfil_data.rol === 2) {

                    const objeto = {
                        value: item.id,
                        label: `${item.first_name} ${item.last_name} (${item.username})`
                    };
                    filas.push(objeto);
                }
            }
            this.usuarios_alumnos=filas
        })
    }


       // userme

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
            this.params.get(form_control)!.setValue('');
            console.log(`Invalid file type for ${tipo_file}. Please select a ${tipo_file === 'vid' ? 'video' : 'image'} file.`);
        }else{
            this.selectedFiles[form_control] = file;

        }
    


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
            
            if (controlName === 'vid_trailer') {

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

        const fileUrl = this.params.get(controlName)?.value ?? '';
    }

    GuardarDataCurso() {
        const formData = new FormData();
    
        const nom_curso = this.params.get('nom_curso')?.value ?? '';
        if (!nom_curso) {
            Swal.fire({ icon: "error", title: "Oops...", text: "Debe ingresar el nombre del curso",
                padding: '2em',
                 });
            return;
        }
    
        const introdu_curso = this.params.get('introdu_curso')?.value ?? '';
        if (!introdu_curso) {
            Swal.fire({ icon: "error", title: "Oops...", text: "Debe ingresar la introducción del curso",
                padding: '2em',
                 });
            return;
        }
    
        const resumen_curso = this.params.get('resumen_curso')?.value ?? '';
        if (!resumen_curso) {
            Swal.fire({ icon: "error", title: "Oops...", text: "Debe ingresar el resumen del curso",
                padding: '2em',
                 });
            return;
        }
    
        const acerca_curso = this.params.get('acerca_curso')?.value ?? '';
        if (!acerca_curso) {
            Swal.fire({ icon: "error", title: "Oops...", text: "Debe ingresar los datos acerca del curso",
                padding: '2em',
                 });
            return;
        }
    
        const sobre_autor = this.params.get('sobre_autor')?.value ?? '';
        if (!sobre_autor) {
            Swal.fire({ icon: "error", title: "Oops...", text: "Debe ingresar datos sobre el autor",
                padding: '2em',
                 });
            return;
        }
    
        const profesor = this.params.get('profesor')?.value ?? '';
        if (!profesor || profesor.length === 0) {
            Swal.fire({ icon: "error", title: "Oops...", text: "Debe seleccionar a un profesor",
                padding: '2em',
                 });
            return;
        }
    
        const alumno = this.params.get('alumno')?.value ?? '';
        if (!alumno || alumno.length === 0) {
            Swal.fire({ icon: "error", title: "Oops...", text: "Debe seleccionar a los alumnos",
                padding: '2em',
                 });
            return;
        }

        const id = Object.keys(this.data).length === 0 ? 0 : this.data.id;

        if(id == 0){

            const img_logo = this.params.get('img_logo')?.value ?? '';
            if (!img_logo) {
                Swal.fire({ icon: "error", title: "Oops...", text: "Debe subir la imagen del logo del curso",
                    padding: '2em',
                     });
                return;
            }
        
            const img_fondo = this.params.get('img_fondo')?.value ?? '';
            if (!img_fondo) {
                Swal.fire({ icon: "error", title: "Oops...", text: "Debe subir la imagen de fondo del curso" ,
                    padding: '2em',
                    });
                return;
            }
        
            const vid_trailer = this.params.get('vid_trailer')?.value ?? '';
            if (!vid_trailer) {
                Swal.fire({ icon: "error", title: "Oops...", text: "Debe subir el video trailer del curso",
                    padding: '2em',
                     });
                return;
            }

            formData.append('id', id.toString());

            formData.append('nom_curso', nom_curso);
            formData.append('introdu_curso', introdu_curso);
        
            formData.append('img_logo', this.selectedFiles['img_logo']);
            formData.append('img_fondo', this.selectedFiles['img_fondo']);
            formData.append('vid_trailer', this.selectedFiles['vid_trailer']);
        
            formData.append('resumen_curso', resumen_curso);
            formData.append('acerca_curso', acerca_curso);
            formData.append('sobre_autor', sobre_autor);
            formData.append('docente', profesor);
        
            const usuariosString = JSON.stringify(alumno);
            formData.append('alumno', usuariosString);
        
            formData.append("usuario_reg", localStorage.getItem("current_user") ?? '');
            formData.append('creado', moment().format("YYYY-MM-DD HH:mm:ss"));
            formData.append('status', 'true');

            setTimeout(() => {
                this.storeData.dispatch({ type: 'toggleMainLoader', payload: true });
            }, 500);

        
            this.gestioncursoservicegeneric.registrar(formData).subscribe(
                respuesta => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Se registro',
                        text: '!',
                        padding: '2em',
                        
                    });
                    this.eventoHijo.emit();
                    this.notificarPadre("listar_cursos");
                    this.notificarPadre("cerrar_modal_curso");
                    this.ListarCursoContenido();

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

            formData.append('id', id.toString());

            formData.append('nom_curso', nom_curso);
            formData.append('introdu_curso', introdu_curso);
        
            formData.append('img_logo', this.selectedFiles['img_logo']);
            formData.append('img_fondo', this.selectedFiles['img_fondo']);
            formData.append('vid_trailer', this.selectedFiles['vid_trailer']);
        
            formData.append('resumen_curso', resumen_curso);
            formData.append('acerca_curso', acerca_curso);
            formData.append('sobre_autor', sobre_autor);
            formData.append('docente', profesor);
        
            const usuariosString = JSON.stringify(alumno);
            formData.append('alumno', usuariosString);

            formData.append('status', 'true');
            formData.append("usuario_act", localStorage.getItem("current_user") ?? '');
            formData.append('editado', moment().format("YYYY-MM-DD HH:mm:ss"));
        

            setTimeout(() => {
                this.storeData.dispatch({ type: 'toggleMainLoader', payload: true });
            }, 500);


            this.gestioncursoservicegeneric.modificar(formData,id).subscribe(
                respuesta => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Se registro',
                        text: '!',
                        padding: '2em',
                        
                    });
                    this.eventoHijo.emit();
                    this.notificarPadre("listar_cursos");
                    this.notificarPadre("cerrar_modal_curso");
                    this.ListarCursoContenido();

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
        }
    }

    // funciones modal tabla de contenidos o referidos a este componente

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

    notificarPadre(accion: string) {
        const valor = { mensaje: `¡Hola desde el hijo para ${accion}!` };
        this.gestioncursoservicegeneric.llamarFuncionPadre(accion, valor);
    }
    
    CerrarModal() {
        this.eventoHijo.emit();
        this.notificarPadre("cerrar_modal");          
    }
    

    // contenido

    ListarCursoContenido(){
        var id_curso=this.data.id;

        if (typeof id_curso === 'undefined') {
            console.log('La variable es undefined.');
        }else{
            this.gestioncursoservice.listarPorcontenidobyCurso(id_curso).subscribe(
                (data) => {
                    this.ContenidoCursoList = data
                    console.log("🚀 ~ ListarAlumnos ~ this.ContenidoCursoList:", this.ContenidoCursoList)
                
                },
                (error) => {
                    if(error.status == 401){
                    this.logout();
                    }
                }
            )  
        }
    }

    ModalTablaContentsOpen(fila_datos: any = null){
        setTimeout(() => {
            this.scrollToPosition();
        }, 3000);
        this.ModalTblContenidos.open()
        // this.initForm();
        if (fila_datos== null) {
                const id = this.params.get('id')?.value ?? '';
                var datas : any={curso:id};
                this.gestioncursoservicegeneric.setData(datas);
            return
        }else{
            this.params_tbl_cont.setValue({
                id: fila_datos.id,
            });
            this.gestioncursoservicegeneric.setData(fila_datos);
        }
    }

    EliminarContenidoCurso(fila_datos: any = null){

        console.log("🚀 ~ ModalGestionCursoComponent ~ ModalTablaContentsOpen ~ fila_datos:", fila_datos)

         
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

                this.gestioncursoservice.EliminarContenidoCursp(fila_datos.id).subscribe(
                    (data) => {

                        this.eventoHijo.emit();
                        this.notificarPadre("listar_curso_contenido");
                        Swal.fire({
                            title: "Eliminado!",
                            text: "El registro ha sido eliminado",
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

    ModalTablaContentsCerrar(){
        this.ModalTblContenidos.close()
        // var datas : any[] =[{id: null, role_name: null, description: null, acronimo: null}];
        // this.dataService.setData(datas);
        this.params_tbl_cont.setValue({
            id:  [0],
        });
    }
    
    //---------------

    ModalExamenCursoOpen(fila_datos: any = null){
        setTimeout(() => {
            this.scrollToPosition();
        }, 3000);
        this.ModalExamenCurso.open()
        // this.initForm();
        if (fila_datos== null) {
                const id = this.params.get('id')?.value ?? '';
                var datas : any={curso:id};
                this.gestioncursoservicegeneric.setData(datas);
            return
        }else{
            this.params_examen_curso.setValue({
                id: fila_datos[0].id,
            });
            this.gestioncursoservicegeneric.setData(fila_datos[0]);
        }
    }

    ModalExamenCursoCerrar(){
        this.ModalExamenCurso.close()
        // var datas : any[] =[{id: null, role_name: null, description: null, acronimo: null}];
        // this.dataService.setData(datas);
        this.params_examen_curso.setValue({
            id:  [0],
        });
    }

    ListarExamenCurso(){
        var id_curso=this.data.id;
        if (typeof id_curso === 'undefined') {
            console.log('La variable es undefined.');
        }else{
            this.gestioncursoservice.ListExamenCurso('curso',id_curso).subscribe(
                (data) => {
                    this.Registro_ExamenCurso = data
                    console.log("🚀 ~ ListarAlumnos ~ this.ExamenCursoSerializer:", this.Registro_ExamenCurso)
                },
                (error) => {
                    if(error.status == 401){
                    this.logout();
                    }
                }
            )  
        }
    }
}
