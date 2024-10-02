import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { faGaugeHigh, faWallet, faMoneyBill, faTableList, faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';

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
    { label: 'Gastos', icon: faMoneyBill, url:'gastos' },
    { label: 'Categorías', icon: faTableList, url:'categorias' },
    { label: 'Transferencias', icon: faArrowUpFromBracket, url:'transferencias' }
  ];

  navigation(url: any){
    this.router.navigate([`/${url}`]);
  }

}
