// src/app/services/auth.service.ts ← ya existe, reemplazás el contenido

import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // Construye el header de autorización con el token guardado en localStorage
  // Se reutiliza en todos los endpoints que requieren estar logueado
  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // ── AUTH ──────────────────────────────────────────────────────────────────

  // Inicia sesión con email o username + password
  // Devuelve token y datos del usuario
  login(identifier: string, password: string) {
    return this.http.post(`${this.apiUrl}/auth/login`, { email: identifier, password });
  }

  // Valida el token actual contra el backend
  // Si el token es válido devuelve los datos frescos del usuario
  // Si no es válido el interceptor captura el 401 y redirige al login
  autorizar() {
    return this.http.post(`${this.apiUrl}/auth/autorizar`, {}, {
      headers: this.getHeaders(),
    });
  }

  // Solicita un token nuevo con los mismos datos y 15 minutos más de vida
  // Se llama cuando quedan 5 minutos de sesión y el usuario acepta extender
  refrescar() {
    return this.http.post(`${this.apiUrl}/auth/refrescar`, {}, {
      headers: this.getHeaders(),
    });
  }

  // ── USUARIOS ──────────────────────────────────────────────────────────────

  register(formData: FormData) {
    return this.http.post(`${this.apiUrl}/users`, formData);
  }

  getUsers() {
    return this.http.get(`${this.apiUrl}/users`, {
      headers: this.getHeaders(),
    });
  }

  updateRol(userId: string, perfil: string) {
    return this.http.patch(
      `${this.apiUrl}/users/${userId}/rol`,
      { perfil },
      { headers: this.getHeaders() },
    );
  }

  // ── POSTS ─────────────────────────────────────────────────────────────────

  getPosts(offset = 0, limit = 10, orderBy = 'fecha', autorId?: string) {
    let url = `${this.apiUrl}/posts?offset=${offset}&limit=${limit}&orderBy=${orderBy}`;
    if (autorId) url += `&autorId=${autorId}`;
    return this.http.get(url);
  }

  // Trae una publicación específica por su id
  // La usamos en la página de detalle
  getPostById(postId: string) {
    return this.http.get(`${this.apiUrl}/posts/${postId}`);
  }

  createPost(formData: FormData) {
    return this.http.post(`${this.apiUrl}/posts`, formData, {
      headers: this.getHeaders(),
    });
  }

  deletePost(postId: string) {
    return this.http.delete(`${this.apiUrl}/posts/${postId}`, {
      headers: this.getHeaders(),
    });
  }

  addLike(postId: string) {
    return this.http.post(
      `${this.apiUrl}/posts/${postId}/likes`,
      {},
      { headers: this.getHeaders() },
    );
  }

  removeLike(postId: string) {
    return this.http.delete(`${this.apiUrl}/posts/${postId}/likes`, {
      headers: this.getHeaders(),
    });
  }

  // ── COMENTARIOS ───────────────────────────────────────────────────────────

  // Trae los comentarios de una publicación paginados
  // offset y limit permiten el botón "cargar más"
  getComentarios(postId: string, offset = 0, limit = 10) {
    return this.http.get(
      `${this.apiUrl}/posts/${postId}/comentarios?offset=${offset}&limit=${limit}`,
    );
  }

  // Agrega un comentario a una publicación
  // Requiere token — el backend lo asocia al usuario logueado
  createComentario(postId: string, mensaje: string) {
    return this.http.post(
      `${this.apiUrl}/posts/${postId}/comentarios`,
      { mensaje },
      { headers: this.getHeaders() },
    );
  }

  // Edita el mensaje de un comentario propio
  // El backend verifica que el usuario sea el autor antes de editar
  updateComentario(comentarioId: string, mensaje: string) {
    return this.http.put(
      `${this.apiUrl}/comentarios/${comentarioId}`,
      { mensaje },
      { headers: this.getHeaders() },
    );
  }
}