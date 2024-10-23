import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Transacciones } from '../../models/transacciones.model';
import { GeneralService } from '../../service/general.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  faCreditCard,
  faMoneyBill1,
  faPenToSquare,
  faCalendarDay,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { TransaccionesDialogComponent } from '../../dialog/transaccionesDialog/transaccionesDialog.component';

@Component({
  selector: 'app-transferencias',
  templateUrl: './transferencias.component.html',
  styleUrls: ['./transferencias.component.css']
})
export class TransferenciasComponent {
  busqueda: string = '';

  transacciones: Transacciones[] = [];
  transaccionesPaginadas: Transacciones[] = [];
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

    this.getTransaccioness();
  }

  getTransaccioness() {
    this.generalService.getData('transacciones/').subscribe({
      next: (data) => {
        this.transacciones = data.data;
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

  get totalTransacciones(): number {
    // Usar las transacciones filtradas si hay un rango de fechas seleccionado, de lo contrario usar todas las transacciones
    const transaccionesAConsiderar = this.selectedRange && this.selectedRange.length === 2
      ? this.transaccionesFiltrados
      : this.transacciones;

    const ingresos = transaccionesAConsiderar
      .filter(transaccion => transaccion.tipo === 'I') // Filtrar ingresos
      .reduce((sum, transaccion) => sum + transaccion.monto, 0); // Sumar montos de ingresos

    const gastos = transaccionesAConsiderar
      .filter(transaccion => transaccion.tipo === 'G') // Filtrar gastos
      .reduce((sum, transaccion) => sum + transaccion.monto, 0); // Sumar montos de gastos

    return ingresos - gastos; // Resta ingresos menos gastos
  }


  nuevaTransacciones() {
    const dialogRef = this.dialog.open(TransaccionesDialogComponent, {
      panelClass: 'mat-dialog-custom',
      data: {
        respuesta: '',
        accion: 'N',
        TituloAsigna: 'Agregar Nuevo Transacciones',
      },
    });
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe((result) => {
      if (result.respuesta) {
        this.getTransaccioness();
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

  editarTransacciones(transacciones: any) {
    const dialogRef = this.dialog.open(TransaccionesDialogComponent, {
      panelClass: 'mat-dialog-custom',
      data: {
        respuesta: '',
        accion: 'E',
        TituloAsigna: 'Editar Transacciones',
        data: transacciones,
      },
    });
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe((result) => {
      if (result.respuesta) {
        this.getTransaccioness();
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

  eliminarTransacciones(transacciones_id: number) {
    this.generalService.deleteData(`transacciones/${transacciones_id}/`).subscribe({
      next: (response) => {
        this.getTransaccioness()
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

  get transaccionesFiltrados() {
    return this.transacciones.filter((transacciones) => {
      const cumpleBusqueda =
        transacciones.descripcion &&
        transacciones.descripcion
          .toLowerCase()
          .includes(this.busqueda.toLowerCase());

      const cumpleRangoFecha = this.selectedRange &&
        Array.isArray(this.selectedRange) &&
        this.selectedRange.length === 2 &&
        transacciones.fecha >= this.formatDate(this.selectedRange[0]) &&
        transacciones.fecha <= this.formatDate(this.selectedRange[1]);

      // Devolverá true si hay búsqueda y cumple con el rango de fechas o si el rango es indefinido o null
      return cumpleBusqueda && (!this.selectedRange || this.selectedRange.length < 2 || cumpleRangoFecha);
    });
  }

  aplicarFiltrosYPaginacion() {
    const start = this.currentPage * this.paginadorRows;
    const end = start + this.paginadorRows;
    this.transaccionesPaginadas = this.transaccionesFiltrados.slice(start, end);
  }

  paginate(event: any) {
    this.currentPage = event.page;
    this.aplicarFiltrosYPaginacion();
  }
}
