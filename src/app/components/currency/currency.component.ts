import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-currency',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss'],
})
export class CurrencyComponent implements OnInit {
  amount = 1;
  fromCurrency = 'USD';
  toCurrency = 'INR';
  result = 0;
  rates: any = {};

  currencies = [
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
    { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
    { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳' },
    { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
    { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' },
    { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭' },
    { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳' },
    { code: 'MXN', name: 'Mexican Peso', flag: '🇲🇽' },
    { code: 'BRL', name: 'Brazilian Real', flag: '🇧🇷' },
    { code: 'KRW', name: 'South Korean Won', flag: '🇰🇷' },
  ];

  // Replace with your key from https://exchangerate-api.com
  private API_KEY = '0644c7e2cb5d6c19790def72';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.rates = {
      USD: 1,
      EUR: 0.92,
      GBP: 0.79,
      JPY: 149.5,
      INR: 83.12,
      AUD: 1.53,
      CAD: 1.36,
      CHF: 0.89,
      CNY: 7.24,
      MXN: 17.05,
      BRL: 4.97,
      KRW: 1325,
    };
    this.convert();

    this.http.get(`https://v6.exchangerate-api.com/v6/${this.API_KEY}/latest/USD`).subscribe({
      next: (data: any) => {
        if (data?.conversion_rates) {
          this.rates = data.conversion_rates;
          this.convert();
        }
      },
      error: () => {}, // use static rates
    });
  }

  convert() {
    if (!this.rates[this.fromCurrency] || !this.rates[this.toCurrency]) return;
    this.result = (this.amount / this.rates[this.fromCurrency]) * this.rates[this.toCurrency];
  }

  swap() {
    [this.fromCurrency, this.toCurrency] = [this.toCurrency, this.fromCurrency];
    this.convert();
  }

  getFlag(code: string): string {
    return this.currencies.find((c) => c.code === code)?.flag || '';
  }

  getRate(): string {
    if (!this.rates[this.fromCurrency] || !this.rates[this.toCurrency]) return '—';
    return (this.rates[this.toCurrency] / this.rates[this.fromCurrency]).toFixed(4);
  }

  getPopularPairs() {
    const pairs = [
      ['USD', 'EUR'],
      ['USD', 'GBP'],
      ['USD', 'JPY'],
      ['USD', 'INR'],
      ['EUR', 'GBP'],
      ['GBP', 'JPY'],
    ];
    return pairs.map(([from, to]) => ({
      from,
      to,
      rate: (this.rates[to] / this.rates[from]).toFixed(4),
      fromFlag: this.getFlag(from),
      toFlag: this.getFlag(to),
    }));
  }
}
