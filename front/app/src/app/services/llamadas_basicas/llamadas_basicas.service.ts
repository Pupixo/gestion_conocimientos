import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class LLamadasBasicasService {
  urlMain: string = `${environment.apiBase}`

  constructor(
    protected http: HttpClient,
  ) {}

  lista_paises(): Observable<any> {
    return this.http.get<any>(`${this.urlMain}paises/`);
  }

  lista_departamentos(type: string,id:number): Observable<any> {
    return this.http.get<any>(`${this.urlMain}departamentos/${type}/${id}/`);
  }

  lista_provincias(type: string,id:number): Observable<any> {
    return this.http.get<any>(`${this.urlMain}provincias/${type}/${id}/`);
  }

  lista_distrito(type: string,id:number): Observable<any> {
    return this.http.get<any>(`${this.urlMain}distritos/${type}/${id}/`);
  }

  lista_nocgrupos(): Observable<any> {
    return this.http.get<any>(`${this.urlMain}nocsgrupos/`);
  }
}