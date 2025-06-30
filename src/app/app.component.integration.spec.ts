import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { CreditCardService } from './services/credit-card.service';
import { AddCardComponent } from './add-card/add-card.component';
import { GetAllCardsComponent } from './get-all-cards/get-all-cards.component';
import { CreditCard } from './models/credit-card.model';

function generateValidLuhnNumber(length: number = 19): string {
  if (length < 13 || length > 19) {
    throw new Error('Length must be between 13 and 19');
  }

  const digits: number[] = [];

  // Generate random digits for all but the last digit (check digit)
  for (let i = 0; i < length - 1; i++) {
    digits.push(Math.floor(Math.random() * 10));
  }

  // Calculate Luhn check digit
  let sum = 0;
  let shouldDouble = true; // start from the second last

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = digits[i];
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  const checkDigit = (10 - (sum % 10)) % 10;
  digits.push(checkDigit);

  return digits.join('');
}

describe('AppComponent Integration (with real backend)', () => {
  let service: CreditCardService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, AddCardComponent, GetAllCardsComponent, HttpClientModule],
    }).compileComponents();

    service = TestBed.inject(CreditCardService);
  });


  it('should add a card and then fetch it from the backend', (done) => {
    const newCard = {
      cardHolderName: 'Integration Test User',
      cardNumber: generateValidLuhnNumber(16), // or any length 13-19
      cardLimit: 1234
    };
    service.addCreditCard(newCard).subscribe({
      next: () => {
        // After adding, fetch all cards and check for the new card
        service.getAllCreditCards().subscribe({
          next: (cards: CreditCard[]) => {

            expect(Array.isArray(cards)).toBeTrue();
            expect(cards.length).toBeGreaterThan(0);

            const found = cards.filter(card =>
              card.cardHolderName === newCard.cardHolderName &&
              card.cardNumber === newCard.cardNumber &&
              card.cardLimit === newCard.cardLimit
            );
            expect(found.length).toBe(1);
            done();
          },
          error: (err) => {
            fail('Backend error on fetch: ' + JSON.stringify(err));
            done();
          }
        });
      },
      error: (err) => {
        fail('Backend error on add: ' + JSON.stringify(err));
        done();
      }
    });
  });

  
});