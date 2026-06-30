import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

// Los guards modernos en Angular son funciones, igual que los interceptores
export const authGuard: CanActivateFn = () => {
  const router = inject(Router);

  const token = localStorage.getItem('token');

  // Si hay token, dejamos pasar
  // No validamos contra el backend acá porque sería una llamada extra en cada cambio de ruta
  // Si el token está vencido, el interceptor lo va a detectar en la primera petición que falle
  if (token) {
    return true;
  }

  // Sin token, no dejamos pasar y redirigimos al login
  router.navigate(['/login']);
  return false;
};