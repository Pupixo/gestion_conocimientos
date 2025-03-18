import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SeccionesCrudService {

  private table = new Subject<any[]>();
  private mensajeCambio = new Subject<string>();  
  urlMain: string = `${environment.apiBase}secciones/`
  urlMainSeccRoles: string = `${environment.apiBase}secciones-roles/`

  constructor(
    protected http: HttpClient,
  ) {}

  listar(){
    return this.http.get<any[]>(this.urlMain)
  }

  listarPorIdSecciones(idpadre: any,id: any){
    return this.http.get<any>(`${this.urlMain}?id_padre=${idpadre}&tipo=${id}`);
  }

  listarPorIdSeccionesRoles(idpadre: any,id: any,rol_id:number){
    return this.http.get<any>(`${this.urlMainSeccRoles}?seccion=${idpadre}&tipo=${id}&rol_id=${rol_id}`);
  }

  registro(t: FormData){
    return this.http.post(`${this.urlMain}`, t);
  }

  registroSecRol(t: FormData){
    return this.http.post(`${this.urlMainSeccRoles}`, t);
  }

  editar(t: FormData, id: number){
    return this.http.put(`${this.urlMain}${id}/`, t);
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


    
}
