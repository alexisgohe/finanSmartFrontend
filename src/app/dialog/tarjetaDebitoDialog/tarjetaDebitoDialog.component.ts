import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeneralService } from '../../service/general.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface DialogData {
  respuesta: string;
  accion: string;
  TituloAsigna: string;
  data: any;
}

@Component({
  selector: 'app-tarjetaDebitoDialog',
  templateUrl: './tarjetaDebitoDialog.component.html',
  styleUrls: ['./tarjetaDebitoDialog.component.css']
})
export class TarjetaDebitoDialogComponent implements OnInit {
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
      saldo: ['', [Validators.required, Validators.min(0)]],
      tipo: ['', Validators.required],
      numero_tarjeta: ['', [Validators.required, Validators.maxLength(16)]],
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
    this.fControlH['saldo'].setValue(this.data.data.saldo);
    this.fControlH['tipo'].setValue(this.data.data.tipo);
    this.fControlH['numero_tarjeta'].setValue(this.data.data.numero_tarjeta);
  }

  onSubmit(): void {
    if (this.tarjetaForm.valid) {
      if (this.data.accion === 'N') {
        this.generalService.postData('tarjetaDebito/', this.fValueH).subscribe({
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
        this.generalService.putData(`tarjetaDebito/${this.data.data.tarjeta_debito_id}/`, this.fValueH).subscribe({
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
