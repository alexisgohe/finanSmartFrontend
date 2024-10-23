import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';
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
  selector: 'app-transaccionesDialog',
  templateUrl: './transaccionesDialog.component.html',
  styleUrls: ['./transaccionesDialog.component.css']
})
export class TransaccionesDialogComponent implements OnInit {
  transaccionesForm!: FormGroup;
  fechaSeleccionada: Date | null = null;
  userId: any;
  nombreCuentaOrigen: string = "";
  nombreCuentaDestino: string = "";
  nombreCategoria: string = "";

  get fControlH() {
    return this.transaccionesForm.controls;
  }

  get fValueH() {
    return this.transaccionesForm.value;
  }

  // lookup
  colsLookTarjetas: any[] = [];
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

    this.transaccionesForm = this.fb.group({
      monto_transacciones: ['', [Validators.required, Validators.min(0)]],
      fecha_transacciones: ['', Validators.required],
      descripcion_transacciones: ['', Validators.required],
      categoria_id: ['', Validators.required],
      usuario_id: ['', Validators.required],
      cuenta_destino_debito: ['', Validators.required],
    });

    this.fControlH['usuario_id'].setValue(this.userId);

    if(this.data.accion === 'E') {
      this.cargarForm();
    }

    this.crearTablasLook()
  }

  onSubmit() {
    if (this.transaccionesForm.valid) {
      if (this.data.accion === 'N') {
        this.generalService.postData('transacciones/', this.fValueH).subscribe({
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
        this.generalService.putData(`transacciones/${this.data.data.transacciones_id}/`, this.fValueH).subscribe({
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
    this.dialogRef.close({ data: "", respuesta: false });
  }

  seleccionarFecha(event: Event) {
    const input = event.target as HTMLInputElement;
    this.fechaSeleccionada = input.valueAsDate;
  }

  cargarForm(): void {
    this.fControlH['monto_transacciones'].setValue(this.data.data.monto_transacciones);
    this.fControlH['fecha_transacciones'].setValue(this.data.data.fecha_transacciones);
    this.fControlH['descripcion_transacciones'].setValue(this.data.data.descripcion_transacciones);
    this.fControlH['categoria_id'].setValue(this.data.data.categoria.categoria_id);
    this.nombreCategoria = this.data.data.categoria.descripcion
    this.fControlH['cuenta_destino_debito'].setValue(this.data.data.transferencia.cuenta_origen_debito.tarjeta_debito_id);
    this.nombreCuentaOrigen = this.data.data.transferencia.cuenta_origen_debito.banco_tarjeta
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
        this.snackBar,
          'Capture los datos del formulario correctamente',
          '',
          5000,
          'error-snackbar';
      }
    });
  }

  // Función para realizar la llamada a la búsqueda de datos
  lookupLlamado(lookup: string) {
    let data = new LookupModel();
    switch (lookup) {
      // Configuración específica para el lookup
      case "TarjetasDebito":
        data.titulo = "Tarjetas";
        data.columnas = this.colsLookTarjetas;
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
      case "TarjetasDebito":
        this.nombreCuentaOrigen = data.banco_tarjeta
        this.fControlH['cuenta_destino_debito'].setValue(data.tarjeta_debito_id);
        break;
        case "Categorias":
          this.nombreCategoria = data.descripcion
        this.fControlH['categoria_id'].setValue(data.categoria_id);
        break;
    }
  }

  crearTablasLook() {
    this.colsLookTarjetas = [
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
