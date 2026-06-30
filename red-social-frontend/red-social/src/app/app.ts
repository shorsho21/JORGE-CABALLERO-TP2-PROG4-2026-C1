import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { SessionService } from './services/session.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef); // para forzar la deteccion de cambios

  sessionService = inject(SessionService);
  cargando = true;
  mostrarModalSesion = false;

  ngOnInit() {
    this.validarSesion();
  }

  //metodo que valida si hay un token en localstorage. Si no hay token, redirige al login
  validarSesion() {
    const token = localStorage.getItem('token');

    if (!token) {
      this.cargando = false;
      this.cdr.detectChanges();
      this.router.navigate(['/login']);
      return;
    }

    this.authService.autorizar().subscribe({
      next: (res: any) => {
        localStorage.setItem('user', JSON.stringify(res.user));
        this.cargando = false;         // primero apagamos el spinner
        this.cdr.detectChanges();      // forzamos que Angular lo refleje en el DOM
        //inicia la sesion y el contador de tiempo de la sesion.
        this.sessionService.iniciarSesion(() => {
          this.mostrarModalSesion = true;
          this.cdr.detectChanges();
        });
        //si estas en login o la raiz, redirige a posts
        const rutaActual = this.router.url;
        if (rutaActual === '/' || rutaActual === '/login') {
          this.router.navigate(['/posts']);
        }
      },
      error: (err) => {
        console.log('Error al autorizar:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.cargando = false;
        this.cdr.detectChanges();
        this.router.navigate(['/login']);
      },
    });
  }

  //metodo que extiende la sesion y cierra el modal
  extenderSesion() {
    this.sessionService.extenderSesion(() => {
      this.mostrarModalSesion = false;
      this.cdr.detectChanges();
    });
  }

  rechazarExtension() {
    this.mostrarModalSesion = false;
    this.sessionService.cerrarSesion();
  }

  registrarCallbackModal() {
    this.sessionService.iniciarSesion(() => {
      this.mostrarModalSesion = true;
      this.cdr.detectChanges();
    });
  }
}