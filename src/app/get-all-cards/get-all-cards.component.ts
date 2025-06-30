import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditCard } from '../models/credit-card.model';

@Component({
  selector: 'app-get-all-cards',
  imports: [CommonModule],
  templateUrl: './get-all-cards.component.html',
  styleUrls: ['./get-all-cards.component.css']
})
export class GetAllCardsComponent implements OnChanges {
  @Input() cards: CreditCard[] = [];
  @Input() isLoading = false;
  errorMessage: string = '';

  // Getter to ensure cards is always an array
  get safeCards(): CreditCard[] {
    return this.cards || [];
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['cards']) {
      if (!this.cards) {
        this.cards = [];
      }
      console.log('Cards updated:', this.cards);
    }
  }

  formatCardNumber(cardNumber: string): string {
    if (!cardNumber) {
      return '';
    }
    return cardNumber.replace(/(\d{4})/g, '$1 ').trim();
  }

  formatCurrency(value: number): string {
    if (value === null || value === undefined || isNaN(value)) {
      return '£0.00';
    }
    return '£' + value.toFixed(2);
  }
}