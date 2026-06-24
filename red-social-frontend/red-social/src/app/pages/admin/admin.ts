import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit {
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  usuarios: any[] = [];
  loading = false;
  currentUser: any = null;

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    this.loadUsuarios();
  }

  loadUsuarios() {
    this.loading = true;
    this.authService.getUsers().subscribe({
      next: (res: any) => {
        this.usuarios = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  updateRol(userId: string, perfil: string) {
    this.authService.updateRol(userId, perfil).subscribe({
      next: () => {
        this.loadUsuarios();
      }
    });
  }
}