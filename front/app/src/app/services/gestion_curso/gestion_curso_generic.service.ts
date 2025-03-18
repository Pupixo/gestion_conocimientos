import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { GenericService } from '../generic.service';

@Injectable({
  providedIn: 'root',
})
export class GestionCursoGenericService extends GenericService<any> {
  private data: any[] = [];
  invocarFuncionPadre = new EventEmitter<{ accion: string; valor: any }>();

  titulo!: string;
  indicador!: boolean;

  constructor(protected override http: HttpClient) {
    super(http, `${environment.apiBase}gestion_curso/`);
  }

  setData(newData: any[]) {
    this.data = newData;
  }

  getData(): any[] {
    return this.data;
  }

  llamarFuncionPadre(accion: string, valor: any) {
    this.invocarFuncionPadre.emit({ accion, valor });
  }
}