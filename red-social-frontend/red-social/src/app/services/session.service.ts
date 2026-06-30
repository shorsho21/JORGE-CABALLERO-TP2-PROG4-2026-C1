// src/app/services/session.service.ts ← archivo nuevo

import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Referencias a los timers para poder cancelarlos si es necesario
  // (ej: cuando el usuario cierra sesión manualmente antes de que expiren)
  private timerSesion: any = null;
  private timerAviso: any = null;

  // Función que el componente nos pasa para mostrar el modal de "¿Extender sesión?"
  // Usamos un callback en lugar de manejar el modal acá para mantener
  // la lógica de UI en el componente y la lógica de negocio en el servicio
  private mostrarModalCallback: (() => void) | null = null;

  // ── INICIAR SESIÓN ────────────────────────────────────────────────────────
  // Se llama después de un login exitoso o después de refrescar el token
  // Reinicia ambos timers desde cero
  iniciarSesion(mostrarModal: () => void) {
    // Guardamos el callback para usarlo cuando llegue el momento
    this.mostrarModalCallback = mostrarModal;

    // Cancelamos cualquier timer previo antes de crear nuevos
    // Esto es importante al refrescar — evita tener dos timers corriendo a la vez
    this.cancelarTimers();

    // Timer de aviso: se dispara a los 5 minutos (300,000 ms)
    // Quedan 5 minutos de sesión → mostramos el modal
    this.timerAviso = setTimeout(
      () => {
        if (this.mostrarModalCallback) {
          this.mostrarModalCallback();
        }
      },
      5 * 60 * 1000,
    );

    // Timer de cierre: se dispara a los 10 minutos (600,000 ms)
    // La sesión expiró → limpiamos y mandamos al login
    this.timerSesion = setTimeout(
      () => {
        this.cerrarSesion();
      },
      10 * 60 * 1000,
    );
  }

  // ── EXTENDER SESIÓN ───────────────────────────────────────────────────────
  // Se llama cuando el usuario acepta extender la sesión en el modal
  // Pide un token nuevo al backend y reinicia los timers
  extenderSesion(cerrarModal: () => void) {
    this.authService.refrescar().subscribe({
      next: (res: any) => {
        // Guardamos el token nuevo en localStorage
        localStorage.setItem('token', res.token);

        // Cerramos el modal de aviso
        cerrarModal();

        // Reiniciamos los timers con el mismo callback de modal
        if (this.mostrarModalCallback) {
          this.iniciarSesion(this.mostrarModalCallback);
        }
      },
      error: () => {
        // Si el backend devuelve 401 al refrescar, el token ya expiró
        // El interceptor va a redirigir al login automáticamente
        cerrarModal();
      },
    });
  }

  // ── CERRAR SESIÓN ─────────────────────────────────────────────────────────
  // Limpia timers, localStorage y redirige al login
  // Se puede llamar tanto desde el timer como desde el botón "Salir"
  cerrarSesion() {
    this.cancelarTimers();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  // ── HELPER PRIVADO ────────────────────────────────────────────────────────
  // Cancela ambos timers si están corriendo
  // clearTimeout con un valor null o undefined no tira error, es seguro llamarlo siempre
  private cancelarTimers() {
    if (this.timerSesion) {
      clearTimeout(this.timerSesion);
      this.timerSesion = null;
    }
    if (this.timerAviso) {
      clearTimeout(this.timerAviso);
      this.timerAviso = null;
    }
  }
  // Agregá este método en session.service.ts dentro de la clase SessionService

  // Reinicia los timers usando el callback que ya fue registrado previamente por App
  // Lo usa el Login para iniciar el timer sin necesitar acceso al modal de App
  reiniciarConCallbackActual() {
    if (this.mostrarModalCallback) {
      this.iniciarSesion(this.mostrarModalCallback);
    }
  }
}
