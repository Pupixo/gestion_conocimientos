import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GenericService } from '../generic.service';

@Injectable({
  providedIn: 'root'
})
export class UsuariosCrudService extends GenericService<any>{

  titulo!: string;
  indicador!: boolean;

  constructor(
    protected override http: HttpClient,
  ) {
    super(http, `${environment.apiBase}usuarios/`);
  }
}
