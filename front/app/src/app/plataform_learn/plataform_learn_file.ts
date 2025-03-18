import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// highlightjs
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';

// select
import { NgSelectModule } from '@ng-select/ng-select';


// tippy
import { NgxTippyModule } from 'ngx-tippy-wrapper';

// headlessui
import { MenuModule } from 'headlessui-angular';

// icon
import { IconModule } from 'src/app/shared/icon/icon.module';

// modal
import { ModalModule } from 'angular-custom-modal';
// counter
import { CountUpModule } from 'ngx-countup';

// lightbox
import { LightboxModule } from 'ngx-lightbox';

// sortable
import { SortablejsModule } from '@dustfoundation/ngx-sortablejs';

// perfect-scrollbar
import { NgScrollbarModule } from 'ngx-scrollbar';

// quill editor
import { QuillModule } from 'ngx-quill';

// fullcalendar
import { FullCalendarModule } from '@fullcalendar/angular';

// datatable
import { DataTableModule } from '@bhplugin/ng-datatable';

// clipboard
import { ClipboardModule } from 'ngx-clipboard';

// easymde
import { EasymdeModule } from 'ngx-easymde';

// input mask
import { TextMaskModule } from 'angular2-text-mask';

// nouilsider
import { NouisliderModule } from 'ng2-nouislider';

// flatpicker
import { Ng2FlatpickrModule } from 'ng2-flatpickr';


// touchspin
import { NgxNumberSpinnerModule } from 'ngx-number-spinner';


// apexchart
import { NgApexchartsModule } from 'ng-apexcharts';

import { PlataformLearnComponent } from './learn_claro/learn_claro';
import { CourseStartComponent } from './course_start/course_start';
import { ThemeCourseComponent } from './theme_course/theme_course';
import { QuizCourseComponent } from './quiz_course/quiz_course';
import { ExamenCourseComponent } from './examen_course/examen_course';

import { GestionCursoComponent } from './gestion_educacional/gestion_curso/gestion_curso';
import { ModalEstadisticasCursoComponent } from './gestion_educacional/gestion_curso/modal_estadistica_curso/modal_estadistica_curso';

import { ModalGestionCursoComponent } from './gestion_educacional/gestion_curso/modal_gestion_curso/modal_gestion_curso';
import { ModalTablaContenidoComponent } from './gestion_educacional/gestion_curso/modal_gestion_curso/modal_tabla_contenidos/modal_tabla_contenidos';

import { ModalExamenCursoComponent } from './gestion_educacional/gestion_curso/modal_gestion_curso/modal_examen/modal_examen_curso';
import { ModalPreguntasExamenCursoComponent } from './gestion_educacional/gestion_curso/modal_gestion_curso/modal_examen/modals_preguntas_examen_curso/modals_preguntas_examen_curso';

import { ModalTemasComponent } from './gestion_educacional/gestion_curso/modal_gestion_curso/modal_tabla_contenidos/modal_temas/modal_temas';

import { ModalQuizComponent } from './gestion_educacional/gestion_curso/modal_gestion_curso/modal_tabla_contenidos/modal_quiz/modal_quiz';
import { ModalPreguntasComponent } from './gestion_educacional/gestion_curso/modal_gestion_curso/modal_tabla_contenidos/modal_quiz/modals_preguntas/modals_preguntas';



const routes: Routes = [
    { 
     path: 'learn_claro',
     component: PlataformLearnComponent,
     title: 'Aprenda con Claro | Sistema de Conocimientos' 
    },
    { 
        path: 'course_start/:course_usuId',
        component: CourseStartComponent,
        title: 'Curso Inicio | Sistema de Conocimientos' 
    },
    { 
        path: 'theme_course/:themeId',
        component: ThemeCourseComponent,
        title: 'Tema del Curso | Sistema de Conocimientos' 
    },
    { 
        path: 'quiz_course/:quizId',
        component: QuizCourseComponent,
        title: 'Quiz Curso | Sistema de Conocimientos' 
    },
    { 
        path: 'managment_course',
        component: GestionCursoComponent,
        title: 'Gestión de Curso | Sistema de Conocimientos' 
    },
    { 
        path: 'examen_course/:course_usuId',
        component: ExamenCourseComponent,
        title: 'Examen Curso | Sistema de Conocimientos' 
    },





    
];


@NgModule({
    imports: [
        RouterModule.forChild(routes), 
        CommonModule, 
        FormsModule,
        ReactiveFormsModule,
        ModalModule,
        NgScrollbarModule.withConfig({
            visibility: 'hover',
            appearance: 'standard',
        }),
        QuillModule.forRoot(),
        FullCalendarModule,
        LightboxModule,CountUpModule,
        HighlightModule, 
        NgxTippyModule,
        DataTableModule,
        IconModule,
        MenuModule,
        SortablejsModule, 
        NgSelectModule,
        EasymdeModule.forRoot(),
        TextMaskModule,
        NouisliderModule,
        Ng2FlatpickrModule,
        NgxNumberSpinnerModule,
        ClipboardModule,
        NgApexchartsModule,
    ],
    declarations: [
        PlataformLearnComponent,CourseStartComponent,
        ThemeCourseComponent,QuizCourseComponent,ExamenCourseComponent,GestionCursoComponent,
        ModalGestionCursoComponent,ModalTablaContenidoComponent,ModalQuizComponent,
        ModalPreguntasComponent,ModalTemasComponent,ModalEstadisticasCursoComponent,
        ModalExamenCursoComponent,ModalPreguntasExamenCursoComponent
    ],
    providers: [
        {
            provide: HIGHLIGHT_OPTIONS,
            useValue: {
                coreLibraryLoader: () => import('highlight.js/lib/core'),
                languages: {
                    json: () => import('highlight.js/lib/languages/json'),
                    typescript: () => import('highlight.js/lib/languages/typescript'),
                    xml: () => import('highlight.js/lib/languages/xml'),
                },
            },
        },
    ],
})
export class PlataformLearnModule {}
