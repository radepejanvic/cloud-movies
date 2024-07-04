import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class Interceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    const accessToken: any = getLocalStorageItemByKeySubstring('.accessToken');
    console.log(accessToken + " : " + req.method)

    if (req.method === 'OPTIONS' || req.headers.get('skip')) return next.handle(req);

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

function getLocalStorageItemByKeySubstring(substring: string) {
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        if (key != null && key.includes(substring)) {
            return localStorage.getItem(key);
        }
    }
    return null; 
}