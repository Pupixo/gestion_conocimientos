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
    selector: 'app-modal_estadistica_curso.',
    templateUrl: './modal_estadistica_curso.html',
    styleUrls: ['./modal_estadistica_curso.css'],
    animations: [
        trigger('toggleAnimation', [
            transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
            transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
        ]),
    ],
})

export class ModalEstadisticasCursoComponent implements OnInit  {
    @Output() eventoHijo = new EventEmitter<void>();
    private suscripcion: Subscription;

    // formulario_modal!: FormGroup;
    usuario_data: any={};
    data:  any={};
    params!: FormGroup;
    params_tbl_cont!: FormGroup;
    usuarios_profesores: any =   [];
    usuarios_alumnos: any =   [];
    lista_secciones:any = [];
    selectedFiles: { [key: string]: File } = {};
    EstadisticasList: any =   [];
    intervalo: any;
    moment = moment;

    store: any;

    lineChart: any;
    areaChart: any;
    columnChart: any;
    simpleColumnStacked: any;
    barChart: any;
    mixedChart: any;
    radarChart: any;
    pieChart: any;
    donutChart: any;
    polarAreaChart: any;
    radialBarChart: any;
    bubbleChart: any;
    
    
    revenueChart: any;
    salesByCategory: any;
    dailySales: any;
    totalOrders: any;

    totalVisit: any;
    paidVisit: any;
    uniqueVisitor: any;
    followers: any;
    referral: any;
    engagement: any;
    
    isLoading = true;

    //datos reales
    DesempenioAlum: any;
    TazaParticipacipn: any;
    NotasQuiz: any;
    AvanceTotal=0;
    AvanceModulos: any;

    TotalAlumno:any=0
    TazaParticipacipn_terminado=0
    TazaParticipacipn_avanzado=0
    TazaParticipacipn_ausentes=0

    DesempenioAlum_aprobados=0
    DesempenioAlum_desaprobados=0
    DesempenioAlum_no_evaluados=0

    NotasQuiz_0=0
    NotasQuiz_4=0
    NotasQuiz_8=0
    NotasQuiz_12=0
    NotasQuiz_16=0
    NotasQuiz_20=0


    NotasQuiz_0_porcentaje=0
    NotasQuiz_4_porcentaje=0
    NotasQuiz_8_porcentaje=0
    NotasQuiz_12_porcentaje=0
    NotasQuiz_16_porcentaje=0
    NotasQuiz_20_porcentaje=0

    constructor(
        public fb: FormBuilder,
        public router: Router,
        public storeData: Store<any>,
        private usuarioscrudService: UsuariosCrudService,
        private gestioncursoservicegeneric: GestionCursoGenericService,
        private gestioncursoservice: GestionCursoService,
        private renderer: Renderer2
    ){
        this.initStore();
        this.isLoading = false;

        this.suscripcion = this.gestioncursoservicegeneric.invocarFuncionPadre.subscribe((evento) => {
            switch (evento.accion) {
                case 'listar_curso_estadsiticas':
                    this.ListarCursoEstadisticas();
                break;
              // Agrega más casos según sea necesario
              default:
                console.log('Acción no reconocida');
            }
        });
    }
    

    async initStore() {
        this.storeData
            .select((d) => d.index)
            .subscribe((d) => {
                console.log("🚀 ~ ChartsComponent ~ .subscribe ~ d:", d)
                const hasChangeTheme = this.store?.theme !== d?.theme;
                const hasChangeLayout = this.store?.layout !== d?.layout;
                const hasChangeMenu = this.store?.menu !== d?.menu;
                const hasChangeSidebar = this.store?.sidebar !== d?.sidebar;

                this.store = d;

                if (hasChangeTheme || hasChangeLayout || hasChangeMenu || hasChangeSidebar) {
                    if (this.isLoading || hasChangeTheme) {
                        this.initCharts(); //init charts
                        this.initCharts2();
                        this.initCharts3();
                        // setTimeout(() => {
                        //     this.initCharts(); // refresh charts
                        // }, 100000);
                    } else {
                        setTimeout(() => {
                            this.initCharts(); // refresh charts
                            this.initCharts2();
                            this.initCharts3();

                        }, 400);
                    }
                }
            });
    }
    
    ngOnInit() {
        this.initForm();

        this.InicializarDatos();
        this.ListarCursoEstadisticas();

        setTimeout(() => {
            this.scrollToPosition();
        }, 3000);

    }

    // funciones de configuración
    scrollToPosition() {
        this.renderer.listen('window', 'load', () => {
          window.scroll({
            top: 100,
            left: 100,
            behavior: 'smooth'
          });
        });
    }

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
    }

    InicializarDatos(){
       // Recuperar datos del servicio
       this.data = this.gestioncursoservicegeneric.getData();
       console.log("🚀 ~ ModalEstadisticasCursoComponent ~ InicializarDatos ~ this.data:", this.data)
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

        }
    };

    onReorder(event: any) {
        const nuevoOrden = event.map((seccion: any) => seccion.id); // Supongamos que cada sección tiene un ID único
        console.log("🚀 ~ ModalGestionCursoComponent ~ onReorder ~ nuevoOrden:", nuevoOrden)
    }

    notificarPadre(accion: string) {
        const valor = { mensaje: `¡Hola desde el hijo para ${accion}!` };
        this.gestioncursoservicegeneric.llamarFuncionPadre(accion, valor);
    }
    
    CerrarModal() {
        this.eventoHijo.emit();
        this.notificarPadre("cerrar_modal_estadistica");          
    }

    // funciones  
    ListarCursoEstadisticas(){
        var id_curso=this.data.id;
        if (typeof id_curso === 'undefined') {
            console.log('La variable es undefined.');
        }else{
            this.gestioncursoservice.ListCursoIdEstadistica(id_curso).subscribe(
                (data) => {
                        this.EstadisticasList = data[0]
                       
                        this.TazaParticipacipn_terminado = this.EstadisticasList.participacion.terminados;
                        this.TazaParticipacipn_avanzado = this.EstadisticasList.participacion.avanzando; 
                        this.TazaParticipacipn_ausentes = this.EstadisticasList.participacion.ausentes;

                        this.DesempenioAlum_aprobados=this.EstadisticasList.desempenio.aprobados;
                        this.DesempenioAlum_desaprobados=this.EstadisticasList.desempenio.desaprobados;
                        this.DesempenioAlum_no_evaluados=this.EstadisticasList.desempenio.no_evaluados;

                        this.AvanceTotal=this.EstadisticasList.total_avance.avance_total;


                        this.EstadisticasList.obtener_notas;
                      

                        this.NotasQuiz_0=this.EstadisticasList.obtener_notas['0'][1];
                        this.NotasQuiz_4=this.EstadisticasList.obtener_notas['4'][1];
                        this.NotasQuiz_8=this.EstadisticasList.obtener_notas['8'][1];
                        this.NotasQuiz_12=this.EstadisticasList.obtener_notas['12'][1];
                        this.NotasQuiz_16=this.EstadisticasList.obtener_notas['16'][1];
                        this.NotasQuiz_20=this.EstadisticasList.obtener_notas['20'][1];
                    
                    
                        this.NotasQuiz_0_porcentaje=this.EstadisticasList.obtener_notas['0'][0];
                        this.NotasQuiz_4_porcentaje=this.EstadisticasList.obtener_notas['4'][0];
                        this.NotasQuiz_8_porcentaje=this.EstadisticasList.obtener_notas['8'][0];
                        this.NotasQuiz_12_porcentaje=this.EstadisticasList.obtener_notas['12'][0];
                        this.NotasQuiz_16_porcentaje=this.EstadisticasList.obtener_notas['16'][0];
                        this.NotasQuiz_20_porcentaje=this.EstadisticasList.obtener_notas['20'][0];

                        this.TotalAlumno=this.EstadisticasList.cantidad_alumnos.total_alumnos;


                        this.initCharts(); //init charts
                        this.initCharts2();
                        this.initCharts3();

                },
                (error) => {
                    if(error.status == 401){
                    this.logout();
                    }
                }
            )  
        }
    }

    initCharts() {
        const isDark = this.store.theme === 'dark' || this.store.isDarkMode ? true : false;
        const isRtl = this.store.rtlClass === 'rtl' ? true : false;
        
        this.lineChart = {
            series: [
                {
                    name: 'Sales',
                    data: [45, 55, 75, 25, 45, 110],
                },
            ],
            chart: {
                height: 300,
                type: 'line',
                toolbar: false,
            },
            colors: ['#4361ee'],
            tooltip: {
                marker: false,
                y: {
                    formatter(number: string) {
                        return '$' + number;
                    },
                },
                theme: isDark ? 'dark' : 'light',
            },
            stroke: {
                width: 2,
                curve: 'smooth',
            },
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June'],
                axisBorder: {
                    color: isDark ? '#191e3a' : '#e0e6ed',
                },
            },
            yaxis: {
                opposite: isRtl ? true : false,
                labels: {
                    offsetX: isRtl ? -20 : 0,
                },
            },
            grid: {
                borderColor: isDark ? '#191e3a' : '#e0e6ed',
            },
        };

        this.areaChart = {
            series: [
                {
                    name: 'Income',
                    data: [16800, 16800, 15500, 17800, 15500, 17000, 19000, 16000, 15000, 17000, 14000, 17000],
                },
            ],
            chart: {
                type: 'area',
                height: 300,
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },
            colors: ['#805dca'],
            dataLabels: {
                enabled: false,
            },
            stroke: {
                width: 2,
                curve: 'smooth',
            },
            xaxis: {
                axisBorder: {
                    color: isDark ? '#191e3a' : '#e0e6ed',
                },
            },
            yaxis: {
                opposite: isRtl ? true : false,
                labels: {
                    offsetX: isRtl ? -40 : 0,
                },
            },
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            legend: {
                horizontalAlign: 'left',
            },
            grid: {
                borderColor: isDark ? '#191e3a' : '#e0e6ed',
            },
            tooltip: {
                theme: isDark ? 'dark' : 'light',
            },
        };

        this.columnChart = {
            series: [
                {
                    name: 'Net Profit',
                    data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
                },
                {
                    name: 'Revenue',
                    data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
                },
            ],
            chart: {
                height: 300,
                type: 'bar',
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },
            colors: ['#805dca', '#e7515a'],
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent'],
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    endingShape: 'rounded',
                },
            },
            grid: {
                borderColor: isDark ? '#191e3a' : '#e0e6ed',
            },
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
                axisBorder: {
                    color: isDark ? '#191e3a' : '#e0e6ed',
                },
            },
            yaxis: {
                opposite: isRtl ? true : false,
                labels: {
                    offsetX: isRtl ? -10 : 0,
                },
            },
            tooltip: {
                theme: isDark ? 'dark' : 'light',
                y: {
                    formatter: function (val: any) {
                        return val;
                    },
                },
            },
        };

        this.simpleColumnStacked = {
            series: [
                {
                    name: 'PRODUCT A',
                    data: [44, 55, 41, 67, 22, 43],
                },
                {
                    name: 'PRODUCT B',
                    data: [13, 23, 20, 8, 13, 27],
                },
            ],
            chart: {
                height: 300,
                type: 'bar',
                stacked: true,
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },
            colors: ['#2196f3', '#3b3f5c'],
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        legend: {
                            position: 'bottom',
                            offsetX: -10,
                            offsetY: 5,
                        },
                    },
                },
            ],
            plotOptions: {
                bar: {
                    horizontal: false,
                },
            },
            xaxis: {
                type: 'datetime',
                categories: ['01/01/2011 GMT', '01/02/2011 GMT', '01/03/2011 GMT', '01/04/2011 GMT', '01/05/2011 GMT', '01/06/2011 GMT'],
                axisBorder: {
                    color: isDark ? '#191e3a' : '#e0e6ed',
                },
            },
            yaxis: {
                opposite: isRtl ? true : false,
                labels: {
                    offsetX: isRtl ? -20 : 0,
                },
            },
            grid: {
                borderColor: isDark ? '#191e3a' : '#e0e6ed',
            },
            legend: {
                position: 'right',
                offsetY: 40,
            },
            tooltip: {
                theme: isDark ? 'dark' : 'light',
            },
            fill: {
                opacity: 0.8,
            },
        };

        this.barChart = {
            series: [
                {
                    name: 'Sales',
                    data: [44, 55, 41, 67, 22, 43, 21, 70],
                },
            ],
            chart: {
                height: 300,
                type: 'bar',
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 1,
            },
            colors: ['#4361ee'],
            xaxis: {
                categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
                axisBorder: {
                    color: isDark ? '#191e3a' : '#e0e6ed',
                },
            },
            yaxis: {
                opposite: isRtl ? true : false,
                reversed: isRtl ? true : false,
            },
            grid: {
                borderColor: isDark ? '#191e3a' : '#e0e6ed',
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                },
            },
            fill: {
                opacity: 0.8,
            },
        };

        this.mixedChart = {
            series: [
                {
                    name: 'TEAM A',
                    type: 'column',
                    data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
                {
                    name: 'TEAM B',
                    type: 'area',
                    data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                {
                    name: 'TEAM C',
                    type: 'line',
                    data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
            ],
            chart: {
                height: 300,
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },
            colors: ['#2196f3', '#00ab55', '#4361ee'],
            stroke: {
                width: [0, 2, 2],
                curve: 'smooth',
            },
            plotOptions: {
                bar: {
                    columnWidth: '50%',
                },
            },
            fill: {
                opacity: [1, 0.25, 1],
            },

            labels: [
                '01/01/2022',
                '02/01/2022',
                '03/01/2022',
                '04/01/2022',
                '05/01/2022',
                '06/01/2022',
                '07/01/2022',
                '08/01/2022',
                '09/01/2022',
                '10/01/2022',
                '11/01/2022',
            ],
            markers: {
                size: 0,
            },
            xaxis: {
                type: 'datetime',
                axisBorder: {
                    color: isDark ? '#191e3a' : '#e0e6ed',
                },
            },
            yaxis: {
                title: {
                    text: 'Points',
                },
                min: 0,
                opposite: isRtl ? true : false,
                labels: {
                    offsetX: isRtl ? -10 : 0,
                },
            },
            grid: {
                borderColor: isDark ? '#191e3a' : '#e0e6ed',
            },
            tooltip: {
                shared: true,
                intersect: false,
                theme: isDark ? 'dark' : 'light',
                y: {
                    formatter: (y: number) => {
                        if (typeof y !== 'undefined') {
                            return y.toFixed(0) + ' points';
                        }
                        return y;
                    },
                },
            },
            legend: {
                itemMargin: {
                    horizontal: 4,
                    vertical: 8,
                },
            },
        };

        this.radarChart = {
            series: [
                {
                    name: 'Series 1',
                    data: [80, 50, 30, 40, 100, 20],
                },
            ],
            chart: {
                height: 300,
                type: 'radar',
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },
            colors: ['#4361ee'],
            xaxis: {
                categories: ['January', 'February', 'March', 'April', 'May', 'June'],
            },
            plotOptions: {
                radar: {
                    polygons: {
                        strokeColors: isDark ? '#191e3a' : '#e0e6ed',
                        connectorColors: isDark ? '#191e3a' : '#e0e6ed',
                    },
                },
            },
            tooltip: {
                theme: isDark ? 'dark' : 'light',
            },
        };

        //----------------------------------------------

        this.AvanceModulos = {
            series: [
                {
                    name: 'Avance %',
                    data: [44, 55, 41, 67, 22, 43, 21, 70],
                },
            ],
            chart: {
                height: 300,
                type: 'bar',
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 1,
            },
            colors: ['#4361ee'],
            xaxis: {
                categories: ['Modulo 1', 'Modulo 2', 'Modulo 3', 'Modulo 4', 'Modulo 5', 'Modulo 6', 'Modulo 7'],
                axisBorder: {
                    color: isDark ? '#191e3a' : '#e0e6ed',
                },
            },
            yaxis: {
                opposite: isRtl ? true : false,
                reversed: isRtl ? true : false,
            },
            grid: {
                borderColor: isDark ? '#191e3a' : '#e0e6ed',
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                },
            },
            fill: {
                opacity: 0.8,
            },
        };

        var totalalumn=this.TotalAlumno
        this.TazaParticipacipn = {
            series: [ this.TazaParticipacipn_terminado,  this.TazaParticipacipn_avanzado, this.TazaParticipacipn_ausentes],
            chart: {
                height: 300,
                type: 'radialBar',
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },
            colors: ['#1100ff', '#ffd800', '#aaa8c6'],
            grid: {
                borderColor: isDark ? '#191e3a' : '#e0e6ed',
            },
            plotOptions: {
                radialBar: {
                    dataLabels: {
                        name: {
                            fontSize: '22px',
                        },
                        value: {
                            fontSize: '16px',
                        },
                        total: {
                            show: true,
                            label: 'Total Alumnos',
                            formatter: function (w: any) {
                                // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                                return totalalumn;
                            },
                        },
                    },
                },
            },
            labels: ['Completado', 'En progreso', 'Ausente'],
            fill: {
                opacity: 0.85,
            },
        };

        this.DesempenioAlum = {
            series: [this.DesempenioAlum_aprobados, this.DesempenioAlum_desaprobados, this.DesempenioAlum_no_evaluados],
            chart: {
                height: 300,
                type: 'pie',
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },
            labels: ['Aprobados', 'Desaprobados','No tomaron examen'],
            colors: ['#4361ee', '#ff0000','#b1b1b1'],
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200,
                        },
                    },
                },
            ],
            stroke: {
                show: false,
            },
            legend: {
                position: 'bottom',
            },
        };
 
        this.NotasQuiz = {
            series: [
              {
                name: "cantidad de estudiantes",
                data: [this.NotasQuiz_0, this.NotasQuiz_4, this.NotasQuiz_8, this.NotasQuiz_12, this.NotasQuiz_16,this.NotasQuiz_20]
              },
              {
                name: "porcentaje que representan",
                data: [this.NotasQuiz_0_porcentaje, this.NotasQuiz_4_porcentaje, this.NotasQuiz_8_porcentaje, this.NotasQuiz_12_porcentaje, this.NotasQuiz_16_porcentaje,this.NotasQuiz_20_porcentaje]
              }
            ],
            chart: {
                height: 300,
                type: 'bar',
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },
            colors: [
              "#ff0202",
              "#ff4545",
              "#ff8080",
              "#54bc56",
              "#1eaa21",
              "#20ff00"
       
            ],
            plotOptions: {
              bar: {
                columnWidth: "45%",
                distributed: true
              }
            },
            dataLabels: {
              enabled: false
            },
            legend: {
              show: false
            },
            grid: {
              show: false
            },
            xaxis: {
              categories: [
                "Nota 0",
                "Nota 4",
                "Nota 8",
                "Nota 12",
                "Nota 16",
                "Nota 20",

              ],
              labels: {
                style: {
                  colors: [
                    "#ff0202",
                    "#ff4545",
                    "#ff8080",
                    "#54bc56",
                    "#1eaa21",
                    "#20ff00"
                  ],
                  fontSize: "12px"
                }
              }
            },
            yaxis: {
                show: false,
            },
        };

        //-------------------------------------------------------------------

        this.pieChart = {
            series: [44, 55, 13, 43, 22],
            chart: {
                height: 300,
                type: 'pie',
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },
            labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
            colors: ['#4361ee', '#805dca', '#00ab55', '#e7515a', '#e2a03f'],
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200,
                        },
                    },
                },
            ],
            stroke: {
                show: false,
            },
            legend: {
                position: 'bottom',
            },
        };

        this.donutChart = {
            series: [44, 55, 13],
            chart: {
                height: 300,
                type: 'donut',
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },
            stroke: {
                show: false,
            },
            labels: ['Team A', 'Team B', 'Team C'],
            colors: ['#4361ee', '#805dca', '#e2a03f'],
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200,
                        },
                    },
                },
            ],
            legend: {
                position: 'bottom',
            },
        };

        this.polarAreaChart = {
            series: [14, 23, 21, 17, 15, 10, 12, 17, 21],
            chart: {
                height: 300,
                type: 'polarArea',
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },
            colors: ['#4361ee', '#805dca', '#00ab55', '#e7515a', '#e2a03f', '#2196f3', '#3b3f5c'],
            stroke: {
                show: false,
            },
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200,
                        },
                    },
                },
            ],
            plotOptions: {
                polarArea: {
                    rings: {
                        strokeColor: isDark ? '#191e3a' : '#e0e6ed',
                    },
                    spokes: {
                        connectorColors: isDark ? '#191e3a' : '#e0e6ed',
                    },
                },
            },
            legend: {
                position: 'bottom',
            },
            fill: {
                opacity: 0.85,
            },
        };

        this.radialBarChart = {
            series: [44, 55, 41],
            chart: {
                height: 300,
                type: 'radialBar',
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },
            colors: ['#4361ee', '#805dca', '#e2a03f'],
            grid: {
                borderColor: isDark ? '#191e3a' : '#e0e6ed',
            },
            plotOptions: {
                radialBar: {
                    dataLabels: {
                        name: {
                            fontSize: '22px',
                        },
                        value: {
                            fontSize: '16px',
                        },
                        total: {
                            show: true,
                            label: 'Total',
                            formatter: function (w: any) {
                                // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                                return 249;
                            },
                        },
                    },
                },
            },
            labels: ['Apples', 'Oranges', 'Bananas'],
            fill: {
                opacity: 0.85,
            },
        };

        this.bubbleChart = {
            series: [
                {
                    name: 'Bubble1',
                    data: this.generateData(new Date('11 Feb 2017 GMT').getTime(), 20, {
                        min: 10,
                        max: 60,
                    }),
                },
                {
                    name: 'Bubble2',
                    data: this.generateData(new Date('11 Feb 2017 GMT').getTime(), 20, {
                        min: 10,
                        max: 60,
                    }),
                },
            ],
            chart: {
                height: 300,
                type: 'bubble',
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },
            colors: ['#4361ee', '#00ab55'],
            dataLabels: {
                enabled: false,
            },
            xaxis: {
                tickAmount: 12,
                type: 'category',
                axisBorder: {
                    color: isDark ? '#191e3a' : '#e0e6ed',
                },
            },
            yaxis: {
                max: 70,
                opposite: isRtl ? true : false,
                labels: {
                    offsetX: isRtl ? -10 : 0,
                },
            },
            grid: {
                borderColor: isDark ? '#191e3a' : '#e0e6ed',
            },
            tooltip: {
                theme: isDark ? 'dark' : 'light',
            },
            stroke: {
                colors: isDark ? ['#191e3a'] : ['#e0e6ed'],
            },
            fill: {
                opacity: 0.85,
            },
        };
    }

    generateData(baseval: number, count: number, yrange: any) {
        var i = 0;
        var series: any = [];
        while (i < count) {
            var x = Math.floor(Math.random() * (750 - 1 + 1)) + 1;
            var y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
            var z = Math.floor(Math.random() * (75 - 15 + 1)) + 15;

            series.push([x, y, z]);
            baseval += 86400000;
            i++;
        }
        return series;
    }

    initCharts2() {
        const isDark = this.store.theme === 'dark' || this.store.isDarkMode ? true : false;
        const isRtl = this.store.rtlClass === 'rtl' ? true : false;

        // revenue
        this.revenueChart = {
            chart: {
                height: 325,
                type: 'area',
                fontFamily: 'Nunito, sans-serif',
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                curve: 'smooth',
                width: 2,
                lineCap: 'square',
            },
            dropShadow: {
                enabled: true,
                opacity: 0.2,
                blur: 10,
                left: -7,
                top: 22,
            },
            colors: isDark ? ['#2196f3', '#e7515a'] : ['#1b55e2', '#e7515a'],
            markers: {
                discrete: [
                    {
                        seriesIndex: 0,
                        dataPointIndex: 6,
                        fillColor: '#1b55e2',
                        strokeColor: 'transparent',
                        size: 7,
                    },
                    {
                        seriesIndex: 1,
                        dataPointIndex: 5,
                        fillColor: '#e7515a',
                        strokeColor: 'transparent',
                        size: 7,
                    },
                ],
            },
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            xaxis: {
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                crosshairs: {
                    show: true,
                },
                labels: {
                    offsetX: isRtl ? 2 : 0,
                    offsetY: 5,
                    style: {
                        fontSize: '12px',
                        cssClass: 'apexcharts-xaxis-title',
                    },
                },
            },
            yaxis: {
                tickAmount: 7,
                labels: {
                    formatter: (value: number) => {
                        return value / 1000 + 'K';
                    },
                    offsetX: isRtl ? -30 : -10,
                    offsetY: 0,
                    style: {
                        fontSize: '12px',
                        cssClass: 'apexcharts-yaxis-title',
                    },
                },
                opposite: isRtl ? true : false,
            },
            grid: {
                borderColor: isDark ? '#191e3a' : '#e0e6ed',
                strokeDashArray: 5,
                xaxis: {
                    lines: {
                        show: true,
                    },
                },
                yaxis: {
                    lines: {
                        show: false,
                    },
                },
                padding: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                fontSize: '16px',
                markers: {
                    width: 10,
                    height: 10,
                    offsetX: -2,
                },
                itemMargin: {
                    horizontal: 10,
                    vertical: 5,
                },
            },
            tooltip: {
                marker: {
                    show: true,
                },
                x: {
                    show: false,
                },
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    inverseColors: !1,
                    opacityFrom: isDark ? 0.19 : 0.28,
                    opacityTo: 0.05,
                    stops: isDark ? [100, 100] : [45, 100],
                },
            },
            series: [
                {
                    name: 'Income',
                    data: [16800, 16800, 15500, 17800, 15500, 17000, 19000, 16000, 15000, 17000, 14000, 17000],
                },
                {
                    name: 'Expenses',
                    data: [16500, 17500, 16200, 17300, 16000, 19500, 16000, 17000, 16000, 19000, 18000, 19000],
                },
            ],
        };

        // sales by category
        this.salesByCategory = {
            chart: {
                type: 'donut',
                height: 460,
                fontFamily: 'Nunito, sans-serif',
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 25,
                colors: isDark ? '#0e1726' : '#fff',
            },
            colors: isDark ? ['#5c1ac3', '#e2a03f', '#e7515a', '#e2a03f'] : ['#e2a03f', '#5c1ac3', '#e7515a'],
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '14px',
                markers: {
                    width: 10,
                    height: 10,
                    offsetX: -2,
                },
                height: 50,
                offsetY: 20,
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '65%',
                        background: 'transparent',
                        labels: {
                            show: true,
                            name: {
                                show: true,
                                fontSize: '29px',
                                offsetY: -10,
                            },
                            value: {
                                show: true,
                                fontSize: '26px',
                                color: isDark ? '#bfc9d4' : undefined,
                                offsetY: 16,
                                formatter: (val: any) => {
                                    return val;
                                },
                            },
                            total: {
                                show: true,
                                label: 'Total',
                                color: '#888ea8',
                                fontSize: '29px',
                                formatter: (w: any) => {
                                    return w.globals.seriesTotals.reduce(function (a: any, b: any) {
                                        return a + b;
                                    }, 0);
                                },
                            },
                        },
                    },
                },
            },
            labels: ['Apparel', 'Sports', 'Others'],
            states: {
                hover: {
                    filter: {
                        type: 'none',
                        value: 0.15,
                    },
                },
                active: {
                    filter: {
                        type: 'none',
                        value: 0.15,
                    },
                },
            },
            series: [985, 737, 270],
        };

        // daily sales
        this.dailySales = {
            chart: {
                height: 160,
                type: 'bar',
                fontFamily: 'Nunito, sans-serif',
                toolbar: {
                    show: false,
                },
                stacked: true,
                stackType: '100%',
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 1,
            },
            colors: ['#e2a03f', '#e0e6ed'],
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        legend: {
                            position: 'bottom',
                            offsetX: -10,
                            offsetY: 0,
                        },
                    },
                },
            ],
            xaxis: {
                labels: {
                    show: false,
                },
                categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
            },
            yaxis: {
                show: false,
            },
            fill: {
                opacity: 1,
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '25%',
                },
            },
            legend: {
                show: false,
            },
            grid: {
                show: false,
                xaxis: {
                    lines: {
                        show: false,
                    },
                },
                padding: {
                    top: 10,
                    right: -20,
                    bottom: -20,
                    left: -20,
                },
            },
            series: [
                {
                    name: 'Sales',
                    data: [44, 55, 41, 67, 22, 43, 21],
                },
                {
                    name: 'Last Week',
                    data: [13, 23, 20, 8, 13, 27, 33],
                },
            ],
        };

        // total orders
        this.totalOrders = {
            chart: {
                height: 290,
                type: 'area',
                fontFamily: 'Nunito, sans-serif',
                sparkline: {
                    enabled: true,
                },
            },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            colors: isDark ? ['#00ab55'] : ['#00ab55'],
            labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
            yaxis: {
                min: 0,
                show: false,
            },
            grid: {
                padding: {
                    top: 125,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
            },
            fill: {
                opacity: 1,
                type: 'gradient',
                gradient: {
                    type: 'vertical',
                    shadeIntensity: 1,
                    inverseColors: !1,
                    opacityFrom: 0.3,
                    opacityTo: 0.05,
                    stops: [100, 100],
                },
            },
            tooltip: {
                x: {
                    show: false,
                },
            },
            series: [
                {
                    name: 'Sales',
                    data: [28, 40, 36, 52, 38, 60, 38, 52, 36, 40],
                },
            ],
        };

        // statistics
        this.totalVisit = {
            chart: {
                height: 58,
                type: 'line',
                fontFamily: 'Nunito, sans-serif',
                sparkline: {
                    enabled: true,
                },
                dropShadow: {
                    enabled: true,
                    blur: 3,
                    color: '#009688',
                    opacity: 0.4,
                },
            },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            colors: ['#009688'],
            grid: {
                padding: {
                    top: 5,
                    bottom: 5,
                    left: 5,
                    right: 5,
                },
            },
            tooltip: {
                x: {
                    show: false,
                },
                y: {
                    title: {
                        formatter: (val: any) => {
                            return '';
                        },
                    },
                },
            },
            series: [
                {
                    data: [21, 9, 36, 12, 44, 25, 59, 41, 66, 25],
                },
            ],
        };

        //paid visit
        this.paidVisit = {
            chart: {
                height: 58,
                type: 'line',
                fontFamily: 'Nunito, sans-serif',
                sparkline: {
                    enabled: true,
                },
                dropShadow: {
                    enabled: true,
                    blur: 3,
                    color: '#e2a03f',
                    opacity: 0.4,
                },
            },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            colors: ['#e2a03f'],
            grid: {
                padding: {
                    top: 5,
                    bottom: 5,
                    left: 5,
                    right: 5,
                },
            },
            tooltip: {
                x: {
                    show: false,
                },
                y: {
                    title: {
                        formatter: (val: any) => {
                            return '';
                        },
                    },
                },
            },
            series: [
                {
                    data: [22, 19, 30, 47, 32, 44, 34, 55, 41, 69],
                },
            ],
        };

        // unique visitors
        this.uniqueVisitor = {
            chart: {
                height: 360,
                type: 'bar',
                fontFamily: 'Nunito, sans-serif',
                toolbar: {
                    show: false,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                width: 2,
                colors: ['transparent'],
            },
            colors: ['#5c1ac3', '#ffbb44'],
            dropShadow: {
                enabled: true,
                blur: 3,
                color: '#515365',
                opacity: 0.4,
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    borderRadius: 10,
                    borderRadiusApplication: 'end',
                },
            },
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '14px',
                itemMargin: {
                    horizontal: 8,
                    vertical: 8,
                },
            },
            grid: {
                borderColor: isDark ? '#191e3a' : '#e0e6ed',
                padding: {
                    left: 20,
                    right: 20,
                },
            },
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                axisBorder: {
                    show: true,
                    color: isDark ? '#3b3f5c' : '#e0e6ed',
                },
            },
            yaxis: {
                tickAmount: 6,
                opposite: isRtl ? true : false,
                labels: {
                    offsetX: isRtl ? -10 : 0,
                },
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shade: isDark ? 'dark' : 'light',
                    type: 'vertical',
                    shadeIntensity: 0.3,
                    inverseColors: false,
                    opacityFrom: 1,
                    opacityTo: 0.8,
                    stops: [0, 100],
                },
            },
            tooltip: {
                marker: {
                    show: true,
                },
                y: {
                    formatter: (val: any) => {
                        return val;
                    },
                },
            },
            series: [
                {
                    name: 'Direct',
                    data: [58, 44, 55, 57, 56, 61, 58, 63, 60, 66, 56, 63],
                },
                {
                    name: 'Organic',
                    data: [91, 76, 85, 101, 98, 87, 105, 91, 114, 94, 66, 70],
                },
            ],
        };

        // followers
        this.followers = {
            chart: {
                height: 176,
                type: 'area',
                fontFamily: 'Nunito, sans-serif',
                sparkline: {
                    enabled: true,
                },
            },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            colors: ['#4361ee'],
            grid: {
                padding: {
                    top: 5,
                },
            },
            yaxis: {
                show: false,
            },
            tooltip: {
                x: {
                    show: false,
                },
                y: {
                    title: {
                        formatter: (val: any) => {
                            return '';
                        },
                    },
                },
            },
            fill: isDark
                ? null
                : {
                      type: 'gradient',
                      gradient: {
                          type: 'vertical',
                          shadeIntensity: 1,
                          inverseColors: !1,
                          opacityFrom: 0.3,
                          opacityTo: 0.05,
                          stops: [100, 100],
                      },
                  },
            series: [
                {
                    data: [38, 60, 38, 52, 36, 40, 28],
                },
            ],
        };

        // referral
        this.referral = {
            chart: {
                height: 176,
                type: 'area',
                fontFamily: 'Nunito, sans-serif',
                sparkline: {
                    enabled: true,
                },
            },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            colors: ['#e7515a'],
            grid: {
                padding: {
                    top: 5,
                },
            },
            yaxis: {
                show: false,
            },
            tooltip: {
                x: {
                    show: false,
                },
                y: {
                    title: {
                        formatter: (val: any) => {
                            return '';
                        },
                    },
                },
            },
            fill: isDark
                ? null
                : {
                      type: 'gradient',
                      gradient: {
                          type: 'vertical',
                          shadeIntensity: 1,
                          inverseColors: !1,
                          opacityFrom: 0.3,
                          opacityTo: 0.05,
                          stops: [100, 100],
                      },
                  },
            series: [
                {
                    data: [60, 28, 52, 38, 40, 36, 38],
                },
            ],
        };

        // engagement
        this.engagement = {
            chart: {
                height: 176,
                type: 'area',
                fontFamily: 'Nunito, sans-serif',
                sparkline: {
                    enabled: true,
                },
            },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            colors: ['#1abc9c'],
            grid: {
                padding: {
                    top: 5,
                },
            },
            yaxis: {
                show: false,
            },
            tooltip: {
                x: {
                    show: false,
                },
                y: {
                    title: {
                        formatter: (val: any) => {
                            return '';
                        },
                    },
                },
            },
            fill: isDark
                ? null
                : {
                      type: 'gradient',
                      gradient: {
                          type: 'vertical',
                          shadeIntensity: 1,
                          inverseColors: !1,
                          opacityFrom: 0.3,
                          opacityTo: 0.05,
                          stops: [100, 100],
                      },
                  },
            series: [
                {
                    name: 'Sales',
                    data: [28, 50, 36, 60, 38, 52, 38],
                },
            ],
        };
    }

    initCharts3() {
        const isDark = this.store.theme === 'dark' || this.store.isDarkMode ? true : false;
        const isRtl = this.store.rtlClass === 'rtl' ? true : false;

        // statistics
        this.totalVisit = {
            chart: {
                height: 58,
                type: 'line',
                fontFamily: 'Nunito, sans-serif',
                sparkline: {
                    enabled: true,
                },
                dropShadow: {
                    enabled: true,
                    blur: 3,
                    color: '#009688',
                    opacity: 0.4,
                },
            },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            colors: ['#009688'],
            grid: {
                padding: {
                    top: 5,
                    bottom: 5,
                    left: 5,
                    right: 5,
                },
            },
            tooltip: {
                x: {
                    show: false,
                },
                y: {
                    title: {
                        formatter: (val: any) => {
                            return '';
                        },
                    },
                },
            },
            series: [
                {
                    data: [21, 9, 36, 12, 44, 25, 59, 41, 66, 25],
                },
            ],
        };

        //paid visit
        this.paidVisit = {
            chart: {
                height: 58,
                type: 'line',
                fontFamily: 'Nunito, sans-serif',
                sparkline: {
                    enabled: true,
                },
                dropShadow: {
                    enabled: true,
                    blur: 3,
                    color: '#e2a03f',
                    opacity: 0.4,
                },
            },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            colors: ['#e2a03f'],
            grid: {
                padding: {
                    top: 5,
                    bottom: 5,
                    left: 5,
                    right: 5,
                },
            },
            tooltip: {
                x: {
                    show: false,
                },
                y: {
                    title: {
                        formatter: (val: any) => {
                            return '';
                        },
                    },
                },
            },
            series: [
                {
                    data: [22, 19, 30, 47, 32, 44, 34, 55, 41, 69],
                },
            ],
        };

        // unique visitors
        this.uniqueVisitor = {
            chart: {
                height: 360,
                type: 'bar',
                fontFamily: 'Nunito, sans-serif',
                toolbar: {
                    show: false,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                width: 2,
                colors: ['transparent'],
            },
            colors: ['#5c1ac3', '#ffbb44'],
            dropShadow: {
                enabled: true,
                blur: 3,
                color: '#515365',
                opacity: 0.4,
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    borderRadius: 10,
                    borderRadiusApplication: 'end',
                },
            },
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '14px',
                itemMargin: {
                    horizontal: 8,
                    vertical: 8,
                },
            },
            grid: {
                borderColor: isDark ? '#191e3a' : '#e0e6ed',
                padding: {
                    left: 20,
                    right: 20,
                },
            },
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                axisBorder: {
                    show: true,
                    color: isDark ? '#3b3f5c' : '#e0e6ed',
                },
            },
            yaxis: {
                tickAmount: 6,
                opposite: isRtl ? true : false,
                labels: {
                    offsetX: isRtl ? -10 : 0,
                },
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shade: isDark ? 'dark' : 'light',
                    type: 'vertical',
                    shadeIntensity: 0.3,
                    inverseColors: false,
                    opacityFrom: 1,
                    opacityTo: 0.8,
                    stops: [0, 100],
                },
            },
            tooltip: {
                marker: {
                    show: true,
                },
                y: {
                    formatter: (val: any) => {
                        return val;
                    },
                },
            },
            series: [
                {
                    name: 'Direct',
                    data: [58, 44, 55, 57, 56, 61, 58, 63, 60, 66, 56, 63],
                },
                {
                    name: 'Organic',
                    data: [91, 76, 85, 101, 98, 87, 105, 91, 114, 94, 66, 70],
                },
            ],
        };

        // followers
        this.followers = {
            chart: {
                height: 176,
                type: 'area',
                fontFamily: 'Nunito, sans-serif',
                sparkline: {
                    enabled: true,
                },
            },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            colors: ['#4361ee'],
            grid: {
                padding: {
                    top: 5,
                },
            },
            yaxis: {
                show: false,
            },
            tooltip: {
                x: {
                    show: false,
                },
                y: {
                    title: {
                        formatter: (val: any) => {
                            return '';
                        },
                    },
                },
            },
            fill: isDark
                ? null
                : {
                      type: 'gradient',
                      gradient: {
                          type: 'vertical',
                          shadeIntensity: 1,
                          inverseColors: !1,
                          opacityFrom: 0.3,
                          opacityTo: 0.05,
                          stops: [100, 100],
                      },
                  },
            series: [
                {
                    data: [38, 60, 38, 52, 36, 40, 28],
                },
            ],
        };

        // referral
        this.referral = {
            chart: {
                height: 176,
                type: 'area',
                fontFamily: 'Nunito, sans-serif',
                sparkline: {
                    enabled: true,
                },
            },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            colors: ['#e7515a'],
            grid: {
                padding: {
                    top: 5,
                },
            },
            yaxis: {
                show: false,
            },
            tooltip: {
                x: {
                    show: false,
                },
                y: {
                    title: {
                        formatter: (val: any) => {
                            return '';
                        },
                    },
                },
            },
            fill: isDark
                ? null
                : {
                      type: 'gradient',
                      gradient: {
                          type: 'vertical',
                          shadeIntensity: 1,
                          inverseColors: !1,
                          opacityFrom: 0.3,
                          opacityTo: 0.05,
                          stops: [100, 100],
                      },
                  },
            series: [
                {
                    data: [60, 28, 52, 38, 40, 36, 38],
                },
            ],
        };

        // engagement
        this.engagement = {
            chart: {
                height: 176,
                type: 'area',
                fontFamily: 'Nunito, sans-serif',
                sparkline: {
                    enabled: true,
                },
            },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            colors: ['#1abc9c'],
            grid: {
                padding: {
                    top: 5,
                },
            },
            yaxis: {
                show: false,
            },
            tooltip: {
                x: {
                    show: false,
                },
                y: {
                    title: {
                        formatter: (val: any) => {
                            return '';
                        },
                    },
                },
            },
            fill: isDark
                ? null
                : {
                      type: 'gradient',
                      gradient: {
                          type: 'vertical',
                          shadeIntensity: 1,
                          inverseColors: !1,
                          opacityFrom: 0.3,
                          opacityTo: 0.05,
                          stops: [100, 100],
                      },
                  },
            series: [
                {
                    name: 'Sales',
                    data: [28, 50, 36, 60, 38, 52, 38],
                },
            ],
        };
    }

}
