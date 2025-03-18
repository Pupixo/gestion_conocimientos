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

import * as moment from 'moment';
import 'moment/locale/es';

import { slideDownUp } from '../../../../shared/animations';
import { ModalComponent } from 'angular-custom-modal';

import { UsuariosCrudService } from 'src/app/services/usuarios/usuarios-crud.service';
import { LineaTiempoGenericService } from 'src/app/services/lineatiempo/lineatiempo_generic.service';
import { LineaTiempoService } from 'src/app/services/lineatiempo/lineatiempo.service';

import { EventEmitter, Output } from '@angular/core';

interface Message {
  text: string;
  isUser: boolean;
}

@Component({
  moduleId: module.id,
  selector: 'app-modal_evento',
  templateUrl: './modal_evento.html',
  styleUrls: ['./modal_evento.css'],
  animations: [slideDownUp,
    trigger('toggleAnimation', [
      transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
      transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
    ]),
  ],
})

export class ModalEventoComponent {
  @Output() eventoHijo = new EventEmitter<void>();


  data_recibida_modal:  any={};
  parametros_modal!: FormGroup;
  modal_eventos!: FormGroup;

  dateTime: FlatpickrOptions;
  isLoading = true;
  store: any;

  constructor(
    private wordToPdfService: WordToPdfService,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    public storeData: Store<any>,
    private usuarioscrudService: UsuariosCrudService,
    private lineatiempogenerico: LineaTiempoGenericService
  ) {
      const fechaFormateada = moment().format('YYYY-MM-DD HH:mm');
      this.dateTime = {
        defaultDate: fechaFormateada,
        enableTime: true,
        dateFormat: 'Y-m-d H:i',
        position: 'auto right',
        locale: Spanish,  // Configuración del idioma a español
      };

      this.initStore();
      
  }

    search = '';
    items: any = [
        {
          id:1,
          codigo_ticket: 'INC24242424242424',
          fecha_hora:'2024-10-14 17:57'
        },
    ];
  
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

  ngOnChanges() {
    console.log('ngOnChanges - cambios detectados en las propiedades de entrada.');
  }

  ngOnInit() {
    this.initForm();
    this.InicializarDatos();

    setTimeout(() => {
    }, 3000);
  }

  ngDoCheck() {
    console.log('ngDoCheck - detección de cambios personalizada.');
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit - la vista ha sido inicializada.');
  }

  ngOnDestroy() {
    console.log('ngOnDestroy - el componente está a punto de ser destruido.');
  }

  InicializarDatos(){
    // Recuperar datos del servicio
    this.data_recibida_modal = this.lineatiempogenerico.getData();
    console.log("🚀 ~ ModalLineaTiempoComponent ~ InicializarDatos ~ this.data_recibida_modal:", this.data_recibida_modal)
    if (Object.keys(this.data_recibida_modal).length === 0) {
        console.log('Data is null or undefined');
    } else {
        this.parametros_modal.setValue({
            id: this.data_recibida_modal.id,
            fecha_hora_evento: this.data_recibida_modal.fecha_hora_evento,
            codigo_ticket: this.data_recibida_modal.codigo_ticket,
            estado_evento: this.data_recibida_modal.evento_titulo,
            descrip_evento: this.data_recibida_modal.descrip_evento,
            noc: this.data_recibida_modal.noc,
        });
    }       
  } 

   // funciones del modal actual
  initForm() {
    const fechaFormateada = moment().format('YYYY-MM-DD HH:mm');

      this.parametros_modal = this.formBuilder.group({
          id: [0],
          fecha_hora_evento: [fechaFormateada],
          codigo_ticket: [''],
          evento_titulo : [''],
          descrip_evento: [''],
          noc:[''],
      });


      this.modal_eventos = this.formBuilder.group({
          id: [0]
      });

      
  }

  searchResults(){
      this.filteredItem = this.items.filter((item: any) => {
        console.log("🚀 ~ RegistroLineaTiempoComponent ~ this.filteredItem=this.items.filter ~ item:", item.codigo_ticket)
        
          return (
              item.codigo_ticket.toLowerCase().includes(this.search.toLowerCase())
          );
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
  async GuardarDatos() {

    setTimeout(() => {
        this.storeData.dispatch({ type: 'toggleMainLoader', payload: true });
    }, 500);

    var fecha_hora_evento = this.parametros_modal.get('fecha_hora_evento')?.value ?? '';
    const fechaini = moment(fecha_hora_evento).format('YYYY-MM-DD HH:mm:ss');
    var codigo_ticket = this.parametros_modal.get('codigo_ticket')?.value ?? '';
    var evento_titulo = this.parametros_modal.get('evento_titulo')?.value ?? '';
    var descrip_evento = this.parametros_modal.get('descrip_evento')?.value ?? '';

    if (  fecha_hora_evento.trim() === '' && 
        codigo_ticket.trim() === '' && 
        evento_titulo.trim() === '' && 
        descrip_evento.trim() === ''
    ) {


      const id = Object.keys(this.data_recibida_modal).length === 0 ? 0 : this.data_recibida_modal.id;
      if(id == 0){

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


      }else{

          try{
            const formData = new FormData();
            formData.append('fecha_hora_evento',fechaini);
            formData.append('codigo_ticket', codigo_ticket);
            formData.append('evento_titulo', evento_titulo);
            formData.append('descrip_evento', descrip_evento);

            const url = await this.Editar_incidencia(formData,id);
            console.log("🚀 ~ uploadData ~ url:", url)
      
            setTimeout(() => {
              this.storeData.dispatch({ type: 'toggleMainLoader', payload: false });
            }, 500);

          } catch (error:any) {
              Swal.fire({
                icon: "error",
                title: "¡Oops...!",
                text: "Se encontro errores al Editar",
                padding: '2em',
              });     
              
              setTimeout(() => {
                this.storeData.dispatch({ type: 'toggleMainLoader', payload: false });
              }, 500);
          }


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

  async Editar_incidencia(formData: FormData,id:number): Promise<any> {
    try {
          const result = this.lineatiempogenerico.modificar(formData ,id).toPromise();  
        return result;
    } catch (error) {
          throw new Error((error as any).message); // Use `as any` to assert
    }
}

//------------------------

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




  notificarPadre(accion: string) {
    const valor = { mensaje: `¡Hola desde el hijo para ${accion}!` };
    this.lineatiempogenerico.llamarFuncionPadre(accion, valor);
  }

  CerrarModalEvento() {
      this.eventoHijo.emit();
      this.notificarPadre("cerrar_modal_evento");          
  }

}