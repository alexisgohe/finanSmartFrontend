import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {

  formLogin!: FormGroup;

  get fControlH() {
    return this.formLogin.controls;
  }

  get fValueH() {
    return this.formLogin.value;
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    private formbuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.formLogin = this.formbuilder.group({
      nombre_usuario: ["", Validators.compose([Validators.email, Validators.required, Validators.maxLength(50)])],
      password: ["", Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(50)])]
    });
  }

  onLogin() {
    const loginData = {
      nombre_usuario: this.formLogin.value.nombre_usuario,
      password: this.formLogin.value.password
    };

    // Llamada al servicio de autenticación para hacer login
    this.authService.login(loginData).subscribe(
      (response) => {
        if (!response.error) {
          console.log(response.message);

          // Guarda el token en el localStorage a través del servicio AuthService
          this.authService.setToken(response.access);  // Guarda el token de acceso

          // Redirige al dashboard si el login es exitoso
          this.router.navigate(['/dashboard']);
        }
      },
      (error) => {
        const errorMessage = error.error?.message || 'Error desconocido';
        console.log(errorMessage);
      }
    );
  }


}
