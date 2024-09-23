import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { AuthService } from '../service/auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.authService.getToken();  // Obtén el token desde el AuthService

    // Si el usuario está autenticado (es decir, si existe un token), clonamos la solicitud
    // y añadimos el token en los headers
    if (authToken) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${authToken}`)  // Añadir el token al header
      });
      return next.handle(authReq);  // Continuar con la solicitud modificada
    }

    // Si no hay token, simplemente sigue la solicitud sin modificarla
    return next.handle(req);
  }
}
