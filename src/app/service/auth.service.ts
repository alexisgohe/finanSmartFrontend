import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment, httpOptions } from '../environment/environments';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'authToken';

  constructor(private http: HttpClient) { }

  login(loginData: { nombre_usuario: string, password: string }) {
    return this.http.post<any>(environment.apiUrl + "api/login/", loginData, httpOptions);
  }

  // Método para guardar el token en sessionStorage
  setToken(token: string): void {
    sessionStorage.setItem(this.tokenKey, token);  // Guarda el token en sessionStorage
  }

  // Método para obtener el token
  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);  // Obtén el token desde sessionStorage
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return this.getToken() !== null;  // Comprueba si existe un token en sessionStorage
  }

  // Método para cerrar sesión
  logout(): void {
    sessionStorage.removeItem(this.tokenKey);  // Elimina el token de sessionStorage
  }
}
