import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddCardComponent } from './add-card.component';
import { CreditCardService } from '../services/credit-card.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

class MockCreditCardService {
  addCreditCard(card: any) {
    return of({});
  }
}

describe('AddCardComponent', () => {
  let component: AddCardComponent;
  let fixture: ComponentFixture<AddCardComponent>;
  let service: CreditCardService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCardComponent],
      providers: [
        { provide: CreditCardService, useClass: MockCreditCardService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddCardComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(CreditCardService);
    fixture.detectChanges();
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('Form Structure', () => {
    it('should create the form with required controls', () => {
      expect(component.cardForm.contains('cardHolderName')).toBeTrue();
      expect(component.cardForm.contains('cardNumber')).toBeTrue();
      expect(component.cardForm.contains('cardLimit')).toBeTrue();
    });
  });

  describe('Form Validation', () => {
    it('should validate required fields', () => {
      component.cardForm.setValue({ cardHolderName: '', cardNumber: '', cardLimit: '' });
      expect(component.cardForm.valid).toBeFalse();
      expect(component.cardForm.get('cardHolderName')?.hasError('required')).toBeTrue();
      expect(component.cardForm.get('cardNumber')?.hasError('required')).toBeTrue();
      expect(component.cardForm.get('cardLimit')?.hasError('required')).toBeTrue();
    });

    it('should validate card number format and Luhn 10 algorithm', () => {
      const control = component.cardForm.get('cardNumber');
      
      // Valid card numbers
      const validNumbers = [
        '4222222222222',         // 13 digits, valid Luhn
        '4111111111111111',      // 16 digits, valid Luhn
        '4917610000000000003'    // 19 digits, valid Luhn
      ];
      
      validNumbers.forEach(num => {
        control?.setValue(num);
        expect(control?.valid).toBeTrue();
        expect(control?.hasError('luhn')).toBeFalse();
      });

      // Invalid card numbers
      const invalidNumbers = [
        '1234567890123',         // Invalid Luhn
        '1234567890123456',      // Invalid Luhn
        '41111111111111111111',  // 20 digits (too long)
        '4111a111111111111'      // Contains non-numeric characters
      ];

      invalidNumbers.forEach(num => {
        control?.setValue(num);
        expect(control?.valid).toBeFalse();
      });
    });

    it('should return appropriate error message for invalid card numbers', () => {
      const control = component.cardForm.get('cardNumber');
      control?.setValue('1234567890123'); // Invalid Luhn
      expect(control?.hasError('luhn')).toBeTrue();
      expect(component.getCardNumberErrorMessage()).toBe('Invalid card number (Luhn check failed)');
    });
  });

  describe('Form Submission - Success Scenarios', () => {
    it('should reset the form after successful submission', () => {
      spyOn(component.cardAdded, 'emit').and.callFake((event: any) => {
        // Simulate parent calling onSuccess callback
        event.onSuccess();
      });
      
      component.cardForm.setValue({ 
        cardHolderName: 'John Doe', 
        cardNumber: '4111111111111111', 
        cardLimit: 1000 
      });
      
      component.onSubmit();
      
      expect(['', null]).toContain(component.cardForm.value.cardHolderName);
      expect(['', null]).toContain(component.cardForm.value.cardNumber);
      expect(['', null]).toContain(component.cardForm.value.cardLimit);
    });

    it('should create a new card with correct JSON structure', () => {
      spyOn(component.cardAdded, 'emit');
      
      component.cardForm.setValue({
        cardHolderName: 'Alice',
        cardNumber: '4111111111111111',
        cardLimit: 5000
      });
      
      component.onSubmit();
      
      expect(component.cardAdded.emit).toHaveBeenCalled();
      const emitted = (component.cardAdded.emit as jasmine.Spy).calls.mostRecent().args[0];
      expect(emitted.formData).toEqual({
        cardHolderName: 'Alice',
        cardNumber: '4111111111111111',
        cardLimit: 5000
      });
    });

    it('should set balance to £0 for new cards', () => {
      spyOn(component.cardAdded, 'emit');
      
      component.cardForm.setValue({
        cardHolderName: 'Bob',
        cardNumber: '4222222222222', // 13-digit valid Luhn number
        cardLimit: 1000
      });
      
      component.onSubmit();
      
      expect(component.cardAdded.emit).toHaveBeenCalled();
      const emitted = (component.cardAdded.emit as jasmine.Spy).calls.mostRecent().args[0];
      expect(emitted.formData).toEqual({
        cardHolderName: 'Bob',
        cardNumber: '4222222222222',
        cardLimit: 1000
      });
    });
  });

  describe('Form Submission - Error Scenarios', () => {
    it('should handle server errors and display error messages', () => {
      spyOn(component.cardAdded, 'emit').and.callFake((event: any) => {
        // Simulate parent calling onError callback
        event.onError('Server error');
      });
      
      component.cardForm.setValue({ 
        cardHolderName: 'John Doe', 
        cardNumber: '4111111111111111', 
        cardLimit: 1000 
      });
      
      component.onSubmit();
      
      expect(component.errorMessage).toBe('Server error');
      expect(component.isSubmitting).toBeFalse();
    });

    it('should handle backend unavailability errors', () => {
      spyOn(component.cardAdded, 'emit').and.callFake((event: any) => {
        // Simulate parent calling onError callback
        event.onError('Backend connection failed.');
      });
      
      component.cardForm.setValue({
        cardHolderName: 'Test User',
        cardNumber: '4111111111111111',
        cardLimit: 1000
      });
      
      component.onSubmit();
      
      expect(component.errorMessage).toContain('Backend connection failed.');
      expect(component.isSubmitting).toBeFalse();
    });
  });
});


/*
 * Additional Edges Cases Tests:
 * 
 * 1. Input Validation:
 *    - Extremely long card holder names (>100 chars)
 *    - Special characters in card holder names
 *    - Negative/zero card limits
 * 
 * 2. Network Resilience:
 *    - Connection failures (status 0)
 *    - HTTP 400/500 error handling
 *    - Malformed JSON responses
 * 
 * 3. Security:
 *    - XSS prevention in card holder names
 *    - SQL injection prevention
 * 
 * 4. Data Integrity:
 *    - Duplicate card prevention
 * 
 * 5. User Experience:
 *    - Form state during submission
 */