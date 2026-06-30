// src/app/pages/login/login.ts

import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private sessionService = inject(SessionService);

  showModal = false;
  modalMessage = '';
  modalType: 'success' | 'error' = 'success';

  form: FormGroup = this.fb.group({
    identifier: ['', Validators.required],
    password: [
      '',
      [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)],
    ],
  });

  openModal(message: string, type: 'success' | 'error') {
    this.modalMessage = message;
    this.modalType = type;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  login() {
    if (this.form.invalid) {
      this.openModal('Completa los campos correctamente', 'error');
      return;
    }

    const { identifier, password } = this.form.value;

    this.authService.login(identifier, password).subscribe({
      next: (res: any) => {
        // Guardamos token y usuario en localStorage
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));

        // Iniciamos el timer de sesión usando el callback que App registró previamente
        // reiniciarConCallbackActual() reutiliza el callback del modal que ya tiene guardado
        // así no necesitamos acceder a App directamente desde acá
        this.sessionService.reiniciarConCallbackActual();

        this.openModal('Inicio de sesión exitoso 🎉', 'success');
        setTimeout(() => {
          this.closeModal();
          this.router.navigate(['/posts']);
        }, 1500);
      },
      error: (err) => {
        this.openModal(err.error?.message || 'Credenciales incorrectas', 'error');
      },
    });
  }
}