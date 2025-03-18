import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  invocarFuncionPadre = new EventEmitter<{accion: string, valor: any}>();

  private dataSubject = new BehaviorSubject<any[]>([]);
  data$ = this.dataSubject.asObservable();

  constructor() { }

  setData(data: any[]) {
    this.dataSubject.next(data);
  }

  llamarFuncionPadre(accion: string, valor: any) {
    this.invocarFuncionPadre.emit({accion, valor});
  }
}