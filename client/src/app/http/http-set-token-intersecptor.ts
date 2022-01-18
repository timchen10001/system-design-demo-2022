import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { Authenticator } from '../auth/authenticator.service';
import { TokenName } from '../auth/typings/token.interface';

@Injectable()
export class HttpSetTokenInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    const token = Authenticator.getToken(TokenName.ACCESS_TOKEN);

    if (!token) return next.handle(req);

    const headers = req.headers.set('Authorization', `Bearer ${token}`);

    const authReq = req.clone({ headers });

    return next.handle(authReq);
  }
}
