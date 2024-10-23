import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faGaugeHigh, faWallet, faMoneyBill1, faTableList, faArrowUpFromBracket, faCreditCard, faBuildingColumns, faListOl } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  sidebarOpen = false;
  @Input() isOpen = true;
  selectedMenuItem: string | null = null;
  currentRoute: string | undefined;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.currentRoute = this.router.url;
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  menuItems = [
    { label: 'Dashboard', icon: faGaugeHigh, url:'dashboard' },
    { label: 'Ingresos', icon: faWallet, url:'ingresos' },
    { label: 'Gastos', icon: faMoneyBill1, url:'gastos' },
    { label: 'Categorías', icon: faTableList, url:'categorias' },
    { label: 'Transacciones', icon: faArrowUpFromBracket, url:'transacciones' },
    { label: 'Tarjeta Débito', icon: faCreditCard, url:'debito' },
    { label: 'Tarjeta Crédito', icon: faBuildingColumns, url:'credito' },
    { label: 'Meses sin intereses', icon: faListOl, url:'msi' },
  ];

  navigation(url: any){
    this.selectedMenuItem = url;
    this.router.navigate([`/${url}`]);
  }

}
