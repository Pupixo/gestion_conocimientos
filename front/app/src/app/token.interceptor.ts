import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
// import { LoaderService } from './services/loader.service';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    // public loaderService: LoaderService,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('access');
    if (token){
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });

      // this.loaderService.isLoading.next(true);
    }
    return next.handle(request).pipe(
      finalize(()=> {
        // this.loaderService.isLoading.next(false);
      })
    );
  }
}
