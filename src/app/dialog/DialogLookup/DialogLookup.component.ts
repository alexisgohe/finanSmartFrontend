import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GeneralService } from '../../service/general.service';

@Component({
  selector: 'app-dialog-lookup',
  templateUrl: './DialogLookup.component.html',
  styleUrl: './DialogLookup.component.css',
})
export class DialogLookupComponent {
  columnas: any[] = [];
  DatosList: any;

  constructor(
    private generalService: GeneralService,
    public dialogRef: MatDialogRef<DialogLookupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.columnas = data.columnas;
    if (this.data.servicio) {
      this.consultaServicio();
    }
  }

  consultaServicio() {
    switch (this.data.servicio) {
      case 'TarjetasDebito':
        this.getTarjetasDebito();
        break;
      case 'Categorias':
        this.getCategoria();
        break;
    }
  }

  getTarjetasDebito() {
    this.generalService.getData('tarjetaDebito/').subscribe({
      next: (data) => {
        this.DatosList = data.data;
      },
      error: (error) => console.error('Error:', error),
    });
  }

  getCategoria() {
    this.generalService.getData('categorias/').subscribe({
      next: (data) => {
        this.DatosList = data.data;
      },
      error: (error) => console.error('Error:', error),
    });
  }

  onOkClick(row: any) {
    this.dialogRef.close({ data: row, respuesta: true });
  }

  seleccionarElemento(fila: any) {
    this.dialogRef.close({ respuesta: true, data: fila });
  }

  cerrarDialogo() {
    this.dialogRef.close({ respuesta: false });
  }
}
