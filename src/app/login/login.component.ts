import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { LoginService } from '../service/login.service';
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
    private loginService: LoginService,
    private formbuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.formLogin = this.formbuilder.group({
      nombre_usuario: ["", Validators.compose([Validators.email, Validators.required, Validators.maxLength(50)])],
      password: ["", Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(50)])]
    });
  }

  onLogin() {
    this.loginService.postData('login/', this.fValueH).subscribe((response) => {
      if(!response.error){
        console.log(response.message);
        this.authService.login();
        this.router.navigate(['/dashboard']);
      }
    },
    (error)=>{
      const errorMessage = error.error?.message || 'Error desconocido';
      console.log(errorMessage);
    })
  }
}
