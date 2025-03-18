import { Component, OnDestroy, OnInit } from '@angular/core';
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



@Component({
    moduleId: module.id,
    selector: 'app-quiz-course.',
    templateUrl: './quiz_course.html',
    styleUrls: ['./quiz_course.css'],
    animations: [ slideDownUp,
        trigger('toggleAnimation', [
            transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
            transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
        ]),
    ],})

export class QuizCourseComponent implements OnInit, OnDestroy {


    activeTab = 1;


    quizId!: string;
    quizList : any = [];



    tiempoInicial: number=0; // Tiempo inicial en segundos
    tiempoRestante: number=0; // Tiempo restante en segundos
    intervalId: any; // Para almacenar el ID del intervalo
  
    hoursLeft: number=0;
    minutesLeft: number=0;
    secondsLeft: number=0;

    private countdownDate: moment.Moment | null = null; 

    constructor(
        private llama_componente: LlamadaComponentesRutaArchivos,
        public translate: TranslateService,

        public router: Router,
        public route: ActivatedRoute,
        private gestioncursoservicegeneric: GestionCursoGenericService,
        private gestioncursoservice: GestionCursoService,

    ) {}

  
    ngOnInit(): void {

        this.quizId = this.route.snapshot.paramMap.get('quizId')!;
        // Aquí puedes realizar cualquier lógica adicional basada en 'courseId'
        console.log('Course ID:', this.quizId);
        this.ListarQuiz();




        setTimeout(() => {

            console.log("🚀 ~ QuizCourseComponent ~ setTimeout ~ this.quizList[0].tiempo_quiz:", this.quizList[0].tiempo_quiz)

                // Obtener el tiempo del objeto JSON y convertirlo a segundos
                this.tiempoInicial = this.convertirTiempoASegundos(this.quizList[0].tiempo_quiz);
                this.tiempoRestante = this.tiempoInicial;
    
                // Iniciar el contador de tiempo
                this.iniciarContador();
            
            
        }, 1000);

  

    }

   

    ngOnDestroy(): void {
        this.detenerContador();
      }
    
      iniciarContador(): void {
        this.actualizarTiempoFormateado(this.tiempoInicial);
        this.intervalId = setInterval(() => {


          if (this.tiempoRestante > 0) {
            this.tiempoRestante--;
            this.actualizarTiempoFormateado(this.tiempoRestante);
          } else {
            this.detenerContador();
            console.log("Tiempo terminado!");
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
        console.log("🚀 ~ QuizCourseComponent ~ convertirTiempoASegundos ~ tiempo:", tiempo)
        if (!tiempo || tiempo.trim() === '') {
          return 0; // Manejar caso de cadena vacía o nula
        }
      
        const partes = tiempo.split(':');
        const horas = parseInt(partes[0], 10) || 0;
        const minutos = parseInt(partes[1], 10) || 0;
        const segundos = parseInt(partes[2], 10) || 0;
      
        return horas * 3600 + minutos * 60 + segundos;
      }

        
    ListarQuiz(){
        // const formData = new FormData();
        // formData.append("user", localStorage.getItem("usuario") ?? '');
        // formData.append("pass", localStorage.getItem("password") ?? '');
            this.gestioncursoservice.ListQuizContenido('id',parseInt(this.quizId)).subscribe(

                (data) => {
    
                    this.quizList = data
                    console.log("🚀 ~ CourseStartComponent ~ ListarQuiz ~ this.courseList:", this.quizList)
                
                },
                (error) => {
                    if(error.status == 401){
                    this.logout();
                    }
                }
            )    
        }
        

        

    logout(){
        localStorage.clear();
        this.router.navigate(['/auth/login/login-noc-conocimientos']);
    }

  

    
}
