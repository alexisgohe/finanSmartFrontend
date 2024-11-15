import { Component, OnInit } from '@angular/core';
import { faArrowUp, faArrowDown, faPiggyBank, faCreditCard, faDollarSign, faPlus, faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { GeneralService } from '../../service/general.service';
import { MatDialog } from '@angular/material/dialog';
import { EstadoFinanciero } from '../../models/resumenFinanciero';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  resumenFinanciero: EstadoFinanciero = {
    total_ingresos: 0,
    total_gastos: 0,
    saldo_total: 0,
    saldo_pendiente: 0,
    metas_ahorro: [],
    transacciones_recientes: []
  };
  presupuestoProgreso = 75;

  constructor(
    private generalService: GeneralService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.getResumenFinanciero();
  }

  getResumenFinanciero() {
    let object = {
      usuario_id: 2,
      fecha_inicio: "2024-01-01",
      fecha_fin: "2024-12-31"
    }
    this.generalService.postData('resumen-financiero/', object).subscribe({
      next: (data) => {
        this.resumenFinanciero = data;
      },
      error: (error) => console.error('Error:', error),
    });
  }

  // balance = 5240;
  // gastos = 3260;
  // ingresos = 7260;
  // deuda = 12500;
  // metasAhorro = [
  //   { name: 'Vacaciones', value: 70 },
  //   { name: 'Nuevo Auto', value: 45 }
  // ];
  // transacciones = [
  //   { name: 'Supermercado', fecha: 'Ayer', amount: -85, iconColor: 'bg-red-500' },
  //   { name: 'Salario', fecha: '15 Jul', amount: 3500, iconColor: 'bg-green-500' }
  // ];

  // Íconos de FontAwesome
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  faPiggyBank = faPiggyBank;
  faCreditCard = faCreditCard;
  faDollarSign = faDollarSign;
  faPlus = faPlus;
  faShoppingBag = faShoppingBag;
}
