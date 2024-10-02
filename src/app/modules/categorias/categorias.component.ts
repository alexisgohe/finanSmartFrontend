import { Component, OnInit } from '@angular/core';
import { GeneralService } from '../../service/general.service';
import { Categoria } from '../../models/categoria.model';
import { faEye, faTrash, faPenToSquare, faWallet, faHouseChimney, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoriaDialogComponent } from '../../dialog/categoriaDialog/categoriaDialog.component';
import { CategoriasPipe } from '../../pipes/categorias.pipe';

type IconName = 'faWallet' | 'faHouseChimney';

const iconMap: Record<IconName, IconDefinition> = {
  faWallet: faWallet,
  faHouseChimney: faHouseChimney
};

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css'],
  providers: [CategoriasPipe]
})
export class CategoriasComponent implements OnInit {
  busqueda: string = '';

  categorias: Categoria[] = [];

  constructor(
    private generalService: GeneralService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private categoriasPipe: CategoriasPipe
  ) { }

  ngOnInit() {
    this.getCategoria();
  }

  getIcon(iconName: string): IconDefinition {
    return iconMap[iconName as IconName] || faWallet; // Devuelve un icono predeterminado
  }

  getCategoria() {
    this.generalService.getData('categorias/').subscribe({
      next: (data) => {
        this.categorias = data.data;
      },
      error: (error) => console.error('Error:', error),
    });
  }

  nuevaCategoria() {
    const dialogRef = this.dialog.open(CategoriaDialogComponent, {
      panelClass: 'mat-dialog-custom',
      data: {
        respuesta: '',
        accion: 'N',
        TituloAsigna: 'Agregar Nueva Categoría',
      },
    });
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe((result) => {
      if (result.respuesta) {
        this.getCategoria();
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

  editarCategoria(categoria: any) {
    const dialogRef = this.dialog.open(CategoriaDialogComponent, {
      panelClass: 'mat-dialog-custom',
      data: {
        respuesta: '',
        accion: 'E',
        TituloAsigna: 'Editar Categoría',
        data: categoria,
      },
    });
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe((result) => {
      if (result.respuesta) {
        this.getCategoria();
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

  eliminarCategoria(categoria_id: number) {
    this.generalService.deleteData(`categorias/${categoria_id}/`).subscribe({
      next: (response) => {
        this.getCategoria()
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

  get categoriasFiltradas() {
    return this.categorias.filter(categoria => {
      const tipoTransformado = this.categoriasPipe.transform(categoria.tipo);  // Aplica la pipe para el tipo
      return (
        categoria.categoria_id.toString().includes(this.busqueda) ||  // Filtrar por categoria_id
        categoria.descripcion.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        tipoTransformado.toLowerCase().includes(this.busqueda.toLowerCase())
      );
    });
  }

  // Íconos de FontAwesome
  faEye = faEye;
  faPenToSquare = faPenToSquare;
  faWallet = faWallet;
  faTrash = faTrash;
}
