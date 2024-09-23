import { Component, OnInit } from '@angular/core';
import { faArrowUp, faArrowDown, faPiggyBank, faCreditCard, faDollarSign, faPlus, faShoppingBag } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  // Datos
  balance = 5240;
  gastos = 3260;
  ingresos = 7260;
  deuda = 12500;
  presupuestoProgreso = 75;
  metasAhorro = [
    { name: 'Vacaciones', value: 70 },
    { name: 'Nuevo Auto', value: 45 }
  ];
  transacciones = [
    { name: 'Supermercado', fecha: 'Ayer', amount: -85, iconColor: 'bg-red-500' },
    { name: 'Salario', fecha: '15 Jul', amount: 3500, iconColor: 'bg-green-500' }
  ];

  // Íconos de FontAwesome
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  faPiggyBank = faPiggyBank;
  faCreditCard = faCreditCard;
  faDollarSign = faDollarSign;
  faPlus = faPlus;
  faShoppingBag = faShoppingBag;
}
