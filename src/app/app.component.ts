import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'nombre-del-proyecto';
  isSidebarOpen = true; // Estado inicial del sidebar
  showSidebarHeader = true; // Controla si se muestra o no el sidebar y header

  constructor(private router: Router) {
    // Detecta los cambios de ruta
    this.router.events.subscribe(() => {
      // Verifica si la ruta actual es "/login"
      this.showSidebarHeader = this.router.url !== '/login';
    });
  }

  // Método para alternar el sidebar
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
