import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { animate, style, transition, trigger } from '@angular/animations';
import Swiper, { Autoplay, Navigation, Pagination } from 'swiper';
import { UsuariosCrudService } from 'src/app/services/usuarios/usuarios-crud.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
    moduleId: module.id,
    templateUrl: './index.html',
    animations: [
        trigger('toggleAnimation', [
            transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
            transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
        ]),
    ],
})
export class IndexComponent {
    store: any;
    revenueChart: any;
    salesByCategory: any;
    dailySales: any;
    totalOrders: any;
    isLoading = true;

    //carosel
    codeArr: any = [];
    swiper1: any;
    swiper2: any;
    swiper3: any;
    swiper4: any;
    swiper5: any;

    toggleCode = (name: string) => {
        if (this.codeArr.includes(name)) {
            this.codeArr = this.codeArr.filter((d: string) => d != name);
        } else {
            this.codeArr.push(name);
        }
    };

    items = ['carousel1.jpeg', 'carousel2.jpeg', 'carousel3.jpeg'];


    PrimerNombre!: string;
    SegundoNombre!: string;
    Rol!: string;
    nombreVal!: boolean;
    foto_header!: string;

    
    constructor(
        public router: Router,
        public storeData: Store<any>,       
        private usuarioInfoService: UsuariosCrudService,
    ) {
        this.initStore();
        this.isLoading = false;
    }

    async initStore() {

        this.storeData
            .select((d) => d.index)
            .subscribe((d) => {
                const hasChangeTheme = this.store?.theme !== d?.theme;
                const hasChangeLayout = this.store?.layout !== d?.layout;
                const hasChangeMenu = this.store?.menu !== d?.menu;
                const hasChangeSidebar = this.store?.sidebar !== d?.sidebar;
                this.store = d;
                if (hasChangeTheme || hasChangeLayout || hasChangeMenu || hasChangeSidebar) {
                    if (this.isLoading || hasChangeTheme) {
                        this.initCharts(); //init charts
                    } else {
                        setTimeout(() => {
                            this.initCharts(); // refresh charts
                        }, 300);
                    }
                }
            });
    }

    ngOnInit() {
        this.UserMe();
    }


    UserMe(){
        const formData = new FormData();
        formData.append("user", localStorage.getItem("usuario") ?? '');
        formData.append("pass", localStorage.getItem("password") ?? '');
    
          this.usuarioInfoService.CurrentUser(formData).subscribe(
            (data) => {
                  console.log("🚀 ~ IndexComponent ~ UserMe ~ data:", data)
                  const parseado_data=JSON.stringify(data)
                  const obj = JSON.parse(parseado_data);
                  const texto_print:any[] = obj;
                  this.nombreVal=  texto_print[0].user_data[0].is_superuser;
                  this.PrimerNombre=  texto_print[0].user_data[0].first_name;
                  this.SegundoNombre=  texto_print[0].user_data[0].last_name;
                  this.Rol=  texto_print[0].rol_data[0].role_name;                  
                  this.foto_header=  texto_print[0].foto;
                  localStorage.setItem('current_user', texto_print[0].user);

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


    ngAfterViewInit() {
        this.swiper1 = new Swiper('#slider1', {
            modules: [Navigation, Pagination],
            navigation: { nextEl: '.swiper-button-next-ex1', prevEl: '.swiper-button-prev-ex1' },
            pagination: {
                el: '#slider1 .swiper-pagination',
                type: 'bullets',
                clickable: true,
            },
        });
        this.swiper2 = new Swiper('#slider2', {
            modules: [Navigation, Autoplay],
            navigation: { nextEl: '.swiper-button-next-ex2', prevEl: '.swiper-button-prev-ex2' },
            autoplay: { delay: 2000 },
        });
        this.swiper3 = new Swiper('#slider3', {
            modules: [Pagination, Autoplay],
            direction: 'vertical',
            autoplay: { delay: 2000 },
            pagination: {
                el: '#slider3 .swiper-pagination',
                type: 'bullets',
                clickable: true,
            },
        });
        this.swiper4 = new Swiper('#slider4', {
            modules: [Navigation, Pagination],
            slidesPerView: 'auto',
            spaceBetween: 30,
            loop: true,
            navigation: { nextEl: '.swiper-button-next-ex4', prevEl: '.swiper-button-prev-ex4' },
            pagination: {
                el: '#slider4 .swiper-pagination',
                type: 'fraction',
                clickable: true,
            },
        });
        this.swiper5 = new Swiper('#slider5', {
            modules: [Navigation, Pagination],
            navigation: { nextEl: '.swiper-button-next-ex5', prevEl: '.swiper-button-prev-ex5' },
            breakpoints: {
                1024: { slidesPerView: 3, spaceBetween: 30 },
                768: { slidesPerView: 2, spaceBetween: 40 },
                320: { slidesPerView: 1, spaceBetween: 20 },
            },
            pagination: {
                el: '#slider5 .swiper-pagination',
                type: 'bullets',
                clickable: true,
            },
        });
    }

    initCharts() {
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
    }


    goToCapacitacion() {
        this.router.navigate(['/intranet/plataform_learn_file/learn_claro']);
    }

    goToConocimiento() {
        this.router.navigate(['/intranet/managment_file/routes_files']);
    }


    
}
