import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { faCreditCard, faMoneyBill1, faEye, faCalendarDay } from '@fortawesome/free-solid-svg-icons';

interface Ingreso {
  id: string;
  monto: number;
  fecha: string;
  descripcion: string;
  categoria: string;
  metodoPago: 'efectivo' | 'tarjeta';
}

@Component({
  selector: 'app-ingresos',
  templateUrl: './ingresos.component.html',
  styleUrls: ['./ingresos.component.css'],
  providers: [CurrencyPipe]
})
export class IngresosComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  busqueda: string = '';
  paginaActual: number = 1;
  ingresosPorPagina: number = 5;
  rangoVista: 'quincena' | 'mes' = 'mes';

  ingresos: Ingreso[] = [
    { id: 'ING001', monto: 1000, fecha: '2023-06-01', descripcion: 'Salario mensual', categoria: 'Salario', metodoPago: 'tarjeta' },
    { id: 'ING002', monto: 200, fecha: '2023-06-05', descripcion: 'Venta de artículos usados', categoria: 'Ventas', metodoPago: 'efectivo' },
    { id: 'ING003', monto: 50, fecha: '2023-06-10', descripcion: 'Reembolso de gastos', categoria: 'Reembolsos', metodoPago: 'tarjeta' }
  ];

  getRangoTexto(): string {
    return this.rangoVista === 'quincena' ? 'Quincenal' : 'Mensual';
  }

  get ingresosFiltrados(): Ingreso[] {
    return this.ingresos.filter(ingreso =>
      ingreso.descripcion.toLowerCase().includes(this.busqueda.toLowerCase()) ||
      ingreso.categoria.toLowerCase().includes(this.busqueda.toLowerCase()) ||
      ingreso.id.toLowerCase().includes(this.busqueda.toLowerCase())
    );
  }

  get totalPaginas(): number {
    return Math.ceil(this.ingresosFiltrados.length / this.ingresosPorPagina);
  }

  get ingresosEnPagina(): Ingreso[] {
    const start = (this.paginaActual - 1) * this.ingresosPorPagina;
    return this.ingresosFiltrados.slice(start, start + this.ingresosPorPagina);
  }

  get totalIngresos(): number {
    return this.ingresos.reduce((sum, ingreso) => sum + ingreso.monto, 0);
  }

  handleAgregarIngreso() {
    console.log('Agregar nuevo ingreso');
    // Aquí iría la lógica para agregar un nuevo ingreso
  }

  handleVerDetalle(id: string) {
    console.log(`Ver detalle del ingreso ${id}`);
    // Aquí iría la lógica para ver el detalle del ingreso
  }

  cambiarPaginaAnterior() {
    if (this.paginaActual > 1) {
      this.paginaActual--;
    }
  }

  cambiarPaginaSiguiente() {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
    }
  }

  trackById(index: number, ingreso: Ingreso): string {
    return ingreso.id;
  }

  get deshabilitarAnterior(): boolean {
    return this.paginaActual === 1;
  }

  get deshabilitarSiguiente(): boolean {
    return this.paginaActual === this.totalPaginas;
  }

  // Íconos de FontAwesome
  faCreditCard = faCreditCard;
  faMoneyBill1 = faMoneyBill1;
  faEye = faEye;
  faCalendarDay = faCalendarDay;
}
