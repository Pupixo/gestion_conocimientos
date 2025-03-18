import { Component } from '@angular/core';
import { FileUploadWithPreview } from 'file-upload-with-preview';
import Swal from 'sweetalert2';
import { UsuariosCrudService } from 'src/app/services/usuarios/usuarios-crud.service';
import { LLamadasBasicasService } from 'src/app/services/llamadas_basicas/llamadas_basicas.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { DataService } from 'src/app/services/usuarios/usuarios.service';
import { EventEmitter, Output } from '@angular/core';


@Component({
    moduleId: module.id,
    templateUrl: './user-account-settings.html',
})
export class UserAccountSettingsComponent {
    activeTab = 'home';
    foto_header!: string;
    @Output() eventoHijo = new EventEmitter<void>();
    
    zoom = 8;
    pais_combo : string  | undefined;
    depart_combo : string  | undefined;
    prov_combo : string  | undefined;
    dist_combo : string  | undefined;
    noc_combo : string  | undefined;

    formulario_datos_empleado!: FormGroup;

    lista_depart = ['Orange', 'White', 'Purple'];
    lista_prov = ['Orange', 'White', 'Purple'];
    lista_dist = ['Orange', 'White', 'Purple'];
    lista_noc = ['Orange', 'White', 'Purple'];

    lista_pais: any =   [];


    constructor(
        private dataService: DataService,
        private usuarioInfoService: UsuariosCrudService,
        private llamadasBasicasService: LLamadasBasicasService,
        public router: Router,
        private formBuilder: FormBuilder,

    ) {


        this.formulario_datos_empleado = this.formBuilder.group({


            nombres:['',Validators.required],
            apellidos: ['',Validators.required],
            cargo: ['',Validators.required],
  
            pais:[[],Validators.required],
            departamento: [[],Validators.required],
            provincia: [[],Validators.required],
            distrito: [[], Validators.required],
  
            noc: [''],
            localidad: [''],
            direccion: [''],
            referencia: [''],
            celular: [''],
            email: [''],
            sexo: [''],

        });

        

    }

    ngOnInit() {
        this.UserMe();

        this.llamadasBasicasService.lista_paises().subscribe(
            (data) => {
                console.log("🚀 ~ UserAccountSettingsComponent ~ ngOnInit ~ data:", data)
                var filas: any[] =  [];
                for (const item of data) {
                        const objeto = {
                            value:item['id'],
                            label: item['nombre'] +' - '+item['codigopais']
                        };
                        filas.push(objeto);
                    
                }
                this.lista_pais=filas
            },
            (error) => {
    
            }
        )   

    }


    onPaisChange(event: any): void {
        console.log('Departamento seleccionado:', event);
        const selectedValue = event ? event.id : null; // Ajusta según la estructura del objeto
        console.log('ID del departamento seleccionado:', selectedValue);
        // Aquí puedes realizar las acciones necesarias cuando se cambia la selección
        this.llamadasBasicasService.lista_departamentos('pais',selectedValue).subscribe(
            (data) => {
                 console.log("🚀 ~ UserAccountSettingsComponent ~ onPaisChange ~ data:", data)
                 
            },
            (error) => {
    
            }
        )
    }

    onDepartmentChange(event: any): void {
        console.log('Departamento seleccionado:', event);
        const selectedValue = event ? event.id : null; // Ajusta según la estructura del objeto
        console.log('ID del departamento seleccionado:', selectedValue);
        // Aquí puedes realizar las acciones necesarias cuando se cambia la selección
        this.llamadasBasicasService.lista_provincias('departamento',selectedValue).subscribe(
            (data) => {
                 console.log("🚀 ~ UserAccountSettingsComponent ~ onDepartmentChange ~ data:", data)
                 
            },
            (error) => {
    
            }
        )
    }

    onProvinciaChange(event: any): void {
        console.log('Departamento seleccionado:', event);
        const selectedValue = event ? event.id : null; // Ajusta según la estructura del objeto
        console.log('ID del departamento seleccionado:', selectedValue);
        // Aquí puedes realizar las acciones necesarias cuando se cambia la selección
        this.llamadasBasicasService.lista_distrito('provincia',selectedValue).subscribe(
            (data) => {
                 console.log("🚀 ~ UserAccountSettingsComponent ~ onProvinciaChange ~ data:", data);
            },
            (error) => {
                this.logout();
            }
        )
    }



    notificarPadre(accion: string) {
        const valor = { mensaje: `¡Hola desde el hijo para ${accion}!` };
        this.dataService.llamarFuncionPadre(accion, valor);
    }

    ngAfterViewInit() {
        const firstUpload = new FileUploadWithPreview('myFirstImage', {
          images: {
            baseImage: '/assets/images/file-preview.svg',
            backgroundImage: '',
          },
          text: {
            browse: 'Escoja',
            chooseFile: 'Seleccione su Foto de perfil...',
            label: 'Escoja el archivo a subir',
          },
        });

        const firstUploadInfoButton = document.querySelector('.upload-info-button-first');

        if (firstUploadInfoButton) {
            firstUploadInfoButton.addEventListener('click', () => {
                console.log('First cachedFileArray:', firstUpload.cachedFileArray);
                console.log('First cachedFileArray:', firstUpload.cachedFileArray.length);
                if(firstUpload.cachedFileArray.length > 0){
                    const formData = new FormData();
                    formData.append('foto', firstUpload.cachedFileArray[0]);
                    formData.append("current_user", localStorage.getItem("current_user") ?? '');
                    this.usuarioInfoService.RegistrarfotoPerfil(formData).subscribe(
                        respuesta => {
                              Swal.fire({
                                  icon: 'success',
                                  title: 'Se registro',
                                  text: '!',
                                  padding: '2em',
                              });
                              this.eventoHijo.emit();
                              this.UserMe();
                              this.notificarPadre("actualizar_header_perfil");
                      },(error) => {
                            Swal.fire({
                              icon: "error",
                              title: "Oops...",
                              text: "Algo sucedio con el servidor",
                              padding: '2em',
                            });     
                      })
                }else{
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "!Debes subir un archivo!",
                        footer: '<a href="#">Si tienes mas problemas recarga la pagina</a>',
                        padding: '2em',
                    });
                }
            });
        }
    }

    UserMe(){
        const formData = new FormData();
    
        formData.append("user", localStorage.getItem("usuario") ?? '');
        formData.append("pass", localStorage.getItem("password") ?? '');
    
        this.usuarioInfoService.CurrentUser(formData).subscribe(
        (data) => {
                const parseado_data=JSON.stringify(data)
                const obj = JSON.parse(parseado_data);
                const texto_print:any[] = obj;                 
                this.foto_header=  texto_print[0].foto;
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
        this.router.navigate(['/login']);
    }

  


}
