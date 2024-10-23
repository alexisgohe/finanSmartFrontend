import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { BooleanPipe } from '../../pipes/boolean.pipe';
import {
  faCreditCard,
  faMoneyBill1,
  faPenToSquare,
  faCalendarDay,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { Gasto } from '../../models/gastos.model';
import { GeneralService } from '../../service/general.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GastoDialogComponent } from '../../dialog/gastoDialog/gastoDialog.component';

@Component({
  selector: 'app-gastos',
  templateUrl: './gastos.component.html',
  styleUrls: ['./gastos.component.css'],
  providers: [CurrencyPipe, BooleanPipe],
})
export class GastosComponent implements OnInit {

  busqueda: string = '';

  gastos: Gasto[] = [];
  gastosPaginadas: Gasto[] = [];
  paginadorRows: number = 5;
  currentPage = 0;

  selectedRange: any[] = [];
  rangoTexto: string = 'Ninguno';

  // Íconos de FontAwesome
  faCreditCard = faCreditCard;
  faMoneyBill1 = faMoneyBill1;
  faPenToSquare = faPenToSquare;
  faCalendarDay = faCalendarDay;
  faTrash = faTrash;

  constructor(
    private generalService: GeneralService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    const storedRange = localStorage.getItem('selectedRange');
    if (storedRange) {
      this.selectedRange = JSON.parse(storedRange).map((dateString: string) => new Date(dateString));
    }

    this.getGasto();
  }

  getGasto() {
    this.generalService.getData('gastos/').subscribe({
      next: (data) => {
        this.gastos = data.data;
        this.aplicarFiltrosYPaginacion();
      },
      error: (error) => console.error('Error:', error),
    });
  }

  onDateRangeChange(event: any): void {
    // Verifica si 'event' es un arreglo y su longitud es 2
    if (this.selectedRange.length === 2) {

      // Guardar en localStorage
      localStorage.setItem('selectedRange', JSON.stringify(this.selectedRange));
    }
    // Aplica los filtros para actualizar la tabla
    this.aplicarFiltrosYPaginacion();
  }

  formatDate(date: Date): string {
    if (!date) {
      return ''; // O manejarlo como consideres apropiado
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  get totalGastos(): number {
    return this.gastos.reduce(
      (sum, gasto) => sum + gasto.monto_gasto,
      0
    );
  }

  nuevoGasto() {
    const dialogRef = this.dialog.open(GastoDialogComponent, {
      panelClass: 'mat-dialog-custom',
      data: {
        respuesta: '',
        accion: 'N',
        TituloAsigna: 'Agregar Nuevo Gasto',
      },
    });
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe((result) => {
      if (result.respuesta) {
        this.getGasto();
        this.generalService.openSnackBar(
          this.snackBar,
          'Registro insertado con éxito',
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

  editarGasto(gasto: any){
    const dialogRef = this.dialog.open(GastoDialogComponent, {
      panelClass: 'mat-dialog-custom',
      data: {
        respuesta: '',
        accion: 'E',
        TituloAsigna: 'Editar Gasto',
        data: gasto,
      },
    });
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe((result) => {
      if (result.respuesta) {
        this.getGasto();
        this.generalService.openSnackBar(
          this.snackBar,
          'Registro editado con éxito',
          '',
          5000,
          'correcto-snackbar'
        );
      } else {
        this.generalService.openSnackBar(
          this.snackBar,
          'No se realizó la edición del registro' + result.data,
          '',
          5000,
          'mensaje-snackbar'
        );
      }
    });
  }

  eliminarGasto(gasto_id: number){
    this.generalService.deleteData(`gastos/${gasto_id}/`).subscribe({
      next: (response) => {
        this.getGasto()
        this.generalService.openSnackBar(
          this.snackBar,
          response.mensaje,
          '',
          5000,
          'success-snackbar'
        );
      },
      error: (error) => {
        this.generalService.openSnackBar(
          this.snackBar,
          error.mensaje,
          '',
          5000,
          'error-snackbar'
        );
      }
    });
  }

  get gastosFiltrados() {
    return this.gastos.filter((gasto) => {
      const cumpleBusqueda = gasto.descripcion_gasto
        .toLowerCase()
        .includes(this.busqueda.toLowerCase());

      const cumpleRangoFecha = this.selectedRange &&
        Array.isArray(this.selectedRange) &&
        this.selectedRange.length === 2 &&
        gasto.fecha_gasto >= this.formatDate(this.selectedRange[0]) &&
        gasto.fecha_gasto <= this.formatDate(this.selectedRange[1]);

      // Devolverá true si hay búsqueda y cumple con el rango de fechas o si el rango es indefinido o null
      return cumpleBusqueda && (!this.selectedRange || this.selectedRange.length < 2 || cumpleRangoFecha);
    });
  }

  aplicarFiltrosYPaginacion() {
    const start = this.currentPage * this.paginadorRows;
    const end = start + this.paginadorRows;
    this.gastosPaginadas = this.gastosFiltrados.slice(start, end);
  }


  paginate(event: any) {
    this.currentPage = event.page;
    this.aplicarFiltrosYPaginacion();
  }
}
