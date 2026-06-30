// src/app/interceptors/auth.interceptor.ts  ← archivo nuevo

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

// Los interceptores en Angular moderno son funciones, no clases
// Esta función se ejecuta automáticamente en CADA petición HTTP que haga la app
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Inyectamos el router para poder redirigir si hay un 401
  const router = inject(Router);

  // Pasamos la petición al siguiente handler (que la ejecuta)
  // y nos "enganchamos" al resultado para capturar errores
  return next(req).pipe(
    catchError((error) => {
      // Si el servidor devuelve 401 (no autorizado / token inválido o expirado)
      // limpiamos el localStorage y mandamos al usuario al login
      if (error.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.navigate(['/login']);
      }

      // Re-lanzamos el error para que el componente que hizo la petición
      // también pueda manejarlo si quiere (ej: mostrar un mensaje de error)
      return throwError(() => error);
    }),
  );
};