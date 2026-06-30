// src/app/app.routes.ts ← reemplazás el contenido

import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Posts } from './pages/posts/posts';
import { Profile } from './pages/profile/profile';
import { Admin } from './pages/admin/admin';
import { PostDetail } from './pages/post-detail/post-detail';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { guestGuard } from './guards/guest.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Rutas públicas para invitados — bloqueadas si ya estás logueado
  { path: 'login', component: Login, canActivate: [guestGuard] },
  { path: 'register', component: Register, canActivate: [guestGuard] },

  // Rutas privadas — requieren estar logueado
  { path: 'posts', component: Posts, canActivate: [authGuard] },
  { path: 'posts/:id', component: PostDetail, canActivate: [authGuard] },
  { path: 'profile', component: Profile, canActivate: [authGuard] },

  // Ruta privada + admin — requiere estar logueado Y ser administrador
  { path: 'admin', component: Admin, canActivate: [authGuard, adminGuard] },
];