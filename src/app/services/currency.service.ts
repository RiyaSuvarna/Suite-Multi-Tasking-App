// src/app/services/currency.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  // Sign up free at https://exchangerate-api.com to get your API key
  private API_KEY = 'YOUR_EXCHANGERATE_API_KEY';
  private BASE_URL = 'https://v6.exchangerate-api.com/v6';

  constructor(private http: HttpClient) {}

  getRates(baseCurrency: string): Observable<any> {
    return this.http.get(
      `${this.BASE_URL}/${this.API_KEY}/latest/${baseCurrency}`
    );
  }

  // Fallback static rates if no API key yet (approximate values)
  getStaticRates(): any {
    return {
      USD: 1, EUR: 0.92, GBP: 0.79, JPY: 149.50,
      INR: 83.12, AUD: 1.53, CAD: 1.36, CHF: 0.89,
      CNY: 7.24, MXN: 17.05, BRL: 4.97, KRW: 1325
    };
  }
}
