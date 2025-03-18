import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class LineaTiempoService {
  private table = new Subject<any[]>();
  private mensajeCambio = new Subject<string>();  
  urlMain: string = `${environment.apiBase}linea_tiempo/`

  constructor(
    protected http: HttpClient,
  ) {}

 
  setValidation(data: any[]){
    this.table.next(data);
  }

  getValidation(){
    return this.table.asObservable();
  }

  setMensajeCambio(mensaje: string){
    this.mensajeCambio.next(mensaje);
  }


  // cabecera
  listarLineaTiempo(){
    return this.http.get<any>(`${this.urlMain}`);
  }
  registrarLineaTiempo(t: FormData){
    return this.http.post(`${this.urlMain}/`, t);
  }
  EditarLineaTiempo(t: FormData, id: number){
    return this.http.put(`${this.urlMain}/${id}/`, t);
  }
  EliminarLineaTiempo(id_contenido: number): Observable<any> {
    return this.http.delete<any>(`${this.urlMain}/${id_contenido}/`);
  }


}
