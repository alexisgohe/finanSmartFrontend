import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Purchase {
  id: number;
  description: string;
  totalAmount: number;
  monthlyAmount: number;
  months: number;
  date: Date;
  card: string;
}

@Component({
  selector: 'app-msi',
  templateUrl: './msi.component.html',
  styleUrls: ['./msi.component.css']
})
export class MsiComponent implements OnInit {
  purchases: Purchase[] = [];
  filteredPurchases: Purchase[] = [];
  selectedPurchase: Purchase | null = null;
  searchTerm: string = "";
  sortBy: string = "date";
  sortOrder: 'asc' | 'desc' = 'desc';

  ngOnInit() {
    // Simulated data - replace with actual API call
    this.purchases = [
      {
        id: 1,
        description: "New Laptop",
        totalAmount: 1200,
        monthlyAmount: 100,
        months: 12,
        date: new Date(2024, 0, 15),
        card: "Visa ****1234"
      },
      {
        id: 2,
        description: "Smartphone",
        totalAmount: 800,
        monthlyAmount: 133.33,
        months: 6,
        date: new Date(2024, 1, 1),
        card: "Mastercard ****5678"
      }
    ];
    this.filterPurchases();
  }

  filterPurchases() {
    this.filteredPurchases = this.purchases.filter(purchase =>
      purchase.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      purchase.card.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.sortPurchases();
  }

  sortPurchases() {
    this.filteredPurchases.sort((a, b) => {
      let comparison = 0;
      switch (this.sortBy) {
        case 'date':
          comparison = a.date.getTime() - b.date.getTime();
          break;
        case 'amount':
          comparison = a.totalAmount - b.totalAmount;
          break;
        case 'months':
          comparison = a.months - b.months;
          break;
      }
      return this.sortOrder === 'asc' ? comparison : -comparison;
    });
  }

  toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortPurchases();
  }

  showPurchaseDetails(purchase: Purchase) {
    this.selectedPurchase = purchase;
  }

  closeModal() {
    this.selectedPurchase = null;
  }
}
