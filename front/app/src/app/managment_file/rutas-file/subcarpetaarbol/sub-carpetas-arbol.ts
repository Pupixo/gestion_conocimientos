import { Component, Input, ViewChild } from '@angular/core';
import { slideDownUp } from '../../../shared/animations';
import { animate, style, transition, trigger } from '@angular/animations';
import Swal from 'sweetalert2';
import { UsuariosCrudService } from 'src/app/services/usuarios/usuarios-crud.service';
import { RutaArchivoDetalleService } from 'src/app/services/ruta_archivos/ruta-archivos-detallado.service';

@Component({
    moduleId: module.id,
    selector: 'app-sub-carpetas-arbol.',
    templateUrl: './sub-carpetas-arbol.html',
    styleUrls: ['./sub-carpetas-arbol.css'],
    animations: [ slideDownUp,
        trigger('toggleAnimation', [
            transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
            transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
        ]),
    ],
})

export class SubCarpetaArbolComponent {
    data: any = [];
    @Input() subCarpetas: string = ''
    @ViewChild(SubCarpetaArbolComponent, { static: false })
    subCarpetasArbolComponent!: SubCarpetaArbolComponent;
    treeview1: any = [];

    constructor(       
        private usuarioscrudService: UsuariosCrudService, 
        private busqueda_archivo_det: RutaArchivoDetalleService,
    ) {}


    ngOnInit() {
        let ele = document.querySelectorAll('.treeview1 button.active') || [];
        if (ele.length > 0) {
            ele.forEach((d: any) => {
                d.click();
            });
        }
        var ruta_carpeta= this.subCarpetas
        console.log("🚀 ~ SubCarpetaArbolComponent ~ ngOnInit ~ ruta_carpeta:", ruta_carpeta)
        this.ListarArchivos(ruta_carpeta);
    }


    toggleTreeview(name: string,ruta:string): void {
        this.subCarpetasArbolComponent.ListarArchivos(ruta); // Por ejemplo

            console.log("🚀 ~ SubCarpetaArbolComponent ~ toggleTreeview ~ name:", name)
            if (this.treeview1.includes(name)) {
                this.treeview1 = this.treeview1.filter((d: string) => d !== name);
            } else {
                this.treeview1.push(name);
            }

    }

    ListarArchivos(ruta_carpeta: string) {
        console.log("🚀 ~ SubCarpetaArbolComponent ~ ListarArchivos ~ ruta_carpeta:", ruta_carpeta)
        this.busqueda_archivo_det.listarArbol(ruta_carpeta).subscribe(
          (data) => {
              this.data= data;
              console.log("🚀 ~ BusquedaArchivoComponent ~ Busqueda ~ data:", data)
          },
          (error) => {              
          }
        );
    }

    tieneSubCarpetas(): boolean {
        // Verificar si subCarpetas es una cadena no vacía
        return typeof this.subCarpetas === 'string' && this.subCarpetas.trim() !== '';
    }

    CrearCarpeta(rutafolder?: any, ruta?: any) {
    console.log("🚀 ~ SubCarpetaArbolComponent ~ CrearCarpeta ~ ruta:", ruta)
    console.log("🚀 ~ SubCarpetaArbolComponent ~ CrearCarpeta ~ rutafolder:", rutafolder)

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
                    const nuevaRuta = ruta.replace(/\$/g, '/');

                    formData.append('rutafolder', nuevaRuta);
                    formData.append('newfolder', value);
    
                    this.busqueda_archivo_det.crearCarpeta(formData).subscribe(
                        (data) => {
                            console.log("🚀 ~ BusquedaArchivoComponent ~ Busqueda ~ data:", data);
                            Swal.fire(`Tu nueva carpeta es ${value}`);
                            // this.ListarArchivos();
                            var ruta_carpeta= this.subCarpetas
                            console.log("🚀 ~ SubCarpetaArbolComponent ~ ngOnInit ~ ruta_carpeta:", ruta_carpeta)
                            this.ListarArchivos(ruta_carpeta);
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


    SubirArchivo(rutafolder?: any, ruta?: any) {
        console.log("🚀 ~ SubCarpetaArbolComponent ~ SubirArchivo ~ rutafolder:", rutafolder)
        console.log("🚀 ~ SubCarpetaArbolComponent ~ SubirArchivo ~ ruta:", ruta)

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
                        const nuevaRuta = ruta.replace(/\$/g, '/');

                        formData.append('rutafolder', nuevaRuta);
                        formData.append('nom_file', file_nom);
                        formData.append('archivo', archivo_upload!);
    
                        // Llamar al servicio de subida
                        this.busqueda_archivo_det.crearArchivo(formData).subscribe(
                            (data) => {
                                console.log("Archivo subido exitosamente:", data);
                                Swal.fire('Hecho!', `Tu nuevo archivo ${file_nom} ha sido subido`, 'success');
                                // this.ListarArchivos(); // Actualizar la lista de archivos
                                var ruta_carpeta= this.subCarpetas
                                console.log("🚀 ~ SubCarpetaArbolComponent ~ ngOnInit ~ ruta_carpeta:", ruta_carpeta)
                                this.ListarArchivos(ruta_carpeta);
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
            confirmButtonText: "¡Si, lo elimine!"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                title: "¡Eliminado!",
                text: "Tus archivos han sido eliminados.",
                icon: "success"
                });
            }
        });

    }


    ReemplazarArchivo(rutafolder?: any, ruta?: any) {
        Swal.fire({
            title: "Estas Seguro de reemplazar el Archivo",
            text: "Se reemplazará el archivo",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "¡Si, lo elimine!"
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
            confirmButtonText: "¡Si, lo elimine!"
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
            title: "Estas Seguro de Eliminar Carpeta",
            text: "Todo el contenido se eliminará y no se recuperará",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "¡Si, lo elimine!"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                title: "¡Eliminado!",
                text: "Tus archivos han sido eliminados.",
                icon: "success"
                });
            }
        });
    }

}
