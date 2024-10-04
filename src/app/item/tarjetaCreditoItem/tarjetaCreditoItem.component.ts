import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TarjetaCredito } from '../../models/tarjetaCredito.model';
import {
  faDollarSign,
  faCalendar,
  faPenToSquare,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-tarjetaCreditoItem',
  templateUrl: './tarjetaCreditoItem.component.html',
  styleUrls: ['./tarjetaCreditoItem.component.css']
})
export class TarjetaCreditoItemComponent implements OnInit {
  @Input() tarjeta!: TarjetaCredito;
  @Output() edit = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();
  mostrarIconos: boolean = false;

  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
  }

  onEditClick() {
    if (this.tarjeta && this.tarjeta.tarjeta_credito_id) {
      this.edit.emit(this.tarjeta.tarjeta_credito_id);  // Emitir solo el tarjeta_credito_id
    }
  }

  onDeleteClick() {
    if (this.tarjeta && this.tarjeta.tarjeta_credito_id) {
      this.delete.emit(this.tarjeta.tarjeta_credito_id);  // Emitir solo el tarjeta_credito_id
    }
  }

  faDollarSign = faDollarSign;
  faCalendar = faCalendar;
  faTrash = faTrash;
  faPenToSquare = faPenToSquare;
}
