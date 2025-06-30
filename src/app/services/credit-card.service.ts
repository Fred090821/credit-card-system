import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { CreditCard, CreditCardRequest } from '../models/credit-card.model';

@Injectable({
  providedIn: 'root'
})
export class CreditCardService {
  private apiUrl = 'http://localhost:8080/api/credit-cards';

  constructor(private http: HttpClient) {}

  getAllCreditCards(): Observable<CreditCard[]> {
    console.log("API URL :: " + this.apiUrl);
    return this.http.get<CreditCard[]>(this.apiUrl).pipe(
      map((response: any) => response.data || response),
      catchError(this.handleConnectionError)
    );
  }

  addCreditCard(card: CreditCardRequest): Observable<any> {
    // Convert numbers to strings for BigDecimal precision on backend
    const requestData = {
      cardHolderName: card.cardHolderName,
      cardNumber: card.cardNumber,
      cardLimit: card.cardLimit.toString() // Convert to string for BigDecimal
    };

    return this.http.post(this.apiUrl, requestData).pipe(
      catchError(this.handleConnectionError)
    );
  }

  private handleConnectionError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 0) {
      console.error('Connection failed:', error);
      return throwError(() => new Error('Backend connection failed. Check: 1) Server running 2) CORS enabled 3) Network'));
    }
    return throwError(() => error); // Pass through other errors
  }
}

