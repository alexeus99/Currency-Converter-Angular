import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ICurrency } from '../models/currency';
import { delay, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  constructor(private http: HttpClient) {}

  currencies: ICurrency[] = [];

  getCurrencies(base_currency: string): Observable<{
    data: { USD: ICurrency; EUR: ICurrency; UAH: ICurrency };
  }> {
    return this.http.get<{
      data: { USD: ICurrency; EUR: ICurrency; UAH: ICurrency };
    }>(
      `https://api.currencyapi.com/v3/latest?apikey=WAvLWG0yNxXV9xv5eLS6H3PLXCOKoRfTXuQh5T0b&currencies=EUR%2CUSD%2CUAH&base_currency=${base_currency}`
      
    );
  }
}
