import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment, httpOptions } from '../environment/environments';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  // Servicio generico para enviar datos
  postData(url: string, data: any): Observable<any> {
    return this.http.post(environment.apiUrl + "api/" + url, data, httpOptions);
  }
}
