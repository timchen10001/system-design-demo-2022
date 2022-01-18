import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Authenticator } from '../auth/authenticator.service';

@Injectable()
export class HttpSetTokenInterceptor implements HttpInterceptor {
  constructor(private auth: Authenticator) {}

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    const token = this.auth.accessToken;

    if (!token) return next.handle(req);

    const headers = req.headers.set('Authorization', `Bearer ${token}`);

    const authReq = req.clone({ headers });

    return next.handle(authReq);
  }
}