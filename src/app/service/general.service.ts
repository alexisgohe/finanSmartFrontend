import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment, httpOptions } from '../environment/environments';
import { Observable } from "rxjs";
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  flagToken: Boolean = false;

  constructor(private http: HttpClient) { }

  postData(url: string, data: any): Observable<any> {
    return this.http.post(environment.apiUrl + "api/" + url, data, httpOptions);
  }

  getData(url: string): Observable<any> {
    return this.http.get(environment.apiUrl + "api/" + url);
  }

  openSnackBar(snackBar: MatSnackBar, message: string, action: string, duracion: number, color?: string) {
    // Enoc 21/06/19: Funcion para desplegar alerta de tipo SnackBar.
    // Recibe Instancia de MatSnackBar, mensaje a desplegar, tipo de accion (Ok, Cancel, etc.) y tiempo de duracion en milisegundos
    if (this.flagToken) { //Bandera para no mostrar otro mensaje si finaliza la sesion.
      this.flagToken = false;
      return;
    }
    if (message == null || message == "") message = "Error, no se pudo obtener una respuesta del servidor.";
    if (action == null || action == '') action = "Cerrar";
    if (color) {
      snackBar.open(message, action, {
        duration: duracion, panelClass: [color]
      });
    } else {
      snackBar.open(message, action, {
        duration: duracion
      });
    }
  }
}
