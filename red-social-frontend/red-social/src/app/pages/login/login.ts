import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
//inicio la clase
export class Login {
  //inyecto los servicios necesarios
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  //inicio las variables para el modal
  showModal = false;
  modalMessage = '';
  modalType: 'success' | 'error' = 'success';
  //inicio el formulario reactivo:
  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  openModal(message: string, type: 'success' | 'error') {
    this.modalMessage = message;
    this.modalType = type;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }
  //si form es invalido, muestra un modal de error, si no, llama al service login
  login() {
    if (this.form.invalid) {
      this.openModal('Completa los campos correctamente', 'error');
      return;
    }

    const { email, password } = this.form.value;

    this.authService.login(email, password).subscribe({
      next: (res: any) => {
        localStorage.setItem('user', JSON.stringify(res.user));
        this.openModal('Inicio de sesión exitoso 🎉', 'success');
        setTimeout(() => {
          this.closeModal();
          this.router.navigate(['/profile']);
        }, 1500);
      },
      error: (err) => {
        this.openModal(err.error?.message || 'Credenciales incorrectas', 'error');
      },
    });
  }
}