import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CreditCardService } from '../services/credit-card.service';

@Component({
  selector: 'app-add-card',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.css']
})
export class AddCardComponent {
  @Output() cardAdded = new EventEmitter();
  cardForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(private fb: FormBuilder) {
    this.cardForm = this.fb.group({
      cardHolderName: ['', [Validators.required, Validators.minLength(2)]],
      cardNumber: ['', [Validators.required, Validators.maxLength(19), Validators.minLength(13), AddCardComponent.luhnValidator]],
      cardLimit: ['', [Validators.required, Validators.min(0), Validators.pattern(/^\d+(\.\d{1,2})?$/)]]
    });
  }

  static luhnValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value ? control.value.replace(/\s+/g, '') : '';
    if (!value) return null;
    
    // Check if all characters are digits
    if (!/^\d+$/.test(value)) {
      return { invalidCardNumber: true };
    }
    
    let sum = 0;
    let shouldDouble = false;
    
    for (let i = value.length - 1; i >= 0; i--) {
      let digit = parseInt(value.charAt(i), 10);
      
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    
    return sum % 10 === 0 ? null : { luhn: true };
  }

  onSubmit() {
    if (this.cardForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';
      this.successMessage = '';
      
      // Emit the form data to parent component with callback for error handling
      this.cardAdded.emit({
        formData: this.cardForm.value,
        onSuccess: () => {
          this.isSubmitting = false;
          this.successMessage = 'Card added successfully!';
          this.cardForm.reset();
          setTimeout(() => this.successMessage = '', 3000);
        },
        onError: (error: string) => {
          this.isSubmitting = false;
          this.errorMessage = error || 'Failed to add card';
        }
      });
    }
  }

  getCardNumberErrorMessage(): string {
    const cardNumberControl = this.cardForm.get('cardNumber');
    if (cardNumberControl?.hasError('required')) {
      return 'Card number is required';
    }
    if (cardNumberControl?.hasError('minlength')) {
      return 'Card number must be at least 13 digits';
    }
    if (cardNumberControl?.hasError('maxlength')) {
      return 'Card number must be at most 19 digits';
    }
    if (cardNumberControl?.hasError('invalidCardNumber')) {
      return 'Card number must contain only digits';
    }
    if (cardNumberControl?.hasError('luhn')) {
      return 'Invalid card number (Luhn check failed)';
    }
    return '';
  }
}