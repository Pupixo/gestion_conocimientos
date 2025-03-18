import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ReporteExcelService {
  private table = new Subject<any[]>();
  private mensajeCambio = new Subject<string>();  
  urlMain: string = `${environment.apiBase}reportes_excel/`

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




}
