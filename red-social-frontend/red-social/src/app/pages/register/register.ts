import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  showModal = false;
  modalMessage = '';
  modalType: 'success' | 'error' = 'success';
  selectedFile: File | null = null;

  form: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    repeatPassword: ['', Validators.required],
    fechaNacimiento: ['', Validators.required],
    descripcion: ['', Validators.required],
    perfil: ['usuario'],
  });

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  openModal(message: string, type: 'success' | 'error') {
    this.modalMessage = message;
    this.modalType = type;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  register() {
    if (this.form.invalid) {
      this.openModal('Completa todos los campos correctamente', 'error');
      return;
    }

    if (this.form.value.password !== this.form.value.repeatPassword) {
      this.openModal('Las contraseñas no coinciden', 'error');
      return;
    }

    const formData = new FormData();
    Object.entries(this.form.value).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value as string);
      }
    });

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.authService.register(formData).subscribe({
      next: () => {
        this.openModal('Usuario creado correctamente 🎉', 'success');
        this.form.reset({ perfil: 'usuario' });
        this.selectedFile = null;
      },
      error: (err) => {
        this.openModal(err.error?.message || 'Error al registrar usuario', 'error');
      },
    });
  }
}