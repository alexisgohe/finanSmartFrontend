import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { IngresosComponent } from './modules/ingresos/ingresos.component';
import { GastosComponent } from './modules/gastos/gastos.component';
import { CategoriasComponent } from './modules/categorias/categorias.component';
import { TransferenciasComponent } from './modules/transferencias/transferencias.component';
import { TarjetaCreditoComponent } from './modules/tarjetaCredito/tarjetaCredito.component';
import { TarjetaDebitoComponent } from './modules/tarjetaDebito/tarjetaDebito.component';
import { MsiComponent } from './modules/msi/msi.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'ingresos', component: IngresosComponent, canActivate: [AuthGuard] },
  { path: 'gastos', component: GastosComponent, canActivate: [AuthGuard] },
  { path: 'categorias', component: CategoriasComponent, canActivate: [AuthGuard] },
  { path: 'transacciones', component: TransferenciasComponent, canActivate: [AuthGuard] },
  { path: 'debito', component: TarjetaDebitoComponent, canActivate: [AuthGuard] },
  { path: 'credito', component: TarjetaCreditoComponent, canActivate: [AuthGuard] },
  { path: 'msi', component: MsiComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' } // Redirigir al login por defecto
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
