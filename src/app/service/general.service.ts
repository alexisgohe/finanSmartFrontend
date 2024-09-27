import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment, httpOptions } from '../environment/environments';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

constructor(private http: HttpClient) { }

  postData(url: string, data: any): Observable<any> {
    return this.http.post(environment.apiUrl + "api/" + url, data, httpOptions);
  }

  getData(url: string): Observable<any> {
    return this.http.get(environment.apiUrl + "api/" + url);
  }
}
