import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DialogData {
  respuesta: string;
  accion: string;
  TituloAsigna: string;
}

@Component({
  selector: 'app-ingresoDialog',
  templateUrl: './ingresoDialog.component.html',
  styleUrl: './ingresoDialog.component.css',
})
export class IngresoDialogComponent {
  ingresoForm!: FormGroup;
  fechaSeleccionada: Date | null = null;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogData>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit(): void {
    this.ingresoForm = this.fb.group({
      monto: [0, [Validators.required, Validators.min(0)]],
      fecha: ['', Validators.required],
      descripcion: ['', Validators.required],
      categoria: ['', Validators.required],
      metodoPago: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.ingresoForm.valid) {
      console.log(this.ingresoForm.value);
      this.dialogRef.close({
        data: {},
        respuesta: true,
      });
    }
  }

  cancelar(): void {
    this.dialogRef.close({ data: "", respuesta: false });
  }


  seleccionarFecha(event: Event) {
    const input = event.target as HTMLInputElement;
    this.fechaSeleccionada = input.valueAsDate;
  }
}
