import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenericService<T> {

  private crudCambio = new Subject<T[]>();
  private mensajeCambio = new Subject<string>();

  constructor(
    protected http: HttpClient,
    @Inject(String) protected url: string
  ) { }

  listar(){
    return this.http.get<T[]>(this.url);
  }

  listarPorId(id: number){
    return this.http.get<T>(`${this.url}${id}/`);
  }

  listarPorIdDataCursoUsuario(id: number,usu:number){
    return this.http.get<T>(`${this.url}_id/${id}/${usu}/`);
  }


  registrar(t: FormData){
    return this.http.post(this.url, t);
  }

  registrarIndividual(t: FormData){
    return this.http.post( `${this.url}registro-individual/`, t);
  }

  editarIndividual(t: FormData, id: number){
    return this.http.put( `${this.url}editar-individual/${id}/`, t);
  }

  eliminarIndividual(id: number){
    return this.http.delete( `${this.url}eliminar-individual/${id}/`);
  }

  modificar(t: FormData, id: number){
    return this.http.put(`${this.url}${id}/`, t);
  }

  eliminar(id: number){
    return this.http.delete(`${this.url}${id}/`);
  }

  CurrentUser(t: FormData){
    return this.http.post(`${this.url}usuario-data/`, t);
  }

  setCrudCambio(lista: T[]){
    this.crudCambio.next(lista);
  }

  getCrudCambio(){
    return this.crudCambio.asObservable();
  }

  setMensajeCambio(mensaje: string){
    this.mensajeCambio.next(mensaje);
  }

  getMensajeCambio(){
    return this.mensajeCambio.asObservable();
  }

  RegistrarfotoPerfil(t: FormData){
    return this.http.post( `${this.url}registro-individual-foto/`, t);
  }


  RegistrarDatosUsuario(t: FormData){
    return this.http.post( `${this.url}registro-individual-datos/`, t);
  }


}
