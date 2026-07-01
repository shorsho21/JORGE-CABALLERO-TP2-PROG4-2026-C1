import { Component, inject, ChangeDetectorRef } from '@angular/core';
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
  private cdr = inject(ChangeDetectorRef); // 👈 agregado

  showModal = false;
  modalMessage = '';
  modalType: 'success' | 'error' = 'success';
  loading = false;

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
    this.cdr.detectChanges(); // 👈 forzamos que Angular actualice la vista
  }

  closeModal() {
    this.showModal = false;
    this.cdr.detectChanges(); // 👈 ídem al cerrar
  }

  login() {
    if (this.form.invalid) {
      this.openModal('Completa los campos correctamente', 'error');
      return;
    }

    this.loading = true;
    this.cdr.detectChanges(); // 👈 forzamos que el spinner aparezca inmediatamente

    const { identifier, password } = this.form.value;

    this.authService.login(identifier, password).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.sessionService.reiniciarConCallbackActual();

        this.loading = false;
        this.openModal('Inicio de sesión exitoso 🎉', 'success');
        setTimeout(() => {
          this.closeModal();
          this.router.navigate(['/posts']);
        }, 1500);
      },
      error: (err) => {
        this.loading = false;

        if (err.status === 403) {
          this.openModal(err.error?.message || 'Tu cuenta está deshabilitada.', 'error');
          return;
        }

        this.openModal(err.error?.message || 'Credenciales incorrectas', 'error');
      },
    });
  }
}