import { Component } from '@angular/core';
import { slideDownUp } from '../../shared/animations';
import { animate, style, transition, trigger } from '@angular/animations';
import { TranslateService } from '@ngx-translate/core';
import Swiper, { Autoplay, Navigation, Pagination } from 'swiper';
import { LlamadaComponentesRutaArchivos } from 'src/app/services/ruta_archivos/llamada_componentes_ruta';
import { Router, NavigationEnd,ActivatedRoute } from '@angular/router';

import { GestionCursoGenericService } from 'src/app/services/gestion_curso/gestion_curso_generic.service';
import { GestionCursoService } from 'src/app/services/gestion_curso/gestion_curso.service';

import * as moment from 'moment';
import 'moment/locale/es';

import 'moment-duration-format';


@Component({
    moduleId: module.id,
    selector: 'app-theme-course.',
    templateUrl: './theme_course.html',
    styleUrls: ['./theme_course.css'],
    animations: [ slideDownUp,
        trigger('toggleAnimation', [
            transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
            transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
        ]),
    ],})

export class ThemeCourseComponent {

    themeId!: string;
    themeList : any = [];


    constructor(
        private llama_componente: LlamadaComponentesRutaArchivos,
        public translate: TranslateService,

        public router: Router,
        public route: ActivatedRoute,
        private gestioncursoservicegeneric: GestionCursoGenericService,
        private gestioncursoservice: GestionCursoService,


    ) {}

    ngOnInit() {

        this.themeId = this.route.snapshot.paramMap.get('themeId')!;
        // Aquí puedes realizar cualquier lógica adicional basada en 'courseId'
        console.log('Course ID:', this.themeId);
        // this.ListarCurso()


        this.ListarTema()
    }


    getFileNameUrl(url: string): string {
        return url.split('/').pop() || '';
    }

    ListarTema(){
        // const formData = new FormData();
        // formData.append("user", localStorage.getItem("usuario") ?? '');
        // formData.append("pass", localStorage.getItem("password") ?? '');
            this.gestioncursoservice.listarPorTemaByType(parseInt(this.themeId),'id').subscribe(
                (data) => {
    
                    this.themeList = data
                    console.log("🚀 ~ ThemeCourseComponent ~ ListarTema ~ this.themeList:", this.themeList)
                    console.log("🚀 ~ CourseStartComponent ~ ListarTema ~ this.courseList:", this.themeId)
                
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
