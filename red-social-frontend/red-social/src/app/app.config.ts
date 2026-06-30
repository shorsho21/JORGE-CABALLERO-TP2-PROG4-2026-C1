// src/app/app.config.ts ← ya existe, reemplazás el contenido

import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // 👈 agregamos withInterceptors
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor'; // 👈 importamos el interceptor

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // withInterceptors registra el interceptor para que se aplique a todas las peticiones HTTP
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};