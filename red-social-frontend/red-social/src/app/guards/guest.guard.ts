import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const guestGuard: CanActivateFn = () => {
  const router = inject(Router);

  const token = localStorage.getItem('token');

  // Si NO hay token, es un invitado → puede ver login/register normalmente
  if (!token) {
    return true;
  }

  // Si hay token, ya está logueado → no tiene sentido que vea el login otra vez
  // lo mandamos directo a posts
  router.navigate(['/posts']);
  return false;
};