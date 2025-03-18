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

import { slideDownUp } from '../../shared/animations';
import { ModalComponent } from 'angular-custom-modal';

import { UsuariosCrudService } from 'src/app/services/usuarios/usuarios-crud.service';
import { LineaTiempoGenericService } from 'src/app/services/lineatiempo/lineatiempo_generic.service';
import { LineaTiempoService } from 'src/app/services/lineatiempo/lineatiempo.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';


interface Message {
  text: string;
  isUser: boolean;
}

@Component({
  moduleId: module.id,
  selector: 'app-registro_linea_tiempo',
  templateUrl: './registro_linea_tiempo.html',
  styleUrls: ['./registro_linea_tiempo.css'],
  animations: [slideDownUp,
    trigger('toggleAnimation', [
      transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
      transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
    ]),
  ],
})

export class RegistroLineaTiempoComponent {

  @ViewChild('ModalLineaTiempo') ModalLineaTiempo!: ModalComponent;
  private suscripcion: Subscription;

  dateTime: FlatpickrOptions;
  incidenciaLista: any =   [];

  isLoading = true;
  store: any;
  params!: FormGroup;

  constructor(
    private wordToPdfService: WordToPdfService,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    public storeData: Store<any>,
    private usuarioscrudService: UsuariosCrudService,
    private lineatiempogenerico: LineaTiempoGenericService,
    private lineatiemposervice: LineaTiempoService,
    public router: Router,

  ) {

      this.initStore();

      this.suscripcion = this.lineatiempogenerico.invocarFuncionPadre.subscribe((evento) => {
        switch (evento.accion) {
            case 'listar_incidencia':
                this.ListaIncidencia();
            break;
            case 'cerrar_modal_lin_tiem':
                this.CerrarModalLineaTiempo();
            break;
          // Agrega más casos según sea necesario
          default:
            console.log('Acción no reconocida');
        }
      });

      const fechaFormateada = moment().format('YYYY-MM-DD HH:mm');

      this.dateTime = {
        defaultDate: fechaFormateada,
        enableTime: true,
        dateFormat: 'Y-m-d H:i',
        position: 'auto right',
        locale: Spanish,  // Configuración del idioma a español
      };
  }

    search = '';  
    focus = false;
    filteredItem = this.incidenciaLista || [];

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

  ngOnInit() {
    this.initForm();
    this.ListaIncidencia();

    setTimeout(() => {
    }, 3000);
  }

  initForm() {
      this.params = this.formBuilder.group({
          id: [0],
      });
  }

  //listar 
  ListaIncidencia(){
    this.lineatiemposervice.listarLineaTiempo().subscribe(
        (data) => {
            this.incidenciaLista = data
            console.log("🚀 ~ ListarAlumnos ~ this.incidenciaLista:", this.incidenciaLista)
        },
        (error) => {
            if(error.status == 401){
            this.logout();
            }
        }
    )  
  }

  searchResults(){
      this.filteredItem = this.incidenciaLista.filter((item: any) => {
          return (
              item.codigo_ticket.toLowerCase().includes(this.search.toLowerCase())
          );
      });
  }

  //--------------- configuración

  logout(){
      localStorage.clear();
      this.router.navigate(['/signin']);
  }    

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

  // modales eventos
  ModalRegistroEdicionLineaTiempo(datos_recibidos: any = null) {
      console.log("🚀 ~ RegistroLineaTiempoComponent ~ editCurso ~ datos_recibidos:", datos_recibidos)
      this.ModalLineaTiempo.open();
      this.initForm();
      if (datos_recibidos == null) {
          var datas : any={};         
          console.log("🚀 ~ RegistroLineaTiempoComponent ~ editCurso ~ datas:", datas)
          this.lineatiempogenerico.setData(datas);
          return;
      }else{
          this.params.setValue({
              id: datos_recibidos.id,
          });
          this.lineatiempogenerico.setData(datos_recibidos);
      }
  }

  CerrarModalLineaTiempo(){
      this.ModalLineaTiempo.close()
  }
    
}