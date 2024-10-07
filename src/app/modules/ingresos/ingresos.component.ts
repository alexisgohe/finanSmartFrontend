import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import {
  faCreditCard,
  faMoneyBill1,
  faPenToSquare,
  faCalendarDay,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { GeneralService } from '../../service/general.service';
import { Ingreso } from '../../models/ingreso.model';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IngresoDialogComponent} from '../../dialog/ingresoDialog/ingresoDialog.component';

@Component({
  selector: 'app-ingresos',
  templateUrl: './ingresos.component.html',
  styleUrls: ['./ingresos.component.css'],
  providers: [CurrencyPipe],
})
export class IngresosComponent implements OnInit {
  constructor(
    private generalService: GeneralService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  busqueda: string = '';
  rangoVista: 'quincena' | 'mes' = 'mes';

  ingresos: Ingreso[] = [];
  ingresosEnPagina: Ingreso[] = [];
  currentPage = 1;
  pageSize = 10;

  selectedRange: { startDate: Date; endDate: Date } | undefined;
  rangoTexto: string = 'Ninguno';

  ngOnInit() {
    this.getIngresos();
  }

  getIngresos() {
    this.generalService.getData('ingresos/').subscribe({
      next: (data) => {
        this.ingresos = data.data;
        this.updateIngresosEnPagina();
      },
      error: (error) => console.error('Error:', error),
    });
  }

  // Método que se llama cuando se cambia el rango de fechas
  onDateRangeChange(event: any): void {
    const { startDate, endDate } = event;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        this.rangoTexto = `${this.formatDate(start)} - ${this.formatDate(end)}`;
        console.log(this.rangoTexto);
      } else {
        this.rangoTexto = 'Fecha inválida';
      }
    } else {
      this.rangoTexto = 'Ninguno';
    }
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  updateIngresosEnPagina() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.ingresosEnPagina = this.ingresos.slice(
      startIndex,
      startIndex + this.pageSize
    );
  }

  get ingresosFiltrados() {
    return this.ingresos.filter((ingreso) =>
      ingreso.descripcion_ingreso
        .toLowerCase()
        .includes(this.busqueda.toLowerCase())
    );
  }

  get totalIngresos(): number {
    return this.ingresos.reduce(
      (sum, ingreso) => sum + ingreso.monto_ingreso,
      0
    );
  }

  trackById(index: number, ingreso: Ingreso): number {
    return ingreso.ingreso_id;
  }

  nuevaCategoria() {
    const dialogRef = this.dialog.open(IngresoDialogComponent, {
      panelClass: 'mat-dialog-custom',
      data: {
        respuesta: '',
        accion: 'N',
        TituloAsigna: 'Agregar Nuevo Ingreso',
      },
    });
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe((result) => {
      if (result.respuesta) {
        this.getIngresos()
        this.generalService.openSnackBar(
          this.snackBar,
          'Registo insertado con exito',
          '',
          5000,
          'correcto-snackbar'
        );
      } else {
        this.generalService.openSnackBar(
          this.snackBar,
          'No se realizó la inserción del nuevo registro' + result.data,
          '',
          5000,
          'mensaje-snackbar'
        );
      }
    });
  }

  // Íconos de FontAwesome
  faCreditCard = faCreditCard;
  faMoneyBill1 = faMoneyBill1;
  faPenToSquare = faPenToSquare;
  faCalendarDay = faCalendarDay;
  faTrash = faTrash;
}
