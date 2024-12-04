import { HTTP_INTERCEPTORS, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from '../service/security/token.service';

import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {
  constructor(private tokenService: TokenService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.tokenService.isLoggedIn()) {
      return next.handle(req);
    }

    let intReq = req;
    const token = this.tokenService.getToken();
    console.log('Token: ' + token);

    if (token != null) {
      // Agregar un espacio después de 'Bearer'
      intReq = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + token)
      });
      console.log('Solicitud modificada con token: ', intReq);
    }

    return next.handle(intReq);
  }
}

export const interceptorProvider = [{ provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true }];
