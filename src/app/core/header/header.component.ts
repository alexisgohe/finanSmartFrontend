import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { faBars, faBell, faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  menuOpen = false;

  constructor() { }

  ngOnInit() {
  }

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  // Íconos de FontAwesome
  faBars = faBars;
  faBell = faBell;
  faUser = faUser;
}
