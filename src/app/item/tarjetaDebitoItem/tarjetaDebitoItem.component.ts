import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TarjetaDebito } from '../../models/tarjetaDebito.model';
import { GeneralService } from '../../service/general.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  faDollarSign,
  faCalendar,
  faPenToSquare,
  faTrash
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-tarjetaDebitoItem',
  templateUrl: './tarjetaDebitoItem.component.html',
  styleUrls: ['./tarjetaDebitoItem.component.css']
})
export class TarjetaDebitoItemComponent implements OnInit {
  @Input() tarjeta!: TarjetaDebito;
  @Output() edit = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();
  mostrarIconos: boolean = false;

  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
  }

  onEditClick() {
    if (this.tarjeta && this.tarjeta.tarjeta_debito_id) {
      this.edit.emit(this.tarjeta.tarjeta_debito_id);  // Emitir solo el tarjeta_debito_id
    }
  }

  onDeleteClick() {
    if (this.tarjeta && this.tarjeta.tarjeta_debito_id) {
      this.delete.emit(this.tarjeta.tarjeta_debito_id);  // Emitir solo el tarjeta_debito_id
    }
  }

  faDollarSign = faDollarSign;
  faCalendar = faCalendar;
  faTrash = faTrash;
  faPenToSquare = faPenToSquare;
}
