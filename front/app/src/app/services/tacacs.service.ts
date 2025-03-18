import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { environment } from 'src/environments/environment';
import { GenericService } from './generic.service'; 
import { Tacacs } from '../models/tacacs';

@Injectable({
  providedIn: 'root'
})
export class TacacsService extends GenericService<Tacacs> {

  constructor(
    protected override http: HttpClient,
  ) {
    super(http, `${environment.apiBase}usuarios-tacacs/`);
  }
}
