import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { faGaugeHigh, faWallet, faMoneyBill1, faTableList, faArrowUpFromBracket, faCreditCard, faBuildingColumns } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  sidebarOpen = false;
  @Input() isOpen = true;
  constructor(private router: Router,) {}

  ngOnInit() {
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  menuItems = [
    { label: 'Dashboard', icon: faGaugeHigh, url:'dashboard' },
    { label: 'Ingresos', icon: faWallet, url:'ingresos' },
    { label: 'Gastos', icon: faMoneyBill1, url:'gastos' },
    { label: 'Categorías', icon: faTableList, url:'categorias' },
    { label: 'Transferencias', icon: faArrowUpFromBracket, url:'transferencias' },
    { label: 'Tarjeta Débito', icon: faCreditCard, url:'debito' },
    { label: 'Tarjeta Crédito', icon: faBuildingColumns, url:'credito' },
  ];

  navigation(url: any){
    this.router.navigate([`/${url}`]);
  }

}
