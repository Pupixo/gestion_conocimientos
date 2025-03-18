import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GenericService } from '../generic.service';
import { UsuariosCrud } from 'src/app/models/usuarios/usuarios-crud';

@Injectable({
  providedIn: 'root'
})
export class UsuariosCrudPasswordService extends GenericService<UsuariosCrud> {

  titulo!: string; 
  indicador!: boolean;

  constructor(
    protected override http: HttpClient,
  ) {
    super(http, `${environment.apiBase}usuarios-password/`);
  }
}
