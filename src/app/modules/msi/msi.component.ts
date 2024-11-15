import { Component } from '@angular/core';
import { GeneralService } from '../../service/general.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  faBagShopping,
  faCalendar,
} from '@fortawesome/free-solid-svg-icons';
import { CurrencyPipe, DatePipe } from "@angular/common";
import { CompraMeses } from '../../models/compraMeses.model';
import { MsiDetalleComponent } from '../../item/msiDetalle/msiDetalle.component';

interface Purchase {
  id: number;
  description: string;
  totalAmount: number;
  monthlyAmount: number;
  months: number;
  date: Date;
  card: string;
}

@Component({
  selector: 'app-msi',
  templateUrl: './msi.component.html',
  styleUrls: ['./msi.component.css'],
  providers: [
    CurrencyPipe,
    DatePipe
  ],
})
export class MsiComponent {

  busqueda: string = '';

  compraMeses: CompraMeses[] = [];
  transaccionesPaginadas: CompraMeses[] = [];
  paginadorRows: number = 5;
  currentPage = 0;

  selectedRange: any[] = [];
  rangoTexto: string = 'Ninguno';

  // Íconos de FontAwesome
  faBagShopping = faBagShopping;
  faCalendar = faCalendar;

  constructor(
    private generalService: GeneralService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private currencyPipe: CurrencyPipe,
    private datePipe: DatePipe,
  ) { }

  ngOnInit() {
    const storedRange = localStorage.getItem('selectedRange');
    if (storedRange) {
      this.selectedRange = JSON.parse(storedRange).map((dateString: string) => new Date(dateString));
    }

    this.getCompraMeses();
  }

  getCompraMeses() {
    this.generalService.getData('comprasMeses/').subscribe({
      next: (data) => {
        this.compraMeses = data.data;
        this.aplicarFiltrosYPaginacion();
      },
      error: (error) => console.error('Error:', error),
    });
  }

  get CompraMesesFiltrados() {
    return this.compraMeses.filter((compraMes) => {

      const cumpleBusqueda =
        (compraMes.descripcion &&
          compraMes.descripcion
            .toLowerCase()
            .includes(this.busqueda.toLowerCase()));

      const cumpleRangoFecha = this.selectedRange &&
        Array.isArray(this.selectedRange) &&
        this.selectedRange.length === 2 &&
        compraMes.fecha_compra >= this.formatDate(this.selectedRange[0]) &&
        compraMes.fecha_compra <= this.formatDate(this.selectedRange[1]);

      // Devolverá true si hay búsqueda y cumple con el rango de fechas o si el rango es indefinido o null
      return cumpleBusqueda &&
        (!this.selectedRange || this.selectedRange.length < 2 || cumpleRangoFecha)
    });
  }

  aplicarFiltrosYPaginacion() {
    const start = this.currentPage * this.paginadorRows;
    const end = start + this.paginadorRows;
    this.transaccionesPaginadas = this.CompraMesesFiltrados.slice(start, end);
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

  getProgreso(compraMes:any) {
    return ((compraMes.num_meses - compraMes.meses_restantes) / compraMes.num_meses) * 100;
  }

  detalle(compraMes:any){
      const dialogRef = this.dialog.open(MsiDetalleComponent, {
        panelClass: 'mat-dialog-custom',
        data: {
          respuesta: '',
          accion: 'N',
          TituloAsigna: 'Detalle MSI',
          data: compraMes
        },
      });
      dialogRef.disableClose = true;
      dialogRef.afterClosed().subscribe((result) => {
        if (result.respuesta) {
          console.log(result.respuesta);
        } else {
          console.log(result.respuesta);
        }
      });
    }
}
