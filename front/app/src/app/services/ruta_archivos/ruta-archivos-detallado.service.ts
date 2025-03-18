import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RutaArchivoDetalleService {
  private table = new Subject<any[]>();
  private mensajeCambio = new Subject<string>();  
  urlMain: string = `${environment.apiBase}ruta-archivo/`

  constructor(
    protected http: HttpClient,
  ) {}

  converttopdf(t: FormData) {
    return this.http.post<any>(`${this.urlMain}search/`, t);
  }

  searchFiles(query: any) {
    return this.http.get<any[]>(`${this.urlMain}search/${query}/`);
  }

  listar(){
    return this.http.get<any[]>(this.urlMain)
  }

  listarArbol(id: string){
    return this.http.get<any[]>( `${this.urlMain}${id}/`)
  }

  crearCarpeta(t: FormData) {
      return this.http.post(`${this.urlMain}crear_carpeta`, t);
  }

  crearArchivo(t: FormData){
    return this.http.post(`${this.urlMain}crear_archivo`, t);
  }

  EliminarArchivo(t: FormData){
    return this.http.post(`${this.urlMain}eliminar_archivo`, t);
  }

  listarPorId(id: number){
    return this.http.get<any>(`${this.urlMain}${id}/`);
  }
 
  listarEst(){
    return this.http.get<any[]>(this.urlMain)
  }

  setValidation(data: any[]){
    this.table.next(data);
  }

  getValidation(){
    return this.table.asObservable();
  }

  setMensajeCambio(mensaje: string){
    this.mensajeCambio.next(mensaje);
  }

  listarPorIdTicketDetalle(id: number){
    return this.http.get<any[]>( `${this.urlMain}listar-id/?id=${id}`)
  }

  RegistrarDetalleTicket(t: FormData){
    return this.http.post(`${this.urlMain}insertar-detalle/`, t);
  }

  listarRol(){
    return this.http.get<any[]>(this.urlMain)
  }



}
