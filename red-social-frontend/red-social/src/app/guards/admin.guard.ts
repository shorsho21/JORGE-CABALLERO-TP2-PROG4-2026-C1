import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Primero chequeamos que haya token, igual que en authGuard
  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  // Después chequeamos el rol guardado en localStorage
  // Este dato se actualiza cada vez que App.ngOnInit valida el token contra /auth/autorizar,
  // así que siempre refleja el rol más reciente que confirmó el backend
  if (user.perfil !== 'administrador') {
    // No es admin → lo mandamos a posts en lugar de login, porque sí está logueado
    router.navigate(['/posts']);
    return false;
  }

  return true;
};