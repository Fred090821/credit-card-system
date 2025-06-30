import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CreditCardService } from './services/credit-card.service';
import { of, throwError } from 'rxjs';

describe('AppComponent', () => {
  let creditCardServiceSpy: jasmine.SpyObj<CreditCardService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('CreditCardService', ['getAllCreditCards', 'addCreditCard']);
    await TestBed.configureTestingModule({
      imports: [AppComponent, HttpClientTestingModule],
      providers: [{ provide: CreditCardService, useValue: spy }]
    }).compileComponents();
    creditCardServiceSpy = TestBed.inject(CreditCardService) as jasmine.SpyObj<CreditCardService>;
  });

  // 1. Basic component initialization
  it('should create and initialize the component', () => {
    creditCardServiceSpy.getAllCreditCards.and.returnValue(of([]));
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
    expect(creditCardServiceSpy.getAllCreditCards).toHaveBeenCalled();
  });

  // 2. Successful card loading
  it('should load and display cards', () => {
    const mockCards = [{ id: 1, cardHolderName: 'Test', cardNumber: '4111111111111111', balance: 0, cardLimit: 1000 }];
    creditCardServiceSpy.getAllCreditCards.and.returnValue(of(mockCards));
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.cards).toEqual(mockCards);
  });

  // 3. Successful card addition
  it('should add a new card and refresh list', () => {
    creditCardServiceSpy.getAllCreditCards.and.returnValue(of([]));
    creditCardServiceSpy.addCreditCard.and.returnValue(of({}));
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    
    component.onCardAdded({
      formData: { cardHolderName: 'Test', cardNumber: '4111111111111111', cardLimit: 1000 },
      onSuccess: () => {},
      onError: () => {}
    });
    
    expect(creditCardServiceSpy.addCreditCard).toHaveBeenCalled();
    expect(creditCardServiceSpy.getAllCreditCards).toHaveBeenCalledTimes(2);
  });

  // 4. API error handling
  it('should handle service errors gracefully', () => {
    creditCardServiceSpy.getAllCreditCards.and.returnValue(throwError(() => new Error('Server down')));
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.isLoading).toBeFalse();
    expect(component.cards).toEqual([]);
  });
});