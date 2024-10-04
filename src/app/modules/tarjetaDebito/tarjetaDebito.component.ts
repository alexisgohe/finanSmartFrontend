import { Component, OnInit } from '@angular/core';
import { TarjetaDebito } from '../../models/tarjetaDebito.model';
import { GeneralService } from '../../service/general.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TarjetaDebitoDialogComponent } from '../../dialog/tarjetaDebitoDialog/tarjetaDebitoDialog.component';

@Component({
  selector: 'app-tarjetaDebito',
  templateUrl: './tarjetaDebito.component.html',
  styleUrls: ['./tarjetaDebito.component.css']
})
export class TarjetaDebitoComponent implements OnInit {
  tarjetas: TarjetaDebito[] = [];
  busqueda: string = '';

  constructor(
    private generalService: GeneralService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.getTarjetas();
  }

  getTarjetas() {
    this.generalService.getData('tarjetaDebito/').subscribe({
      next: (data) => {
        this.tarjetas = data.data;
      },
      error: (error) => console.error('Error:', error),
    });
  }

  get tarjetasFiltradas() {
    return this.tarjetas.filter(tarjeta => {
      return (
        tarjeta.tarjeta_debito_id.toString().includes(this.busqueda) ||
        tarjeta.nombre.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        tarjeta.banco_tarjeta.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        tarjeta.saldo.toString().includes(this.busqueda) ||
        tarjeta.tipo.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        tarjeta.numero_tarjeta.toLowerCase().includes(this.busqueda.toLowerCase())
      );
    });
  }

  nuevaTarjeta() {
    const dialogRef = this.dialog.open(TarjetaDebitoDialogComponent, {
      panelClass: 'mat-dialog-custom',
      data: {
        respuesta: '',
        accion: 'N',
        TituloAsigna: 'Registro de Tarjeta de Débito',
      },
    });
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe((result) => {
      if (result.respuesta) {
        this.getTarjetas();
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

  editarTarjeta(tarjetaDebito: any) {
    const dialogRef = this.dialog.open(TarjetaDebitoDialogComponent, {
      panelClass: 'mat-dialog-custom',
      data: {
        respuesta: '',
        accion: 'E',
        TituloAsigna: 'Editar Tarjeta',
        data: tarjetaDebito,
      },
    });
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe((result) => {
      if (result.respuesta) {
        this.getTarjetas();
        this.generalService.openSnackBar(
          this.snackBar,
          'Registro modificado con exito',
          '',
          5000,
          'success-snackbar'
        );
      } else {
        this.generalService.openSnackBar(
          this.snackBar,
          'No se realizó la modificación del registro' + result.data,
          '',
          5000,
          'error-snackbar'
        );
      }
    });
  }

  eliminarTarjeta(tarjeta_debito_id: number) {
    this.generalService.deleteData(`tarjetaDebito/${tarjeta_debito_id}/`).subscribe({
      next: (response) => {
        this.getTarjetas();
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

}
