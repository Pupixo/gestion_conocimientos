import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UsuarioEstCrudService {

  private table = new Subject<any[]>();
  private mensajeCambio = new Subject<string>();  
  urlMain: string = `${environment.apiBase}estado-usuario/`

  constructor(
    protected http: HttpClient,
  ) {}

  listar(){
    return this.http.get<any[]>(this.urlMain)
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
