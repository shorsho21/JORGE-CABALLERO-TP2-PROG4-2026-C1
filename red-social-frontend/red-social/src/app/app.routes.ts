import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Posts } from './pages/posts/posts';
import { Profile } from './pages/profile/profile';
import { Admin } from './pages/admin/admin';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'posts', component: Posts },
  { path: 'profile', component: Profile },
  { path: 'admin', component: Admin },
];