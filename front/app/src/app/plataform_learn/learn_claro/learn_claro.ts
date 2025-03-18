import { Component } from '@angular/core';
import { slideDownUp } from '../../shared/animations';
import { animate, style, transition, trigger } from '@angular/animations';
import { TranslateService } from '@ngx-translate/core';
import Swiper, { Autoplay, Navigation, Pagination } from 'swiper';
import { LlamadaComponentesRutaArchivos } from 'src/app/services/ruta_archivos/llamada_componentes_ruta';
import { Router, NavigationEnd } from '@angular/router';

import { GestionCursoGenericService } from 'src/app/services/gestion_curso/gestion_curso_generic.service';
import { GestionCursoService } from 'src/app/services/gestion_curso/gestion_curso.service';



import * as moment from 'moment';
import 'moment/locale/es';

import 'moment-duration-format';
import * as CryptoJS from 'crypto-js';


@Component({
    moduleId: module.id,
    selector: 'app-learn_claro.',
    templateUrl: './learn_claro.html',
    styleUrls: ['./learn_claro.css'],
    animations: [ slideDownUp,
        trigger('toggleAnimation', [
            transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
            transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
        ]),
    ],})

export class PlataformLearnComponent {

    courseDurations: any;

    courses = [];
      popoversVisible!: boolean[];
      courseList : any = [];

    //   moment = moment.locale(); ; // Declare moment here
      moment = moment; // Declare moment here

    constructor(
        public router: Router,
        private llama_componente: LlamadaComponentesRutaArchivos,
        public translate: TranslateService,

        private gestioncursoservicegeneric: GestionCursoGenericService,
        private gestioncursoservice: GestionCursoService
    ) {}

    ngOnInit() {
        this.popoversVisible = new Array(this.courses.length).fill(false);
        this.ListarCurso();

    }
    goTolearn(course_usuId: string) {
        // Clave secreta para cifrado
        const secretKey = 'clave-secreta-para-cifrado';
        const encodedCourse_usuId = encodeURIComponent(course_usuId);
        const encryptedCourse_usuId = CryptoJS.AES.encrypt(encodedCourse_usuId, secretKey).toString();

        this.router.navigate(['/intranet/plataform_learn_file/course_start', encryptedCourse_usuId]);
    }

    createRange(number: number): number[] {
        return Array.from({ length: number }, (v, i) => i);
    }

    getInitials(palabra: string): string {
        const firstInitial = palabra ? palabra.charAt(0) : '';
        return `${firstInitial}`;
      }


    ListarCurso(){
        var id_usuario=localStorage.getItem("current_user") ?? '';

        if (typeof id_usuario === 'undefined') {
            
        }else{
            this.gestioncursoservice.ListCursoUsuario('usuario',id_usuario).subscribe(
                (data) => {
                    this.courseList = data

                    // this.getDuration(data.cursos.contenidos_data) 
                    // this.loadAllDurations();
                   


                },
                (error) => {
                    if(error.status == 401){
                    this.logout();
                    }
                }
            )  
        }
    }

    logout(){
        localStorage.clear();
        this.router.navigate(['/auth/login/login-noc-conocimientos']);
    }   

    
 

}
