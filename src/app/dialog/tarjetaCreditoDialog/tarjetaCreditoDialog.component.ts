import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GeneralService } from '../../service/general.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface DialogData {
  respuesta: string;
  accion: string;
  TituloAsigna: string;
  data: any;
}

@Component({
  selector: 'app-tarjetaCreditoDialog',
  templateUrl: './tarjetaCreditoDialog.component.html',
  styleUrls: ['./tarjetaCreditoDialog.component.css']
})
export class TarjetaCreditoDialogComponent implements OnInit {
  tarjetaForm!: FormGroup;
  userId: any;

  get fControlH() {
    return this.tarjetaForm.controls;
  }

  get fValueH() {
    return this.tarjetaForm.value;
  }

  constructor(
    private generalService: GeneralService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogData>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.userId = this.generalService.usuarioId();

    this.tarjetaForm = this.fb.group({
      nombre: ['', Validators.required],
      banco_tarjeta: ['', Validators.required],
      numero_tarjeta: ['', [Validators.required, Validators.maxLength(16)]],
      limite_credito: ['', [Validators.required, Validators.min(0)]],
      credito_utilizado: ['', [Validators.required, Validators.min(0)]],
      fecha_corte: ['', Validators.required],
      fecha_pago: ['', Validators.required],
      usuario: [''],
    });

    if(this.data.accion === 'E') {
      this.cargarForm();
    }

    this.fControlH['usuario'].setValue(this.userId);
  }

  cargarForm(): void {
    this.fControlH['nombre'].setValue(this.data.data.nombre);
    this.fControlH['banco_tarjeta'].setValue(this.data.data.banco_tarjeta);
    this.fControlH['numero_tarjeta'].setValue(this.data.data.numero_tarjeta);
    this.fControlH['limite_credito'].setValue(this.data.data.limite_credito);
    this.fControlH['credito_utilizado'].setValue(this.data.data.credito_utilizado);
    this.fControlH['fecha_corte'].setValue(this.data.data.fecha_corte);
    this.fControlH['fecha_pago'].setValue(this.data.data.fecha_pago);
  }

  onSubmit(): void {
    if (this.tarjetaForm.valid) {
      if (this.data.accion === 'N') {
        this.generalService.postData('tarjetasCredito/', this.fValueH).subscribe({
          next: (response) => {
            this.snackBar, response, '', 5000, 'success-snackbar';
            this.dialogRef.close({
              data: {},
              respuesta: true,
            });
          },
          error: (error) => {
            this.snackBar, error, '', 5000, 'error-snackbar';
          }
        });
      } else if (this.data.accion === 'E') {
        this.generalService.putData(`tarjetasCredito/${this.data.data.tarjeta_credito_id}/`, this.fValueH).subscribe({
          next: (response) => {
            this.snackBar, response, '', 5000, 'success-snackbar';
            this.dialogRef.close({
              data: {},
              respuesta: true,
            });
          },
          error: (error) => {
            this.snackBar, error, '', 5000, 'error-snackbar';
          }
        });
      }
    } else {
      this.snackBar,
        'Capture los datos del formulario correctamente',
        '',
        5000,
        'error-snackbar';
    }
  }

  cancelar(): void {
    this.dialogRef.close({ data: '', respuesta: false });
  }

}
