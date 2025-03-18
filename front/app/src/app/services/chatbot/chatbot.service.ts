import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ChatbotService {
  private table = new Subject<any[]>();
  private mensajeCambio = new Subject<string>();  
  urlMain: string = `${environment.apiBase}chatbot/`

  constructor(
    protected http: HttpClient,
  ) {}


  // enviar mensaje de usuario
  enviarMensajeUsuario(t: FormData): Observable<any> {
    return this.http.post<any>(`${this.urlMain}mensaje_usu/`, t);
  }



}
