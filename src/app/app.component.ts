import { Component } from '@angular/core';
import { CreditCardService } from './services/credit-card.service';
import { CreditCard } from './models/credit-card.model';
import { AddCardComponent } from './add-card/add-card.component';
import { GetAllCardsComponent } from './get-all-cards/get-all-cards.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    AddCardComponent,
    GetAllCardsComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  cards: CreditCard[] = [];
  isLoading = false;

  constructor(private creditCardService: CreditCardService) {
    this.loadCards();
  }

  loadCards() {
    this.isLoading = true;
    this.creditCardService.getAllCreditCards().subscribe({
      next: (cards: CreditCard[]) => {
        // Merge default cards with API cards, avoiding duplicates
        const mergedCards = [...this.cards];
        cards.forEach(apiCard => {
          if (!this.cards.some(c => c.cardNumber === apiCard.cardNumber)) {
            mergedCards.push(apiCard);
          }
        });
        this.cards = mergedCards;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load cards', err);
        this.isLoading = false;
        // Keep showing default cards even if API fails
      }
    });
  }
  
  onCardAdded(event: { 
    formData: any, 
    onSuccess: () => void, 
    onError: (error: string) => void 
  }) {
    // Ensure cardLimit is a proper number before sending
    const cardData = {
      ...event.formData,
      cardLimit: parseFloat(event.formData.cardLimit)
    };

    this.creditCardService.addCreditCard(cardData).subscribe({
      next: (response) => {
        console.log('Card added successfully:', response);
        this.refreshCards();
        event.onSuccess();
      },
      error: (error) => {
        console.error('Error adding card:', error);
        const errorMessage = error.error?.message || error.message || 'Failed to add card';
        event.onError(errorMessage);
      }
    });
  }

  refreshCards() {
    this.loadCards();
  }
}