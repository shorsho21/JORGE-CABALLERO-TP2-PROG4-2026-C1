import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
//inicio la clase
export class AuthService {
  //inyecto los servicios
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  //inicio los metodos para login y register. Realizan peticiones http al backend y devuelven un observable
  login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/auth/login`, { email, password });
  }

  register(formData: FormData) {
    return this.http.post(`${this.apiUrl}/users`, formData);
  }
}