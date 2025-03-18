import { Component, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { animate, style, transition, trigger } from '@angular/animations';
import { ModalComponent } from 'angular-custom-modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GestionCursoGenericService } from 'src/app/services/gestion_curso/gestion_curso_generic.service';
import { GestionCursoService } from 'src/app/services/gestion_curso/gestion_curso.service';


import * as moment from 'moment';
import 'moment/locale/es';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { BuscarArchivoDetalleService } from 'src/app/services/buscar_archivos/buscar-archivos-detallado.service';
import { Router, NavigationEnd } from '@angular/router';



@Component({
    moduleId: module.id,
    selector: 'app-gestion-curso.',
    templateUrl: './gestion_curso.html',
    styleUrls: ['./gestion_curso.css'],
    animations: [
        trigger('toggleAnimation', [
            transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
            transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
        ]),
    ],
})



export class GestionCursoComponent {
    @ViewChild('ModalEstadisticas') ModalEstadisticas!: ModalComponent;

    
    @ViewChild('ModalCurso') ModalCurso!: ModalComponent;
    private suscripcion: Subscription;
    displayType = 'list';
    params!: FormGroup;
    filterdCourseList: any = [];
    searchCursosData = '';
    BusquedaTabla = '';

    moment = moment; // Declare moment here


    constructor(
        public router: Router,
        public fb: FormBuilder,
        public storeData: Store<any>,
        private gestioncursoservice: GestionCursoService,
        private gestioncursoservicegeneric: GestionCursoGenericService,

    ) {
        // this.uploadExcel = this.formBuilder.group({
        //     file: [''],
        //   })
        this.initStore();
        
        this.suscripcion = this.gestioncursoservicegeneric.invocarFuncionPadre.subscribe((evento) => {
            switch (evento.accion) {
                case 'listar_cursos':
                    this.ListarCurso();
                break;
                case 'cerrar_modal_curso':
                    this.ModalCursoCerrar();
                break;
              // Agrega más casos según sea necesario
              default:
                console.log('Acción no reconocida');
            }
        });
    }

    contactList: any = [];

    cols = [
        { field: 'id', title: 'ID', isUnique: true, filter: false, hide: true },
        { field: 'nom_curso', title: 'Nombre de Curso' },
        { field: 'creado', title: 'Fecha de Creación', type: 'date' },

        
        { field: 'cant_tiempo', title: 'Cantidad de tiempo' },
        { field: 'cant_contenidos', title: 'Cantidad de contenidos' },


        { field: 'rating', title: 'Rating', sort: false, minWidth: '120px', headerClass: 'justify-center', cellClass: 'justify-center' },
        { field: 'progreso', title: 'Progreso', sort: false },
        { field: 'action', title: 'Acciones', sort: false  ,filter: false}
    ];
    rows: any[] =  [];
    loading= false;



    store: any;
    async initStore() {
        this.storeData
            .select((d) => d.index)
            .subscribe((d) => {
                this.store = d;
            });
    }

    ngOnInit() {
        this.loading = true;
        this.ListarCurso();
        this.loading = false;
    }

    ListarCurso(){
        // const formData = new FormData();
        // formData.append("user", localStorage.getItem("usuario") ?? '');
        // formData.append("pass", localStorage.getItem("password") ?? '');
            this.gestioncursoservicegeneric.listar().subscribe(
                (data) => {

                    var filas: any[] =  [];
                    for (const item of data) {

                        const objeto = {
                            id:item['id'],
                            nom_curso:item['nom_curso'],
                            acerca_curso:item['acerca_curso'],
                            resumen_curso:item['resumen_curso'],
                            introdu_curso:item['introdu_curso'],
                            sobre_autor:item['sobre_autor'],

                            cant_tiempo:item['id'],
                            cant_contenidos:item['id'],

                            docente_data:item['docente_data'],
                            docente:item['docente'],

                            img_fondo:item['img_fondo'],
                            img_logo:item['img_logo'],
                            vid_trailer_url: item['vid_trailer_url'],
                            vid_trailer: item['vid_trailer'],

                            creado: item['creado'] ,

                            usuario_reg:item['usuario_reg'],
                            status:item['status'],

                            cursousuarios:item['cursousuarios'],

                            statusColor: this.randomStatusColor(),
                            progreso:this.getRandomNumber(15, 100),
                            rating: this.getRandomNumber(1, 5),

                        };

                        filas.push(objeto);
                    };
                    this.rows=filas
                    this.contactList = this.rows
                    this.searchcourses();

                },
                (error) => {
                    if(error.status == 401){
                    this.logout();
                    }
                }
            )    
    }

    randomStatusColor() {
        const color = ['primary', 'secondary', 'success', 'danger', 'warning', 'info'];
        const random = Math.floor(Math.random() * color.length);
        return color[random];
    }
    getRandomNumber(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    getRandomArray(len :number) {
        return Array.from({ length: len}, (_, i) => i);
    }

    logout(){
        localStorage.clear();
        this.router.navigate(['/auth/login/login-noc-conocimientos']);
    }

    searchcourses() {
        this.rows = this.contactList.filter((d:any) => d.nom_curso.toLowerCase().includes(this.searchCursosData.toLowerCase()));
    }
    
    initForm() {
        this.params = this.fb.group({
            id: [0],
        });
    }


    
    ModalEstadisticaCerrar(){
        this.ModalEstadisticas.close()
    }


    ModalEstadistica(datos_recibidos: any = null) {
        this.ModalEstadisticas.open()
        if (datos_recibidos == null) {
            var datas : any={};         

            this.gestioncursoservicegeneric.setData(datas);
            return
        }else{
            this.gestioncursoservicegeneric.setData(datos_recibidos);
        }
    }




    ModalCursoCerrar(){
        this.ModalCurso.close()
    }

    editCurso(datos_recibidos: any = null) {
        this.ModalCurso.open();
        this.initForm();
        if (datos_recibidos == null) {
            var datas : any={};         

            this.gestioncursoservicegeneric.setData(datas);
            return
        }else{
            this.params.setValue({
                id: datos_recibidos.id,
            });
            this.gestioncursoservicegeneric.setData(datos_recibidos);
        }
    }


    deleteCurso(user: any = null) {
        this.rows = this.rows.filter((d:any) => d.id != user.id);
        this.searchcourses();
        this.showMessage('User has been deleted successfully.');
    }

    showMessage(msg = '', type = 'success') {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    }


}
