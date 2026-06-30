// src/app/components/navbar/navbar.ts ← archivo nuevo

import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  private router = inject(Router);
  private sessionService = inject(SessionService);

  // Usuario logueado, lo leemos del localStorage al cargar el navbar
  currentUser: any = null;

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  }

  // Devuelve true si el usuario logueado es administrador
  // Lo usamos en el template para mostrar/ocultar el link de Admin
  esAdmin(): boolean {
    return this.currentUser?.perfil === 'administrador';
  }

  // Cierra la sesión: limpia timers, localStorage, y redirige al login
  // Reutilizamos cerrarSesion() del SessionService para no duplicar lógica
  // (es la misma función que usa el timer cuando la sesión expira sola)
  salir() {
    this.sessionService.cerrarSesion();
  }
}