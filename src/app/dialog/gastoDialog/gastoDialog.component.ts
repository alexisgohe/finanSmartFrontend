import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { GeneralService } from '../../service/general.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogLookupComponent } from '../DialogLookup/DialogLookup.component';
import { LookupModel } from '../../models/lookup';

export interface DialogData {
  respuesta: string;
  accion: string;
  TituloAsigna: string;
  data: any;
}

@Component({
  selector: 'app-gastoDialog',
  templateUrl: './gastoDialog.component.html',
  styleUrls: ['./gastoDialog.component.css']
})
export class GastoDialogComponent implements OnInit {
  gastoForm!: FormGroup;
  fechaSeleccionada: Date | null = null;
  userId: any;
  nombreCuentaCredito: string = "";
  nombreCuentaDebito: string = "";
  nombreCategoria: string = "";
  selectedPaymentMethod: string = '';
  isMeses: boolean = false;
  msjMSI: string = "Sin";

  get fControlH() {
    return this.gastoForm.controls;
  }

  get fValueH() {
    return this.gastoForm.value;
  }

  // lookup
  colsLookTarjetasCredito: any[] = [];
  colsLookTarjetasDebito: any[] = [];
  colsLookCategorias: any[] = [];

  constructor(
    private generalService: GeneralService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogData>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.userId = this.generalService.usuarioId();

    this.gastoForm = this.fb.group({
      monto_gasto: ['', [Validators.required, Validators.min(0)]],
      fecha_gasto: ['', Validators.required],
      descripcion_gasto: ['', Validators.required],
      categoria_id: ['', Validators.required],
      usuario_id: ['', Validators.required],
      msi: [false],
      cantidad_meses: [0],
      cuenta_origen_credito: [''],
      cuenta_origen_debito: [''],
    });

    this.fControlH['usuario_id'].setValue(this.userId);

    if (this.data.accion === 'E') {
      this.cargarForm();
    }

    this.crearTablasLook()
  }

  onSubmit() {
    if (this.gastoForm.valid) {
      if (this.selectedPaymentMethod === 'credito') {
        this.fControlH['cuenta_origen_debito'].setValue('');
        this.nombreCuentaDebito = '';
      }
      if (this.selectedPaymentMethod === 'debito') {
        this.fControlH['cuenta_origen_credito'].setValue('');
        this.nombreCuentaCredito = '';
      }
      if (this.data.accion === 'N') {
        this.generalService.postData('gastos/', this.fValueH).subscribe({
          next: (response) => {
            if (!response.error) {
              this.dialogRef.close({
                data: {},
                respuesta: true,
              });
            }
          },
          error: (error) => {
            this.generalService.openSnackBar(
              this.snackBar, error.error.mensaje, '', 5000, 'error-snackbar');
          }
        });
      } else if (this.data.accion === 'E') {
        this.generalService.putData(`gastos/${this.data.data.gasto_id}/`, this.fValueH).subscribe({
          next: (response) => {
            if (!response.error) {
              this.dialogRef.close({
                data: {},
                respuesta: true,
              });
            }
          },
          error: (error) => {
            this.generalService.openSnackBar(
              this.snackBar, error, '', 5000, 'error-snackbar');
          }
        });
      }
    } else {
      this.generalService.openSnackBar(
        this.snackBar,
        'Capture los datos del formulario correctamente',
        '',
        5000,
        'error-snackbar');
    }
  }

  cancelar(): void {
    this.dialogRef.close({ data: "", respuesta: false });
  }

  seleccionarFecha(event: Event) {
    const input = event.target as HTMLInputElement;
    this.fechaSeleccionada = input.valueAsDate;
  }

  onCheckboxChange(event: any): void {
    this.isMeses = event.target.checked;
    if (event.target.checked){
      this.msjMSI = 'Con'
      this.fControlH['msi'].setValue(this.isMeses);
    } else{
      this.msjMSI = 'Sin'
    }
  }

  cargarForm(): void {
    this.fControlH['monto_gasto'].setValue(this.data.data.monto_gasto);
    this.fControlH['fecha_gasto'].setValue(this.data.data.fecha_gasto);
    this.fControlH['descripcion_gasto'].setValue(this.data.data.descripcion_gasto);
    this.fControlH['categoria_id'].setValue(this.data.data.categoria.categoria_id);
    this.nombreCategoria = this.data.data.categoria.descripcion
    if (this.data.data.transferencia && this.data.data.transferencia.cuenta_origen_credito) {
      this.selectedPaymentMethod = 'credito'
      this.fControlH['cuenta_origen_credito'].setValue(this.data.data.transferencia.cuenta_origen_credito.tarjeta_credito_id);
      this.nombreCuentaCredito = this.data.data.transferencia.cuenta_origen_credito.banco_tarjeta;
    }
    if (this.data.data.transferencia && this.data.data.transferencia.cuenta_origen_debito) {
      this.selectedPaymentMethod = 'debito'
      this.fControlH['cuenta_origen_debito'].setValue(this.data.data.transferencia.cuenta_origen_debito.tarjeta_debito_id);
      this.nombreCuentaDebito = this.data.data.transferencia.cuenta_origen_debito.banco_tarjeta;
    }
  }

  onPaymentMethodChange(event: Event) {
    this.selectedPaymentMethod = (event.target as HTMLSelectElement).value;
  }

  // Método para abrir el diálogo de búsqueda y selección de datos
  Lookup(lookup: string) {
    let data: any;
    data = this.lookupLlamado(lookup);
    const dialogRef = this.dialog.open(DialogLookupComponent, {
      //Se abre el dialog.
      data: data, //Se envía el objeto de datos.
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.respuesta) {
        //Si es que hubo una respuesta positiva del dialog. <<25/08/2021>> Osvaldo T.L.
        this.lookupRetorno(result.data, lookup); //Se invoca función donde se aplica asignación de datos. <<12/05/2022>> Osvaldo T.L.
      } else {
        this.generalService.openSnackBar(
          this.snackBar,
          'Capture los datos del formulario correctamente',
          '',
          5000,
          'error-snackbar');
      }
    });
  }

  // Función para realizar la llamada a la búsqueda de datos
  lookupLlamado(lookup: string) {
    let data = new LookupModel();
    switch (lookup) {
      // Configuración específica para el lookup
      case "TarjetasCredito":
        data.titulo = "Tarjetas";
        data.columnas = this.colsLookTarjetasCredito;
        data.servicio = "TarjetasCredito";
        data.retornoColum = ["row"];
        break;
      case "TarjetasDebito":
        data.titulo = "Tarjetas";
        data.columnas = this.colsLookTarjetasDebito;
        data.servicio = "TarjetasDebito";
        data.retornoColum = ["row"];
        break;
      case "Categorias":
        data.titulo = "Categorias";
        data.columnas = this.colsLookCategorias;
        data.servicio = "Categorias";
        data.retornoColum = ["row"];
        break;
    }
    return data;
  }

  // Procesa la respuesta del diálogo de búsqueda y asigna los datos
  lookupRetorno(data: any, opcion: any) {
    switch (
    opcion //Se valida el caso del lookup.
    ) {
      case "TarjetasCredito":
        this.nombreCuentaCredito = data.banco_tarjeta
        this.fControlH['cuenta_origen_credito'].setValue(data.tarjeta_credito_id);
        break;
      case "TarjetasDebito":
        this.nombreCuentaDebito = data.banco_tarjeta
        this.fControlH['cuenta_origen_debito'].setValue(data.tarjeta_debito_id);
        break;
      case "Categorias":
        this.nombreCategoria = data.descripcion
        this.fControlH['categoria_id'].setValue(data.categoria_id);
        break;
    }
  }

  crearTablasLook() {
    this.colsLookTarjetasCredito = [
      { field: "tarjeta_credito_id", header: "Clave tarjeta", width: "115", nivel: "1" },
      { field: "banco_tarjeta", header: "Nombre tarjeta", width: "auto", nivel: "1" },
    ];
    this.colsLookTarjetasDebito = [
      { field: "tarjeta_debito_id", header: "Clave tarjeta", width: "115", nivel: "1" },
      { field: "banco_tarjeta", header: "Nombre tarjeta", width: "auto", nivel: "1" },
    ];
    this.colsLookCategorias = [
      { field: "categoria_id", header: "Clave categoría", width: "115", nivel: "1" },
      { field: "descripcion", header: "Nombre categoría", width: "auto", nivel: "1" },
    ];
  }

  faMagnifyingGlass = faMagnifyingGlass;
}
