import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TicketsDetalleCrudService {

  private table = new Subject<any[]>();
  private mensajeCambio = new Subject<string>();  
  urlMain: string = `${environment.apiBase}tickets/detalle/`

  constructor(
    protected http: HttpClient,
  ) {}

  listar(){
    return this.http.get<any[]>(this.urlMain)
  }

  listarPorId(id: number){
    return this.http.get<any>(`${this.urlMain}${id}/`);
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

  listarPorIdTicketSeguiDetalle(id: number){
    return this.http.get<any[]>( `${this.urlMain}listar-id/seguimiento/?id=${id}`)
  }

  RegistrarDetalleTicket(t: FormData){
    return this.http.post(`${this.urlMain}insertar-detalle/`, t);
  }

  EditarDetalleComentario(t: FormData, id: number){
    return this.http.put(`${this.urlMain}editar-detalle/${id}/`, t);
  }

  RegistrarMotivoCambioSeguim(t: FormData){
    return this.http.post(`${this.urlMain}cambio-seguim-detalle/`, t);
  }

  GetMotivoCambioSeguimByidSeguimineto(id: number){
    return this.http.get<any[]>( `${this.urlMain}cambio-seguim-detalle/${id}/`)
  }

  // listarPorId(id: number){
  //   return this.http.get<any>(`${this.urlMain}${id}/`);
  // }
  
  
}
