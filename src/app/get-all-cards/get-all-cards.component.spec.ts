import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GetAllCardsComponent } from './get-all-cards.component';
import { CreditCard } from '../models/credit-card.model';

const mockCards: CreditCard[] = [
  {
    id: 1,
    cardHolderName: 'Alice',
    cardNumber: '4111111111111111',
    balance: 100,
    cardLimit: 1000
  },
  {
    id: 2,
    cardHolderName: 'Bob',
    cardNumber: '5500000000000004',
    balance: -50,
    cardLimit: 500
  }
];

describe('GetAllCardsComponent', () => {
  let component: GetAllCardsComponent;
  let fixture: ComponentFixture<GetAllCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetAllCardsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GetAllCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Setup and Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.cards).toEqual([]);
      expect(component.isLoading).toBeFalse();
      expect(component.errorMessage).toBe('');
      expect(component.safeCards).toEqual([]);
    });

    it('should have safeCards getter that handles null/undefined', () => {
      expect(component.safeCards).toEqual([]);
      
      component.cards = null as any;
      expect(component.safeCards).toEqual([]);
      
      component.cards = undefined as any;
      expect(component.safeCards).toEqual([]);
      
      component.cards = mockCards;
      expect(component.safeCards).toEqual(mockCards);
    });
  });

  describe('Currency Formatting', () => {
    it('should format currency correctly', () => {
      expect(component.formatCurrency(1000)).toBe('£1000.00');
      expect(component.formatCurrency(100)).toBe('£100.00');
      expect(component.formatCurrency(-50)).toBe('£-50.00');
      expect(component.formatCurrency(0)).toBe('£0.00');
      expect(component.formatCurrency(1234.56)).toBe('£1234.56');
    });
  });

  describe('Data Display and Rendering', () => {
    it('should display cards in table format with correct data', () => {
      component.cards = mockCards;
      fixture.detectChanges();
      
      const tableRows = fixture.nativeElement.querySelectorAll('tbody tr');
      expect(tableRows.length).toBe(2);
      
      // Verify first card data
      const firstRow = tableRows[0];
      expect(firstRow.textContent).toContain('Alice');
      expect(firstRow.textContent).toContain('4111 1111 1111 1111');
      expect(firstRow.textContent).toContain('£100.00');
      expect(firstRow.textContent).toContain('£1000.00');
      
      // Verify second card data
      const secondRow = tableRows[1];
      expect(secondRow.textContent).toContain('Bob');
      expect(secondRow.textContent).toContain('5500 0000 0000 0004');
      expect(secondRow.textContent).toContain('£-50.00');
      expect(secondRow.textContent).toContain('£500.00');
    });

    it('should show empty state when no cards are available', () => {
      component.cards = [];
      fixture.detectChanges();
      
      const emptyState = fixture.nativeElement.querySelector('.empty-state');
      expect(emptyState).toBeTruthy();
      expect(emptyState.textContent).toContain('The Credit Cards list is empty');
      
      const tableContainer = fixture.nativeElement.querySelector('.table-container');
      expect(tableContainer).toBeFalsy();
    });

    it('should apply correct CSS classes to table elements', () => {
      component.cards = mockCards;
      fixture.detectChanges();
      
      const cardNumberCells = fixture.nativeElement.querySelectorAll('.card-number');
      expect(cardNumberCells.length).toBe(2);
    });
  });

  describe('Visual Styling and CSS Classes', () => {
    it('should apply negative-balance class for negative balances', () => {
      component.cards = mockCards;
      fixture.detectChanges();
      
      const tableRows = fixture.nativeElement.querySelectorAll('tbody tr');
      const secondRow = tableRows[1]; // Bob's card with negative balance
      const balanceCell = secondRow.querySelector('td:nth-child(3)');
      
      expect(balanceCell.classList.contains('negative-balance')).toBeTrue();
      expect(balanceCell.textContent).toContain('£-50.00');
    });

    it('should apply positive-balance class for non-negative balances', () => {
      component.cards = mockCards;
      fixture.detectChanges();
      
      const tableRows = fixture.nativeElement.querySelectorAll('tbody tr');
      const firstRow = tableRows[0]; // Alice's card with positive balance
      const balanceCell = firstRow.querySelector('td:nth-child(3)');
      
      expect(balanceCell.classList.contains('positive-balance')).toBeTrue();
      expect(balanceCell.textContent).toContain('£100.00');
    });
  });

  describe('Loading and Error State Management', () => {
    it('should display error message when errorMessage is set', () => {
      component.errorMessage = 'Failed to load cards';
      fixture.detectChanges();
      
      const errorElement = fixture.nativeElement.querySelector('.alert-error');
      expect(errorElement).toBeTruthy();
      expect(errorElement.textContent).toContain('Failed to load cards');
      
      const tableContainer = fixture.nativeElement.querySelector('.table-container');
      expect(tableContainer).toBeFalsy();
    });
  });

  describe('Component Lifecycle and State Changes', () => {
    it('should log cards updates in ngOnChanges', () => {
      spyOn(console, 'log');
      
      component.cards = mockCards;
      component.ngOnChanges({
        cards: {
          currentValue: mockCards,
          previousValue: [],
          firstChange: true,
          isFirstChange: () => true
        }
      });
      
      expect(console.log).toHaveBeenCalledWith('Cards updated:', mockCards);
    });

    it('should handle empty cards array in ngOnChanges', () => {
      spyOn(console, 'log');
      
      component.cards = [];
      component.ngOnChanges({
        cards: {
          currentValue: [],
          previousValue: mockCards,
          firstChange: false,
          isFirstChange: () => false
        }
      });
      
      expect(console.log).toHaveBeenCalledWith('Cards updated:', []);
    });

    it('should handle null cards input in ngOnChanges', () => {
      spyOn(console, 'log');
      
      component.cards = null as any;
      component.ngOnChanges({
        cards: {
          currentValue: null,
          previousValue: mockCards,
          firstChange: false,
          isFirstChange: () => false
        }
      });
      
      expect(console.log).toHaveBeenCalledWith('Cards updated:', []);
    });
  });

  describe('Input Validation and Edge Cases', () => {
    it('should handle undefined cards input gracefully', () => {
      component.cards = undefined as any;
      fixture.detectChanges();
      
      expect(component.cards).toBeUndefined();
      expect(component.safeCards).toEqual([]);
      
      const tableContainer = fixture.nativeElement.querySelector('.table-container');
      expect(tableContainer).toBeFalsy();
      
      const emptyState = fixture.nativeElement.querySelector('.empty-state');
      expect(emptyState).toBeTruthy();
    });

    it('should handle null cards input gracefully', () => {
      component.cards = null as any;
      fixture.detectChanges();
      
      expect(component.cards).toBeNull();
      expect(component.safeCards).toEqual([]);
      
      const tableContainer = fixture.nativeElement.querySelector('.table-container');
      expect(tableContainer).toBeFalsy();
      
      const emptyState = fixture.nativeElement.querySelector('.empty-state');
      expect(emptyState).toBeTruthy();
    });

    it('should handle cards with extreme data values', () => {
      const extremeCards = [
        {
          id: 1,
          cardHolderName: 'Dr. John Jacob Jingleheimer Schmidt Jr. III',
          cardNumber: '4111111111111111',
          balance: 0,
          cardLimit: 0
        }
      ];
      
      component.cards = extremeCards;
      fixture.detectChanges();
      
      const tableRows = fixture.nativeElement.querySelectorAll('tbody tr');
      expect(tableRows.length).toBe(1);
      expect(tableRows[0].textContent).toContain('Dr. John Jacob Jingleheimer Schmidt Jr. III');
      expect(tableRows[0].textContent).toContain('£0.00');
    });
  });
});