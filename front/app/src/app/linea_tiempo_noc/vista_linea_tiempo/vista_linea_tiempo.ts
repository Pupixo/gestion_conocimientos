import { Component, OnInit, ViewChild } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { WordToPdfService } from 'src/app/services/buscar_archivos/visualizador-archivos.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import Swiper, { Autoplay, Navigation, Pagination } from 'swiper';


import Fuse from 'fuse.js';
import * as JSZip from 'jszip';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

import { FlatpickrOptions } from 'ng2-flatpickr';
import { Spanish } from 'flatpickr/dist/l10n/es';


import { UsuariosCrudService } from 'src/app/services/usuarios/usuarios-crud.service';
import { ReporteExcelService } from 'src/app/services/reportesexcel/reportesexcel.service';
import { LineaTiempoGenericService } from 'src/app/services/lineatiempo/lineatiempo_generic.service';

import * as moment from 'moment';
import 'moment/locale/es';
import { slideDownUp } from '../../shared/animations';


interface Message {
  text: string;
  isUser: boolean;
}

@Component({
  moduleId: module.id,
  selector: 'app-vista_linea_tiempo',
  templateUrl: './vista_linea_tiempo.html',
  styleUrls: ['./vista_linea_tiempo.css'],
  animations: [slideDownUp,
    trigger('toggleAnimation', [
      transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
      transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
    ]),
  ],
})



export class VistaLineaTiempoComponent {
  fileData!: File;
  fileDatatxt!: File;

  dateTime: FlatpickrOptions;

  formulario!: FormGroup;
  isLoading = true;
  store: any;

  constructor(
    private wordToPdfService: WordToPdfService,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    public storeData: Store<any>,
    private usuarioscrudService: UsuariosCrudService,
    private reporteexcel: ReporteExcelService,
    private lineatiempogenerico: LineaTiempoGenericService
  ) {

      this.initStore();

      this.formulario = this.formBuilder.group({
        fecha_hora_evento: ['2024-10-11 19:30'],
        codigo_ticket: [''],
        evento_titulo : [''],
        descrip_evento: [''],
      });

      const fechaFormateada = moment().format('YYYY-MM-DD HH:mm');

      // defaultDate:  '2024-10-11 12:00',

      this.dateTime = {
        defaultDate: fechaFormateada,
        enableTime: true,
        dateFormat: 'Y-m-d H:i',
        position: 'auto right',
        locale: Spanish,  // Configuración del idioma a español
      };
  }

    search = '';
    items: any = [
        {
          id:1,
          codigo_ticket: 'INC24242424242424',
          fecha_hora:'2024-10-14 17:57',
          estado:1,
          descripcion:'sdksahdkshdkjsahd jsadlksadlksajdl kajdslsajdsa sadlisad'
        },
    ];
  
  // status: 'Active',
  // statusClass: 'badge badge-outline-primary',

  focus = false;
  filteredItem = this.items || [];

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
                } else {
                    setTimeout(() => {
                    }, 100000);
                }
            }
        });
  }

// item.fecha_hora.toLowerCase().includes(this.search.toLowerCase()) ||
// item.descripcion.toLowerCase().includes(this.search.toLowerCase()) ||
// item.estado.toLowerCase().includes(this.search.toLowerCase()) ||

  searchResults(){
      this.filteredItem = this.items.filter((item: any) => {
          return (
              item.codigo_usu.toLowerCase().includes(this.search.toLowerCase())
          );
      });
  }

  // funciones del modal actual
  initForm() {

      const startDate = new Date();
      startDate.setDate(1); 

      const endDate = new Date(startDate);
      endDate.setDate(15);  

      const startDateString = startDate.toISOString().split('T')[0];
      const endDateString = endDate.toISOString().split('T')[0];

      // fecha_hora_evento: ['2023-07-05 a 2023-07-10'],
      // `${startDateString} a ${endDateString}`

      this.formulario = this.formBuilder.group({
        fecha_hora_evento: [],
      });

  }

  //---------------
  coloredToast(color: string, msg: string) {
    const toast = Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 3000,
      showCloseButton: true,
      customClass: {
        popup: `color-${color}`
      }
    });
    toast.fire({ title: msg });
  }

  //---------------
  async GuardarFormulario() {

    setTimeout(() => {
        this.storeData.dispatch({ type: 'toggleMainLoader', payload: true });
    }, 500);

    var fecha_hora_evento = this.formulario.get('fecha_hora_evento')?.value ?? '';
    console.log("🚀 ~ AnalisisReporteC7Component ~ uploadData ~ fecha_hora_evento:", fecha_hora_evento)
    const fechaini = moment(fecha_hora_evento).format('YYYY-MM-DD HH:mm:ss');
    console.log("🚀 ~ RegistroLineaTiempoComponent ~ GuardarFormulario ~ fechaini:", fechaini)

    var codigo_ticket = this.formulario.get('codigo_ticket')?.value ?? '';
    console.log("🚀 ~ RegistroLineaTiempoComponent ~ GuardarFormulario ~ codigo_ticket:", codigo_ticket)
    var evento_titulo = this.formulario.get('evento_titulo')?.value ?? '';
    console.log("🚀 ~ RegistroLineaTiempoComponent ~ GuardarFormulario ~ evento_titulo:", evento_titulo)
    var descrip_evento = this.formulario.get('descrip_evento')?.value ?? '';
    console.log("🚀 ~ RegistroLineaTiempoComponent ~ GuardarFormulario ~ descrip_evento:", descrip_evento)

  if (  fecha_hora_evento.trim() !== '' || 
        codigo_ticket.trim() !== '' || 
        evento_titulo.trim() !== '' || 
        descrip_evento.trim() !== ''
    )
    {

        try{
          const formData = new FormData();
          formData.append('fecha_hora_evento',fechaini);
          formData.append('codigo_ticket', codigo_ticket);
          formData.append('evento_titulo', evento_titulo);
          formData.append('descrip_evento', descrip_evento);
          const url = await this.Registrar_incidencia(formData);
          console.log("🚀 ~ uploadData ~ url:", url)
    
          setTimeout(() => {
            this.storeData.dispatch({ type: 'toggleMainLoader', payload: false });
          }, 500);

        } catch (error:any) {
            Swal.fire({
              icon: "error",
              title: "¡Oops...!",
              text: "Se encontro errores al Registrar",
              padding: '2em',
            });     
            
            setTimeout(() => {
              this.storeData.dispatch({ type: 'toggleMainLoader', payload: false });
            }, 500);
        }

    } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "!Debes completar los campos requeridos!",
          footer: '<div style="overflow-wrap: break-word;word-wrap: break-word; /* For IE */word-break: break-word;white-space: normal;">Si tienes mas problemas recarga la pagina</div>',
          padding: '2em',
        });
        setTimeout(() => {
            this.storeData.dispatch({ type: 'toggleMainLoader', payload: false });
        }, 500);
    }
  }
  
  //-------------
  async Registrar_incidencia(formData: FormData): Promise<any> {
      try {
            const result = this.lineatiempogenerico.registrar(formData).toPromise();  
          return result;
      } catch (error) {
            throw new Error((error as any).message); // Use `as any` to assert
      }
  }

  // Función para convertir el valor a mayúsculas
  convertirAMayusculas(){
    const codigoTicket = this.formulario.get('codigo_ticket')?.value;
    if (codigoTicket) {
      // Convierte a mayúsculas y actualiza el valor del formControl
      this.formulario.get('codigo_ticket')?.setValue(codigoTicket.toUpperCase(), { emitEvent: false });
    }
  }

  // Función para mapear el valor numérico al estado correspondiente
  getEstadoClass(estado: number): string {
    switch (estado) {
      case 1:
        return 'danger';
      case 2:
        return 'primary';
      case 3:
        return 'warning';
      case 4:
        return 'secondary';
      default:
        return 'default'; // En caso de que no coincida con ningún valor
    }
  }

  getEstadoName(estado: number): string {
    switch (estado) {
      case 1:
        return 'rojo';
      case 2:
        return 'azul';
      case 3:
        return 'amarillo';
      case 4:
        return 'morado';
      default:
        return 'default'; // En caso de que no coincida con ningún valor
    }
  }
  
}