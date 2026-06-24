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

  login(identifier: string, password: string) {
    return this.http.post(`${this.apiUrl}/auth/login`, { email: identifier, password });
  }

  register(formData: FormData) {
    return this.http.post(`${this.apiUrl}/users`, formData);
  }

  // POSTS
  getPosts(offset = 0, limit = 10, orderBy = 'fecha', autorId?: string) {
    let url = `${this.apiUrl}/posts?offset=${offset}&limit=${limit}&orderBy=${orderBy}`;
    if (autorId) url += `&autorId=${autorId}`;
    return this.http.get(url);
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
      {
        headers: this.getHeaders(),
      },
    );
  }

  removeLike(postId: string) {
    return this.http.delete(`${this.apiUrl}/posts/${postId}/likes`, {
      headers: this.getHeaders(),
    });
  }

  // ADMIN
  getUsers() {
    return this.http.get(`${this.apiUrl}/users`, {
      headers: this.getHeaders(),
    });
  }

  updateRol(userId: string, perfil: string) {
    return this.http.patch(
      `${this.apiUrl}/users/${userId}/rol`,
      { perfil },
      {
        headers: this.getHeaders(),
      },
    );
  }
}
