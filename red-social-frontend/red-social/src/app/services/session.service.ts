import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private authService = inject(AuthService);
  private router = inject(Router);

  private timerSesion: any = null;
  private timerAviso: any = null;
  private timerKeepAlive: any = null; // 👈 nuevo

  private mostrarModalCallback: (() => void) | null = null;

  iniciarSesion(mostrarModal: () => void) {
    this.mostrarModalCallback = mostrarModal;
    this.cancelarTimers();

    // Timer de aviso: se dispara a los 5 minutos (antes eran 5 sobre 10)
    // Quedan 3 minutos de sesión → mostramos el modal
    this.timerAviso = setTimeout(() => {
      if (this.mostrarModalCallback) {
        this.mostrarModalCallback();
      }
    }, 5 * 60 * 1000);

    // Timer de cierre: se dispara a los 8 minutos
    // Dejamos margen de 3 minutos para que el usuario pueda refrescar
    this.timerSesion = setTimeout(() => {
      this.cerrarSesion();
    }, 8 * 60 * 1000);

    // Keep-alive: llama a autorizar cada 3 minutos para mantener
    // el backend de Render despierto antes de que llegue el momento del refresh
    this.timerKeepAlive = setInterval(() => {
      this.authService.autorizar().subscribe({ error: () => {} });
    }, 3 * 60 * 1000);
  }

  extenderSesion(cerrarModal: () => void) {
    this.authService.refrescar().subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        cerrarModal();

        if (this.mostrarModalCallback) {
          this.iniciarSesion(this.mostrarModalCallback);
        }
      },
      error: () => {
        cerrarModal();
      },
    });
  }

  cerrarSesion() {
    this.cancelarTimers();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  reiniciarConCallbackActual() {
    if (this.mostrarModalCallback) {
      this.iniciarSesion(this.mostrarModalCallback);
    }
  }

  private cancelarTimers() {
    if (this.timerSesion) {
      clearTimeout(this.timerSesion);
      this.timerSesion = null;
    }
    if (this.timerAviso) {
      clearTimeout(this.timerAviso);
      this.timerAviso = null;
    }
    // 👈 cancelamos el keep-alive también
    if (this.timerKeepAlive) {
      clearInterval(this.timerKeepAlive);
      this.timerKeepAlive = null;
    }
  }
}