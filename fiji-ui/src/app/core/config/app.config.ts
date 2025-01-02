import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from '../../app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClient, HttpHeaders, provideHttpClient, withInterceptors} from '@angular/common/http';
import {httpTokenInterceptor} from '../interceptors/interceptor/http-token.interceptor';
import {TokenService} from '../../services/auth/token/token.service';

export const appConfig: ApplicationConfig = {
  providers:
    [
      provideZoneChangeDetection({ eventCoalescing: true }),
      provideRouter(routes),
      provideClientHydration(),
      provideHttpClient(),
      HttpClient,
      // provideHttpClient(
      //   withInterceptors([httpTokenInterceptor])
      // ),
      /*{
        provide: HTTP_INTERCEPTORS,
        useClass: httpTokenInterceptor,
        multi: true
      }*/
      provideHttpClient(withInterceptors([httpTokenInterceptor])),
      TokenService
    ]
};
