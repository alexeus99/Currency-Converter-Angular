import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ICurrencyData } from 'src/app/models';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private readonly _key = 'WAvLWG0yNxXV9xv5eLS6H3PLXCOKoRfTXuQh5T0b';

  constructor(
    private http: HttpClient
  ) { }

  public getCurrencies(base_currency: string): Observable<ICurrencyData> {
    return this.http.get<ICurrencyData>(`https://api.currencyapi.com/v3/latest?apikey=${this._key}&currencies=EUR%2CUSD%2CUAH&base_currency=${base_currency}`);
  }
}
