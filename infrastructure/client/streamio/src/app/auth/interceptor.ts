import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './service/AuthService';

@Injectable()
export class Interceptor implements HttpInterceptor {

constructor(private authService: AuthService){}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    const accessToken: any = this.authService.getAccessToken()!;

    if (req.headers.get('skip')) return next.handle(req);

    if (accessToken) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', "Bearer " + accessToken),
      });

      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }
}

