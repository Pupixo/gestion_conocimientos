import { Component, OnDestroy, OnInit,AfterViewInit,ViewChild,ElementRef, Renderer2 } from '@angular/core';
import {  HostListener } from '@angular/core';
import { slideDownUp } from '../../shared/animations';
import { animate, style, transition, trigger } from '@angular/animations';
import { TranslateService } from '@ngx-translate/core';
import Swiper, { Autoplay, Navigation, Pagination } from 'swiper';
import { LlamadaComponentesRutaArchivos } from 'src/app/services/ruta_archivos/llamada_componentes_ruta';
import Swal from 'sweetalert2';

import { Router, NavigationEnd,ActivatedRoute } from '@angular/router';

import { GestionCursoGenericService } from 'src/app/services/gestion_curso/gestion_curso_generic.service';
import { GestionCursoService } from 'src/app/services/gestion_curso/gestion_curso.service';

import * as moment from 'moment';
import 'moment/locale/es';
import 'moment-duration-format';



import { Store } from '@ngrx/store';
import * as CryptoJS from 'crypto-js';



@Component({
    moduleId: module.id,
    selector: 'app-examen-course.',
    templateUrl: './examen_course.html',
    styleUrls: ['./examen_course.css'],
    animations: [ slideDownUp,
        trigger('toggleAnimation', [
            transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
            transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
        ]),
    ],})

export class ExamenCourseComponent implements OnInit, OnDestroy {

    store: any;

    activeTab = 1;
    examenId!: string;
    CursoUsuId!: string;

    
    ExamenList : any = [];
    PreguntasDatas : any = [];

    tiempoInicial: number=0; // Tiempo inicial en segundos
    tiempoRestante: number=0; // Tiempo restante en segundos
    intervalId: any; // Para almacenar el ID del intervalo
  
    hoursLeft: number=0;
    minutesLeft: number=0;
    secondsLeft: number=0;

    boton_finalizar: number =0;

    // checkboxStates: boolean[][] = this.PreguntasDatas.map(() => [false, false, false, false, false]);
    checkboxStates: any;


    private countdownDate: moment.Moment | null = null; 
    @ViewChild('examPanel') examPanel!: ElementRef;
    // respuestas: { [key: number]: boolean[] } = {};

    constructor(
        private llama_componente: LlamadaComponentesRutaArchivos,
        public translate: TranslateService,
        public router: Router,
        public route: ActivatedRoute,
        private gestioncursoservicegeneric: GestionCursoGenericService,
        private gestioncursoservice: GestionCursoService,
        private elementRef: ElementRef,
        public storeData: Store<any>, 

    ) {
      // Inicializa las respuestas
    }
    
    async initStore() {
      this.storeData
        .select((d) => d.index)
        .subscribe((d) => {
            this.store = d;
        });
    }

    ngOnInit(): void {
       this.storeData.dispatch({ type: 'toggleSidebar' });
        const secretKey = 'clave-secreta-para-cifrado';
        var encryptedcourse_usuId= this.route.snapshot.paramMap.get('course_usuId')!;
        const bytes = CryptoJS.AES.decrypt( encryptedcourse_usuId, secretKey);
        this.CursoUsuId = bytes.toString(CryptoJS.enc.Utf8);

        this.ListarExamen();
        setTimeout(() => {
          this.tiempoInicial = this.convertirTiempoASegundos(this.ExamenList[0].tiempo_examen);
          this.tiempoRestante = this.tiempoInicial;
          this.iniciarContador();
        }, 2000);


        document.addEventListener('fullscreenchange', this.onFullScreenChange.bind(this) );
        setTimeout(() => {
          this.toggleFullScreen()
        }, 1500);
    }

    ngOnDestroy(): void {
      this.detenerContador();
      document.removeEventListener('fullscreenchange', this.onFullScreenChange.bind(this) );
    }

    ngAfterViewInit() {
      document.querySelectorAll('.select-none').forEach(element => {
        element.addEventListener('selectstart', (e) => {
          e.preventDefault();
        });
        element.addEventListener('copy', (e) => {
          e.preventDefault();
        });
      });
    }

    toggleFullScreen() {
      const elem = this.examPanel.nativeElement;
      if (!document.fullscreenElement) {
        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    }


    onCheckboxChange(index: number, opcionIndex: number, event: any) {
      const isChecked = event.target.checked;
      this.checkboxStates[index].opciones[opcionIndex - 1] = isChecked;
    }

    onFullScreenChange(){
      if(this.boton_finalizar == 0){
        if (!document.fullscreenElement) {
          // this.storeData.dispatch({ type: 'toggleSidebar' });
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Saliste del modo pantalla completa",
            padding: '2em',
            footer: '<span>En 10 segundos tu examen se cerrará sino vuelves a pantalla completa</span>',
          });

          setTimeout(() => {
            console.log("🚀 ~ ExamenCourseComponent ~ setTimeout ~ pasaron 10 segundos:");
            if (!document.fullscreenElement) {
              location.reload();
            }
          }, 10000);
        }
      }
    };
  
    // -----------------------------------------------------------------------------contador de tiempo
    iniciarContador(): void {
      this.actualizarTiempoFormateado(this.tiempoInicial);
      this.intervalId = setInterval(() => {

        if (this.tiempoRestante > 0) {
          this.tiempoRestante--;
          this.actualizarTiempoFormateado(this.tiempoRestante);
        } else {
          this.detenerContador();

          Swal.fire({
            title: "Tiempo Terminado",
            showClass: {
              popup: `
                animate__animated
                animate__fadeInUp
                animate__faster
              `
            },
            hideClass: {
              popup: `
                animate__animated
                animate__fadeOutDown
                animate__faster
              `
            }
          });

          setTimeout(() => {
            location.reload();
          }, 3000);
        }
      }, 1000); // Actualizar cada segundo (1000 ms)
    }
  
    detenerContador(): void {
      clearInterval(this.intervalId);
    }
    
    actualizarTiempoFormateado(tiempoSegundos: number): void {
      this.hoursLeft = Math.floor(tiempoSegundos / 3600);
      this.minutesLeft = Math.floor((tiempoSegundos % 3600) / 60);
      this.secondsLeft = tiempoSegundos % 60;
    }
    
    convertirTiempoASegundos(tiempo: string): number {
      if (!tiempo || tiempo.trim() === '') {
        return 0; // Manejar caso de cadena vacía o nula
      }
    
      const partes = tiempo.split(':');
      const horas = parseInt(partes[0], 10) || 0;
      const minutos = parseInt(partes[1], 10) || 0;
      const segundos = parseInt(partes[2], 10) || 0;
    
      return horas * 3600 + minutos * 60 + segundos;
    }

    //--------------------------------------------------------------- lista de datos
    obtenerElementosAleatorios(arr:any, numElementos:any) {
      // Copia el arreglo original para no modificarlo
      var arrCopia = arr.slice();
      // Baraja el arreglo utilizando el algoritmo de Fisher-Yates
      for (var i = arrCopia.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var temp = arrCopia[i];
          arrCopia[i] = arrCopia[j];
          arrCopia[j] = temp;
      }
  
      return arrCopia.slice(0, numElementos);
    }

    ListarExamen() {
      var id_usuario=localStorage.getItem("current_user") ?? '';

      this.gestioncursoservicegeneric.listarPorIdDataCursoUsuario(parseInt(this.CursoUsuId),parseInt(id_usuario)).subscribe(
          (data) => {
              var datafia =data
              console.log("🚀 ~ ExamenCourseComponent ~ ListarExamen ~ datafia:", datafia)

              var estado_examen_curso =data.estado_examen_curso

              if(estado_examen_curso == 1 || estado_examen_curso == null){
                    this.ExamenList =data.cursos.examen_final
                    this.examenId=data.cursos.examen_final[0].id
                    var preguntas =data.cursos.examen_final[0].preguntas_data
                    var datos_preguntas = this.obtenerElementosAleatorios(preguntas, 5);
                    this.PreguntasDatas = datos_preguntas
                    console.log("🚀 ~ ExamenCourseComponent ~ this.checkboxStates=this.PreguntasDatas.map ~ pregunta:",  this.PreguntasDatas);
                    this.checkboxStates = this.PreguntasDatas.map((pregunta:any) => ({
                      preguntaId: pregunta.id,
                      opciones: [false,false,false,false,false]
                    }));
                    const formData = new FormData();
                    formData.append('accion', 'registro_acceso_examen');
                    formData.append('cursos', data.curso.id);
                    this.gestioncursoservice.editarAccionesCursoUsuario(formData,this.CursoUsuId).subscribe(
                        (data) => {
                        },
                        (error) => {
                            if (error.status === 401) {
                                this.logout();
                            } else {
                                console.error("Error al listar el examen:", error);
                            }
                        }
                    );
              }else{
                this.router.navigate(['/intranet/pages/error404' ]);
              }
          },
          (error) => {
              if (error.status === 401) {
                  this.logout();
              } else {
                  console.error("Error al listar el examen:", error);
              }
          }
      );
    }


    // guardar respuestas
    GuardarRespuesta(){
      this.boton_finalizar =1;
      setTimeout(() => {
            document.exitFullscreen();
  
            Swal.fire({
              title: "¿Estas seguro de terminar el examen?",
              text: "¡No seras capaz de revertir eso!",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Si, estoy seguro!"
            }).then((result) => {
              if (result.isConfirmed) {
      
                const formData = new FormData();
                formData.append('curso_usuario', this.CursoUsuId);
                formData.append('examen_curso', this.examenId);
                formData.append('respuestas', JSON.stringify(this.checkboxStates)); // Convert to JSON
                formData.append('status', 'true');
                formData.append("usuario_reg", localStorage.getItem("current_user") ?? '');

                this.gestioncursoservice.registrarNotasExamen(formData).subscribe(
                    (data) => {

                      const formData = new FormData();
                      formData.append('accion', 'registro_termino_examen');
                      formData.append('cursos', this.ExamenList[0].curso);
                    
                      this.gestioncursoservice.editarAccionesCursoUsuario(formData,this.CursoUsuId).subscribe(
                          (data) => {
                                Swal.fire({
                                  title: "Listo se registro tu examen !",
                                  text: "Su nota aparecera en el inicio del curso.",
                                  icon: "success"
                                });
                                setTimeout(() => {
                                    // location.reload();
                                    this.router.navigate(['/intranet' ]);
                                }, 2000);
                          },
                          (error) => {
                              if (error.status === 401) {
                                  this.logout();
                              } else {
                                  console.error("Error al listar el examen:", error);
                              }
                          }
                      );
                    },
                    (error) => {
                        if (error.status === 401) {
                            this.logout();
                        } else {
                            console.error("Error al listar el examen:", error);
                        }
                    }
                ); 
              }
            });
      }, 500);
    }

    logout(){
        localStorage.clear();
        this.router.navigate(['/auth/login/login-noc-conocimientos']);
    }
    
}
