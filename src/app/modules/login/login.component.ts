import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeneralService } from '../../service/general.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private generalService: GeneralService,
    private router: Router,
    private formbuilder: FormBuilder,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.formLogin = this.formbuilder.group({
      nombre_usuario: ["", Validators.compose([Validators.email, Validators.required, Validators.maxLength(50)])],
      password: ["", Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(50)])]
    });

    this.formRegister = this.formbuilder.group({
      nombre_usuario: [''],
      email: [''],
      password: [''],
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
          this.generalService.openSnackBar(
            this.snackBar,
            response.message,
            "",
            5000,
            "success-snackbar"
          );

          // Guarda el token en el localStorage a través del servicio AuthService
          this.authService.setToken(response.access);  // Guarda el token de acceso

          // Redirige al dashboard si el login es exitoso
          this.router.navigate(['/dashboard']);
        }
      },
      (error) => {
        const errorMessage = error.error?.message || 'Error desconocido';
        this.generalService.openSnackBar(
          this.snackBar,
          errorMessage,
          "",
          10000,
          "error-snackbar"
        );
      }
    );
  }

  formRegister!: FormGroup;
  isLogin = true; // Para controlar el estado de login/registro

  toggleLogin() {
    this.isLogin = !this.isLogin;
  }

  onRegister() {
    // Lógica de registro
  }

}
