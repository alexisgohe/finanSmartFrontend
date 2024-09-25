import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { faCreditCard, faMoneyBill1, faEye, faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import { GeneralService } from '../../service/general.service';
import { Ingreso } from '../../models/ingreso.model';

@Component({
  selector: 'app-ingresos',
  templateUrl: './ingresos.component.html',
  styleUrls: ['./ingresos.component.css'],
  providers: [CurrencyPipe]
})
export class IngresosComponent implements OnInit {

  constructor(private generalService: GeneralService) { }

  busqueda: string = '';
  paginaActual: number = 1;
  ingresosPorPagina: number = 5;
  rangoVista: 'quincena' | 'mes' = 'mes';

  ingresos: Ingreso[] = [];
  ingresosEnPagina: Ingreso[] = [];
  currentPage = 1;
  pageSize = 10;

  ngOnInit() {
    this.getIngresos();
  }

  getIngresos() {
    this.generalService.getData('ingresos/').subscribe({
      next: (data) => {
        this.ingresos = data.data
        this.updateIngresosEnPagina();
      },
      error: (error) => console.error('Error:', error)
    });
  }

  // Íconos de FontAwesome
  faCreditCard = faCreditCard;
  faMoneyBill1 = faMoneyBill1;
  faEye = faEye;
  faCalendarDay = faCalendarDay;





  updateIngresosEnPagina() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.ingresosEnPagina = this.ingresos.slice(startIndex, startIndex + this.pageSize);
  }

  getRangoTexto(): string {
    return this.rangoVista === 'quincena' ? 'Quincenal' : 'Mensual';
  }

  get ingresosFiltrados() {
    return this.ingresos.filter(ingreso =>
      ingreso.descripcion_ingreso.toLowerCase().includes(this.busqueda.toLowerCase())
      // ingreso.categoria.toLowerCase().includes(this.busqueda.toLowerCase())
      // ingreso.ingreso_id.includes(this.busqueda.toLowerCase())
    );
  }

  get totalPaginas(): number {
    return Math.ceil(this.ingresosFiltrados.length / this.ingresosPorPagina);
  }

  // get ingresosEnPagina(): Ingreso[] {
  //   const start = (this.paginaActual - 1) * this.ingresosPorPagina;
  //   return this.ingresosFiltrados.slice(start, start + this.ingresosPorPagina);
  // }

  get totalIngresos(): number {
    return this.ingresos.reduce((sum, ingreso) => sum + ingreso.monto_ingreso, 0);
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

  trackById(index: number, ingreso: Ingreso): number {
    return ingreso.ingreso_id;
  }

  get deshabilitarAnterior(): boolean {
    return this.paginaActual === 1;
  }

  get deshabilitarSiguiente(): boolean {
    return this.paginaActual === this.totalPaginas;
  }

}
