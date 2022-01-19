import { Injectable, isDevMode } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';

import { MessageService } from '../message/message.service';
import { finalize, Observable, tap } from 'rxjs';

@Injectable()
export class HttpLogginInterceptor implements HttpInterceptor {
  constructor(private messenger: MessageService) {}

  /**
   * @ref https://angular.io/guide/http#intercepting-requests-and-responses
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const started = Date.now();
    let ok: 'success' | 'failed' | '' = '';
    let error: any = null;

    return next.handle(req)
      .pipe(
        tap(
          event => {
            if (
              event instanceof HttpResponse &&
              event.body.message &&
              event.body.name &&
              event.body.status && 
              event.body.response
            ) {
              ok = 'failed';
              error = {
                message: event.body.message,
                name: event.body.name,
                status: event.body.status,
                response: event.body.response,
              };
            } else {
              ok = 'success';
            }
          },
          error => ok = 'failed'
        ),
        finalize(() => {
          const elapsed = Date.now() - started;
          const type = ok === 'failed' ? 'error' : 'default';
          const msg = `${req.method} "${req.urlWithParams}" ${ok} in ${elapsed} ms.`;

          if (isDevMode() && type === 'default') {
            this.messenger.add(msg, 'verbose');
          }
                    
          if (type === 'error') {
            const msg2 = `status: ${error.status} message: ${error.message}`;
            this.messenger.add(msg, type);
            this.messenger.add(msg2, type);
          }
        })
      );
  }
}