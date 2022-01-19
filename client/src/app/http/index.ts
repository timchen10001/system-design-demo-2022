/* "Barrel" of Http Interceptors */
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Provider } from '@angular/core';
import { HttpLogginInterceptor } from './http-loggin-interceptor';
import { HttpSetTokenInterceptor } from './http-set-token-intersecptor';


/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders: Provider[] = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpSetTokenInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpLogginInterceptor,
    multi: true,
  },
];