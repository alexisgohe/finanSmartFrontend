import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment, httpOptions } from '../environment/environments';
import { Observable } from "rxjs";
import { MatSnackBar } from '@angular/material/snack-bar';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  flagToken: Boolean = false;

  constructor(private http: HttpClient) { }

  getData(url: string): Observable<any> {
    return this.http.get(environment.apiUrl + "api/" + url);
  }

  postData(url: string, data: any): Observable<any> {
    return this.http.post(environment.apiUrl + "api/" + url, data, httpOptions);
  }

  putData(url: string, data: any): Observable<any> {
    return this.http.put(environment.apiUrl + "api/" + url, data, httpOptions);
  }

  deleteData(url: string): Observable<any> {
    return this.http.delete(environment.apiUrl + "api/" + url);
  }

  openSnackBar(snackBar: MatSnackBar, message: string, action: string, duracion: number, color?: string) {
    if (this.flagToken) {
      this.flagToken = false;
      return;
    }
    if (!message) message = "Error, no se pudo obtener una respuesta del servidor.";
    if (!action) action = "Cerrar";

    snackBar.open(message, action, {
      duration: duracion,
      panelClass: color ? [color] : []
    });

  }

  usuarioId() {
    try {
      const token = sessionStorage.getItem('authToken');
      if (!token) {
        return null; // O maneja el caso de que no haya token
      }
      const decodedToken: any = jwtDecode(token);  // Usa jwtDecode aquí
      return decodedToken.user_id;
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  }

}
