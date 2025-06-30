export interface CreditCard {
    id?: number;
    cardHolderName: string;
    cardNumber: string;
    balance: number;
    cardLimit: number;
  }
  
  export interface CreditCardRequest {
    cardHolderName: string;
    cardNumber: string;
    cardLimit: number;
  }
  
  export interface ApiResponse<T> {
    data?: T;
    error?: string;
    status: number;
  }