import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './modules/login/login.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './guards/auth.interceptor';
import { SidebarComponent } from './core/sidebar/sidebar.component';
import { HeaderComponent } from './core/header/header.component';
import { CommonModule } from '@angular/common';
import { IngresosComponent } from './modules/ingresos/ingresos.component';
import { CategoriasComponent } from './modules/categorias/categorias.component';
import { AuthService } from './service/auth.service';
import { GeneralService } from './service/general.service';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { IngresoDialogComponent } from './dialog/ingresoDialog/ingresoDialog.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CategoriaDialogComponent } from './dialog/categoriaDialog/categoriaDialog.component';
import { CategoriasPipe } from './pipes/categorias.pipe';
import { fas } from '@fortawesome/free-solid-svg-icons';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    SidebarComponent,
    HeaderComponent,
    IngresosComponent,
    CategoriasComponent,
    IngresoDialogComponent,
    CategoriaDialogComponent,
    CategoriasPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    CommonModule,
    NgxDaterangepickerMd.forRoot(),
    MatDialogModule,
    MatSnackBarModule
  ],
  providers: [
    AuthService,
    GeneralService,
    provideAnimationsAsync(),
    // { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas)
  }
}
