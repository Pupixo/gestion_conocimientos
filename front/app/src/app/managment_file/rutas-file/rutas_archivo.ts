import { Component, ViewChild } from '@angular/core';
import { slideDownUp } from '../../shared/animations';
import { animate, style, transition, trigger } from '@angular/animations';
import Swal from 'sweetalert2';
import { UsuariosCrudService } from 'src/app/services/usuarios/usuarios-crud.service';
import { RutaArchivoDetalleService } from 'src/app/services/ruta_archivos/ruta-archivos-detallado.service';
import { LlamadaComponentesRutaArchivos } from 'src/app/services/ruta_archivos/llamada_componentes_ruta';
import { Subscription } from 'rxjs';
import { SubCarpetaArbolComponent } from './subcarpetaarbol/sub-carpetas-arbol';


@Component({
    moduleId: module.id,
    selector: 'app-rutas-archivo.',
    templateUrl: './rutas_archivo.html',
    styleUrls: ['./rutas_archivo.css'],
    animations: [ slideDownUp,
        trigger('toggleAnimation', [
            transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
            transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
        ]),
    ],
})


export class RutasArchivosComponent {
    // private suscripcion: Subscription;
    data: any = [];
    public expandedItems: Set<string> = new Set();
    item: any;  // Asumiendo que 'item.sub_carpetas' ya está definido
    expandedSubfolders: Set<string> = new Set();
    @ViewChild(SubCarpetaArbolComponent, { static: false })
    subCarpetasArbolComponent!: SubCarpetaArbolComponent;
    treeview1: any = [];

    constructor(       
        private usuarioscrudService: UsuariosCrudService, 
        private busqueda_archivo_det: RutaArchivoDetalleService,
        private llama_componente: LlamadaComponentesRutaArchivos,

    ) {    }

    ngOnInit() {
        let ele = document.querySelectorAll('.treeview1 button.active') || [];
        if (ele.length > 0) {
            ele.forEach((d: any) => {
                d.click();
            });
        }
        // this.SaveFile();
        this.ListarArchivos();
    }

    // toggleTreeview(name: string,ruta:string): void {
    //     if (this.treeview1.includes(name)) {
    //         this.treeview1 = this.treeview1.filter((d: string) => d !== name);
    //     } else {
    //         this.treeview1.push(name);
    //     }
    //     this.subCarpetasArbolComponent.ListarArchivos(ruta); // Por ejemplo
    // }

    toggleTreeview(subfolder: string,ruta:string): void {
        if (this.treeview1.includes(subfolder)) {
          // Si el subfolder está abierto, ciérralo
          this.treeview1 = this.treeview1.filter((item:any) => item !== subfolder);
        } else {
          // Cierra todos los subfolders y abre el seleccionado
          this.treeview1 = [subfolder];
        }
    }

    ListarArchivos() {
          this.busqueda_archivo_det.listar().subscribe(
            (data) => {
                this.data= data;
                console.log("🚀 ~ BusquedaArchivoComponent ~ Busqueda ~ data:", data)
            },
            (error) => {
                  
            }
          );
    }




    CrearCarpetaEnRaiz(rutafolder?: any, ruta?: any) {
        console.log("🚀 ~ RutasArchivosComponent ~ CrearCarpetaEnRaiz ~ ruta:", ruta)
        console.log("🚀 ~ RutasArchivosComponent ~ CrearCarpetaEnRaiz ~ rutafolder:", rutafolder)

        type LoginFormResult = {
            carpeta_nom: string
        }
        let nom_carpeta: HTMLInputElement
        
        Swal.fire<LoginFormResult>({
            title: 'Crear Carpeta',
            html: `
            <input type="text" id="carpeta_nom" class="swal2-input" placeholder="Nombre de carpeta">
            `,
            confirmButtonText: 'Guardar',
            focusConfirm: false,
            didOpen: () => {
                const popup = Swal.getPopup()!
                nom_carpeta = popup.querySelector('#carpeta_nom') as HTMLInputElement
                nom_carpeta.onkeyup = (event) => event.key === 'Enter' && Swal.clickConfirm()
            },
            preConfirm: () => {
                let value = nom_carpeta.value.trim(); // Elimina espacios al inicio y al final
                if (!value) {
                    Swal.showValidationMessage(`Tú necesitas escribir el nombre de la nueva carpeta`)
                } else {
                    // Reemplazar espacios en blanco por guiones bajos
                    value = value.replace(/\s+/g, '_');
    
                    Swal.fire({
                        icon: 'warning',
                        title: '¿Estás seguro?',
                        text: "No podrás revertir esto",
                        showCancelButton: true,
                        confirmButtonText: 'Continuar',
                        padding: '2em',
                    }).then((result) => {
                        if (result.value) {
                            Swal.fire({ title: 'Hecho!', text: 'La acción está hecha', icon: 'success', });
                        }
                    });
    
                    const formData = new FormData();
                    const folderName = rutafolder ?? 'archivos';
                    // const nuevaRuta = folderName.replace(/\$/g, '/');

                    formData.append('rutafolder', 'archivos/' + folderName);
                    formData.append('newfolder', value);
    
                    this.busqueda_archivo_det.crearCarpeta(formData).subscribe(
                        (data) => {
                            console.log("🚀 ~ BusquedaArchivoComponent ~ Busqueda ~ data:", data);
                            Swal.fire(`Tu nueva carpeta es ${value}`);
                            this.ListarArchivos();

                        },
                        (error) => {
                            Swal.fire({
                                icon: "error",
                                title: "Oops...",
                                text: "Error al crear carpeta",
                              });
                            console.error("Error al crear la carpeta:", error);
                        }
                    );


                }
                return { carpeta_nom: value }
            },
        })
    }

    SubirArchivoEnRaiz(rutafolder?: string, ruta?: string) {
        console.log("🚀 ~ RutasArchivosComponent ~ SubirArchivoEnRaiz ~ ruta:", ruta)
        console.log("🚀 ~ RutasArchivosComponent ~ SubirArchivoEnRaiz ~ rutafolder:", rutafolder)


        type LoginFormResult = {
            file_nom: string,
            archivo_upload: File | null
        };
    
        let file_nombre: HTMLInputElement;
        let archivo: HTMLInputElement;
        Swal.fire<LoginFormResult>({
            title: 'Subir Archivo',
            html: `
                <div style="display: flex; flex-direction: column; gap: 1em;">
                    <input type="file" id="archivo_upload" class="swal2-input" style="padding: 0.5em; border-radius: 5px;">
                    <input type="text" id="file_nom" class="swal2-input" placeholder="Nombre de archivo" style="padding: 0.5em; border-radius: 5px;">
                </div>
            `,
            confirmButtonText: 'Guardar',
            focusConfirm: false,
            didOpen: () => {
                const popup = Swal.getPopup()!;
                file_nombre = popup.querySelector('#file_nom') as HTMLInputElement;
                archivo = popup.querySelector('#archivo_upload') as HTMLInputElement;
    
                // Manejar "Enter" para ambos campos
                [file_nombre, archivo].forEach(input =>
                    input.onkeyup = (event) => event.key === 'Enter' && Swal.clickConfirm()
                );
            },
            preConfirm: () => {
                const nombreArchivo = file_nombre.value.trim().replace(/\s+/g, '-'); // Limpiar nombre
                const archivoSubido = archivo.files ? archivo.files[0] : null; // Verificar archivo
                if (!nombreArchivo) {
                    Swal.showValidationMessage('Necesitas escribir el nombre del archivo');
                    return;
                }
                if (!archivoSubido) {
                    Swal.showValidationMessage('Necesitas subir un archivo');
                    return;
                }
                // Devolver los valores
                return { file_nom: nombreArchivo, archivo_upload: archivoSubido };
            }
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                const { file_nom, archivo_upload } = result.value;
                // Confirmación antes de proceder
                Swal.fire({
                    icon: 'warning',
                    title: '¿Estás seguro?',
                    text: "No podrás revertir esto",
                    showCancelButton: true,
                    confirmButtonText: 'Continuar',
                    cancelButtonText: 'Cancelar',
                    padding: '2em',
                }).then((confirmResult) => {
                    if (confirmResult.isConfirmed) {
                        const formData = new FormData();
                        const folderName = rutafolder ?? 'archivos';
                        // const nuevaRuta = folderName.replace(/\$/g, '/');

                        formData.append('rutafolder', `archivos/${folderName}`);
                        formData.append('nom_file', file_nom);
                        formData.append('archivo', archivo_upload!);
    
                        // Llamar al servicio de subida
                        this.busqueda_archivo_det.crearArchivo(formData).subscribe(
                            (data) => {
                                console.log("Archivo subido exitosamente:", data);
                                Swal.fire('Hecho!', `Tu nuevo archivo ${file_nom} ha sido subido`, 'success');
                                this.ListarArchivos(); // Actualizar la lista de archivos
                            },
                            (error) => {
                                Swal.fire({
                                    icon: "error",
                                    title: "Oops...",
                                    text: "Error al subir el archivo",
                                });
                                console.error("Error al subir el archivo:", error);
                            }
                        );
                    }
                });
            }
        });
    }

    EliminarCarpeta(rutafolder?: any, ruta?: any) {
        

        Swal.fire({
            title: "Estas Seguro de Eliminar Carpeta",
            text: "Todo el contenido se eliminará y no se recuperará",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "¡Si, lo eliminaré!"
        }).then((result) => {
            if (result.isConfirmed) {

                console.log("🚀 ~ RutasArchivosComponent ~ EliminarCarpeta ~ ruta:", ruta)
                console.log("🚀 ~ RutasArchivosComponent ~ EliminarCarpeta ~ rutafolder:", rutafolder)

                const formData = new FormData();
                const folderName = rutafolder ?? 'archivos';
                console.log("🚀 ~ RutasArchivosComponent ~ EliminarCarpeta ~ folderName:", folderName)
                // const nuevaRuta = folderName.replace(/\$/g, '/');

                // formData.append('rutafolder', folderName);
                formData.append('ruta', ruta);


                this.busqueda_archivo_det.EliminarArchivo(formData).subscribe(
                    (data) => {
                        
                            console.log("🚀 ~ RutasArchivosComponent ~ EliminarCarpeta ~ data:", data)
                            Swal.fire({
                                title: "¡Eliminado!",
                                text: "Tus archivos han sido eliminados.",
                                icon: "success"
                            });
                            this.ListarArchivos(); 
                    },
                    (error) => {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Error al eliminar",
                          });
                        console.error("Error al crear la carpeta:", error);
                    }
                );

            }
        });
    }

//----------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------

    ReemplazarArchivo(rutafolder?: any, ruta?: any) {
        Swal.fire({
            title: "Estas Seguro de reemplazar el Archivo",
            text: "Se reemplazará el archivo",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "¡Si, reemplazarlo!"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                title: "Descargado!",
                text: "Tus archivos ha sido sido descargado.",
                icon: "success"
                });
            }
        });
    }

    DescargarArchivo(rutafolder?: any, ruta?: any) {
        Swal.fire({
            title: "Estas Seguro de Descargar el Archivo",
            text: "Se descargará el archivo",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "¡Si, descargar el archivo!"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                title: "Descargado!",
                text: "Tus archivos ha sido sido descargado.",
                icon: "success"
                });
            }
        });
    }

    EliminarArchivo(rutafolder?: any, ruta?: any) {
     
        Swal.fire({
            title: "Estas Seguro de Eliminar archivo",
            text: "Se eliminará y no podras recuperarlo",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "¡Si, lo eliminaré!"
        }).then((result) => {
            if (result.isConfirmed) {

                console.log("🚀 ~ RutasArchivosComponent ~ EliminarArchivo ~ ruta:", ruta);
                console.log("🚀 ~ RutasArchivosComponent ~ EliminarArchivo ~ rutafolder:", rutafolder);

                const formData = new FormData();
                // const folderName = rutafolder ?? 'archivos';
                // const nuevaRuta = folderName.replace(/\$/g, '/');

                // formData.append('rutafolder', folderName);
                formData.append('ruta', ruta);
                this.busqueda_archivo_det.EliminarArchivo(formData).subscribe(
                    (data) => {
                            console.log("🚀 ~ RutasArchivosComponent ~ EliminarCarpeta ~ data:", data)
                            Swal.fire({
                                title: "¡Eliminado!",
                                text: "EL archivo ha sido eliminado."+ruta ,
                                icon: "success"
                            });
                            this.ListarArchivos(); 
                    },
                    (error) => {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Error al eliminar",
                          });
                        console.error("Error al crear la carpeta:", error);
                    }
                );




            
            }
        });
    }


}
