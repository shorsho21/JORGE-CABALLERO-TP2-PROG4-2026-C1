import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // ── AUTH ──────────────────────────────────────────────────────────────────

  login(identifier: string, password: string) {
    return this.http.post(`${this.apiUrl}/auth/login`, {
      email: identifier,
      password,
    });
  }

  autorizar() {
    return this.http.post(
      `${this.apiUrl}/auth/autorizar`,
      {},
      { headers: this.getHeaders() },
    );
  }

  refrescar() {
    return this.http.post(
      `${this.apiUrl}/auth/refrescar`,
      {},
      { headers: this.getHeaders() },
    );
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

  // Crea un usuario desde el dashboard de admin
  // Mismo endpoint que register pero con perfil elegible (usuario/administrador)
  createUser(formData: FormData) {
    return this.http.post(`${this.apiUrl}/users`, formData, );
  }

  updateRol(userId: string, perfil: string) {
    return this.http.patch(
      `${this.apiUrl}/users/${userId}/rol`,
      { perfil },
      { headers: this.getHeaders() },
    );
  }

  // Baja lógica — el usuario queda en la DB pero no puede ingresar
  deshabilitarUsuario(userId: string) {
    return this.http.delete(`${this.apiUrl}/users/${userId}`, {
      headers: this.getHeaders(),
    });
  }

  // Alta lógica — rehabilita un usuario previamente deshabilitado
  rehabilitarUsuario(userId: string) {
    return this.http.post(
      `${this.apiUrl}/users/${userId}/rehabilitar`,
      {},
      { headers: this.getHeaders() },
    );
  }

  // ── POSTS ─────────────────────────────────────────────────────────────────

  getPosts(offset = 0, limit = 10, orderBy = 'fecha', autorId?: string) {
    let url = `${this.apiUrl}/posts?offset=${offset}&limit=${limit}&orderBy=${orderBy}`;
    if (autorId) url += `&autorId=${autorId}`;
    return this.http.get(url);
  }

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

  getComentarios(postId: string, offset = 0, limit = 10) {
    return this.http.get(
      `${this.apiUrl}/posts/${postId}/comentarios?offset=${offset}&limit=${limit}`,
    );
  }

  createComentario(postId: string, mensaje: string) {
    return this.http.post(
      `${this.apiUrl}/posts/${postId}/comentarios`,
      { mensaje },
      { headers: this.getHeaders() },
    );
  }

  updateComentario(comentarioId: string, mensaje: string) {
    return this.http.put(
      `${this.apiUrl}/comentarios/${comentarioId}`,
      { mensaje },
      { headers: this.getHeaders() },
    );
  }

  // ── ESTADÍSTICAS ──────────────────────────────────────────────────────────
  // Todos los endpoints de stats requieren token de admin
  // El backend lo verifica con JwtAuthGuard + RolesGuard

  getPublicacionesPorUsuario(desde: string, hasta: string) {
    return this.http.get(
      `${this.apiUrl}/stats/publicaciones-por-usuario?desde=${desde}&hasta=${hasta}`,
      { headers: this.getHeaders() },
    );
  }

  getComentariosPorTiempo(desde: string, hasta: string) {
    return this.http.get(
      `${this.apiUrl}/stats/comentarios-por-tiempo?desde=${desde}&hasta=${hasta}`,
      { headers: this.getHeaders() },
    );
  }

  getComentariosPorPublicacion(desde: string, hasta: string) {
    return this.http.get(
      `${this.apiUrl}/stats/comentarios-por-publicacion?desde=${desde}&hasta=${hasta}`,
      { headers: this.getHeaders() },
    );
  }
}