import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        // Token inválido o vencido → limpiamos y mandamos al login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.navigate(['/login']);
      }
      // 403 lo dejamos pasar al componente que hizo la petición
      // para que pueda mostrar el mensaje específico (cuenta deshabilitada)
      return throwError(() => error);
    }),
  );
};