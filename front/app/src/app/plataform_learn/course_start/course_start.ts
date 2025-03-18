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
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';


@Component({
    moduleId: module.id,
    selector: 'app-course_start.',
    templateUrl: './course_start.html',
    styleUrls: ['./course_start.css'],
    animations: [ slideDownUp,
        trigger('toggleAnimation', [
            transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
            transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
        ]),
    ],})

export class CourseStartComponent {

    accordians:any = 0;
    tab22: string = 'home';
    course_usuId!: string;
    courseUsuList : any = [];
    moment = moment; // Declare moment here
    accordiansexamenfinal:any =0;
    accordiansnota:any = 0;

    FotoProfesor!: string;
    stars: boolean[] = [false, false, false, false, false];

    constructor(
        private llama_componente: LlamadaComponentesRutaArchivos,
        public translate: TranslateService,
        public router: Router,
        public route: ActivatedRoute,
        private gestioncursoservicegeneric: GestionCursoGenericService,
        private gestioncursoservice: GestionCursoService,

    ) {}

    ngOnInit() {
        const secretKey = 'clave-secreta-para-cifrado';

        var encryptedCourse_usuId = this.route.snapshot.paramMap.get('course_usuId')!;
        const bytes = CryptoJS.AES.decrypt( encryptedCourse_usuId, secretKey);
        this.course_usuId = bytes.toString(CryptoJS.enc.Utf8);
        // Aquí puedes realizar cualquier lógica adicional basada en 'course_usuId'
        this.ListarCurso()
    }

    ListarCurso(){
        var id_usuario=localStorage.getItem("current_user") ?? '';
       
        this.gestioncursoservicegeneric.listarPorIdDataCursoUsuario(parseInt(this.course_usuId),parseInt(id_usuario)).subscribe(
            (data) => {

                this.courseUsuList = data
        
                if(this.courseUsuList.cursos.docente_data[0].perfil.foto == null ){
                    this.FotoProfesor = '/assets/imagenes_decoracion/perfil-anonimo.png'
                }else{
                    this.FotoProfesor = 'http://localhost:8000/media/usuarios/perfil_fotos/'+ this.courseUsuList.cursos.docente_data[0].perfil.foto
                }

                this.cambiarElementos(this.stars, this.courseUsuList.feedback_puntaje);


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

    goTolearn(course_usuId: string) {
        this.router.navigate(['/intranet/plataform_learn_file/course_start', course_usuId]);
    }

    goToQuiz(quizId: string) {
        this.router.navigate(['/intranet/plataform_learn_file/quiz_course', quizId]);
    }

    goToTema(temaId: string) {
        this.router.navigate(['/intranet/plataform_learn_file/theme_course', temaId]);
    }

    goToExamen(ExamenId: string, CursoUsuId: string) {

        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger"
            },
            buttonsStyling: false
            });
            swalWithBootstrapButtons.fire({
            title: "¿Estas seguro de entrar?",
            text: "!Se registrará tu ingreso al examen y no volveras a entrar de nuevo!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "!si lo haré!",
            cancelButtonText: "!No, cancelalo!",
            reverseButtons: true
            }).then((result) => {
            if (result.isConfirmed) {

                swalWithBootstrapButtons.fire({
                    title: "Perfecto!",
                    text: "Te redirijo a tu examen",
                    icon: "success"
                });

                setTimeout(() => {

                    const secretKey = 'clave-secreta-para-cifrado';
                                
                    const encodedCursoUsuId = encodeURIComponent(CursoUsuId);
                    const encryptedCursoUsuId = CryptoJS.AES.encrypt(encodedCursoUsuId, secretKey).toString();
                    this.router.navigate(['/intranet/plataform_learn_file/examen_course', encryptedCursoUsuId]);

                }, 1000);

            } else if (
                /* Read more about handling dismissals below */
                result.dismiss === Swal.DismissReason.cancel
            ) {
                swalWithBootstrapButtons.fire({
                title: "Cancelado",
                text: "No daras el examen",
                icon: "error"
                });
            }
            });
    }

    toggleStar(index: number): void {
        this.stars[index] = !this.stars[index];
        console.log(`Star ${index + 1} toggled: ${this.stars[index]}`);
        console.log("🚀 ~ CourseStartComponent ~ toggleStar ~ this.stars:", this.stars)
        const countTrue = this.countTrueStars();
        console.log("🚀 ~ CourseStartComponent ~ countTrueStars:", countTrue);
        const formData = new FormData();
        formData.append('accion', 'actualizar_estrellas');
        formData.append('feedback_puntaje', countTrue.toString());
        this.gestioncursoservice.editarAccionesCursoUsuario(formData,this.course_usuId).subscribe(
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
    }
    
    countTrueStars(): number {
        return this.stars.filter(star => star).length;
    }

    cambiarElementos(lista: boolean[], cantidad: number): void {
        // Asegurarse de no exceder la longitud de la lista
        cantidad = Math.min(cantidad, lista.length);
        
        // Cambiar los primeros 'cantidad' elementos a true
        for (let i = 0; i < cantidad; i++) {
            this.stars[i] = true;
        }
    }

    
}
