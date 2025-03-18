import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,Subject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Auth } from '../models/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl: string = environment.apiToken;

  indicador!: boolean;

  constructor(
    
    private http: HttpClient,

    ) { }

  login(username: string, password:string): Observable<string>{
    const body = {username, password};
    return this.http.post<Auth>(this.apiUrl, body).pipe(
      map((response) => response.access),
      tap((access) => {
        console.log("dentro del tap, despues del map")
        localStorage.setItem('access', access);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('access');

  }

  getToken(): string {
    return localStorage.getItem('access') ?? '';
  }

  isLoggedIn(): boolean{
    const token = this.getToken();
    return !!token;
  }

  


}
