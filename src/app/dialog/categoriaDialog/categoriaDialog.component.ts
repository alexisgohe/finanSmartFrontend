import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GeneralService } from '../../service/general.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { faEye, faTrash, faPenToSquare, faWallet, faHouseChimney, faCar, faAppleWhole, faPiggyBank, faPerson } from '@fortawesome/free-solid-svg-icons';

export interface DialogData {
  respuesta: string;
  accion: string;
  TituloAsigna: string;
  data: any;
}

@Component({
  selector: 'app-categoriaDialog',
  templateUrl: './categoriaDialog.component.html',
  styleUrl: './categoriaDialog.component.css',
})
export class CategoriaDialogComponent {
  categoriaForm!: FormGroup;
  fechaSeleccionada: Date | null = null;
  userId: any;

  get fControlH() {
    return this.categoriaForm.controls;
  }

  get fValueH() {
    return this.categoriaForm.value;
  }

  constructor(
    private generalService: GeneralService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogData>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    this.userId = this.generalService.usuarioId();

    this.categoriaForm = this.fb.group({
      descripcion: ['', Validators.required],
      tipo: ['', Validators.required],
      img: ['', Validators.required],
      usuario: ['', Validators.required],
    });

    if(this.data.accion === 'E') {
      this.cargarForm();
    }

    this.fControlH['usuario'].setValue(this.userId);
  }

  cargarForm(): void {
    this.fControlH['descripcion'].setValue(this.data.data.descripcion);
    this.fControlH['tipo'].setValue(this.data.data.tipo);
    this.fControlH['img'].setValue(this.data.data.img);
  }

  onSubmit() {
    if (this.categoriaForm.valid) {
      if (this.data.accion === 'N') {
        this.generalService.postData('categorias/', this.fValueH).subscribe({
          next: (response) => {
            this.generalService.openSnackBar(
            this.snackBar, response, '', 5000, 'success-snackbar');
            this.dialogRef.close({
              data: {},
              respuesta: true,
            });
          },
          error: (error) => {
            this.generalService.openSnackBar(
            this.snackBar, error, '', 5000, 'error-snackbar');
          }
        });
      } else if (this.data.accion === 'E') {
        this.generalService.putData(`categorias/${this.data.data.categoria_id}/`, this.fValueH).subscribe({
          next: (response) => {
            this.generalService.openSnackBar(
            this.snackBar, response, '', 5000, 'success-snackbar');
            this.dialogRef.close({
              data: {},
              respuesta: true,
            });
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
    this.dialogRef.close({ data: '', respuesta: false });
  }

  seleccionarFecha(event: Event) {
    const input = event.target as HTMLInputElement;
    this.fechaSeleccionada = input.valueAsDate;
  }

  dropdownOpen = false;
  selectedIcon: any;
  selectedLabel: string | null = null;

  icons = [
    { label: 'Cartera', value: "faWallet", icon: faWallet },
    { label: 'Casa', value: "faHouseChimney", icon: faHouseChimney  },
    { label: 'Coche', value: "faCar", icon: faCar  },
    { label: 'Manzana', value: "faAppleWhole", icon: faAppleWhole  },
    { label: 'Alcancía', value: "faPiggyBank", icon: faPiggyBank  },
    { label: 'Persona', value: "faPerson", icon: faPerson  }
  ];

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectIcon(icon: any) {
    this.selectedIcon = icon.icon;
    this.selectedLabel = icon.label;
    this.fControlH['img'].setValue(icon.value);
    this.dropdownOpen = false;
  }
}
