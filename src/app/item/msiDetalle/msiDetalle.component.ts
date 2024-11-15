import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';

export interface DialogData {
  respuesta: string;
  accion: string;
  TituloAsigna: string;
  data: any;
}

@Component({
  selector: 'app-msiDetalle',
  templateUrl: './msiDetalle.component.html',
  styleUrls: ['./msiDetalle.component.css']
})
export class MsiDetalleComponent implements OnInit {

  compraSeleccionada: any;

    // Íconos de FontAwesome
    faArrowLeft = faArrowLeft;

  constructor(
    public dialogRef: MatDialogRef<DialogData>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit() {
    console.log(this.data.data);

    const compra = this.data.data;
    const pagosRealizados = [];
    const fechaCompra = new Date(compra.fecha_compra);
    const numMeses = compra.num_meses;
    const montoMensual = parseFloat(compra.monto_mensual);

    for (let i = 0; i < numMeses; i++) {
      const fechaPago = new Date(fechaCompra);
      fechaPago.setMonth(fechaPago.getMonth() + i);

      pagosRealizados.push({
        numero: i + 1,
        fecha: fechaPago,
        estatus: i < (numMeses - compra.meses_restantes) ? 'Pagado' : 'Pendiente'
      });
    }

    const fechaFinalizacion = new Date(fechaCompra);
    fechaFinalizacion.setMonth(fechaFinalizacion.getMonth() + numMeses);

    this.compraSeleccionada = { ...compra, pagosRealizados, fechaFinalizacion: this.formatDate(fechaFinalizacion) };
    console.log(this.compraSeleccionada);
  }

  cerrar() {
    this.dialogRef.close({ data: '', respuesta: false });
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


}
