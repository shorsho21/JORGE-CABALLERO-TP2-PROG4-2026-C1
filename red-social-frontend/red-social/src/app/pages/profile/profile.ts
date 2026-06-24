import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  user: any = null;
  ultimosPosts: any[] = [];
  loading = false;
  currentUser: any = null;

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    this.user = this.currentUser;
    this.cdr.detectChanges();
    this.loadUltimosPosts();
  }

  loadUltimosPosts() {
    this.authService.getPosts(0, 3, 'fecha', this.user._id).subscribe({
      next: (res: any) => {
        this.ultimosPosts = res;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}