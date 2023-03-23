import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { forkJoin, Subscription } from 'rxjs';
import { ICurrencyData } from 'src/app/models';
import { ConfigService } from 'src/app/services/currency.service';

enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  UAH = 'UAH',
}

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit, OnDestroy {
  public loading: boolean = false;

  public currency: ICurrencyData;
  public uahRation: ICurrencyData;

  public readonly options: Array<{ value: string }> = [
    { value: Currency.USD },
    { value: Currency.EUR },
    { value: Currency.UAH },
  ];

  public form = new FormGroup({
    fromValue: new FormControl(),
    toValue: new FormControl(),
    fromCurrency: new FormControl(Currency.USD),
    toCurrency: new FormControl(Currency.UAH),
  });

  //subscriptions
  private _fromCurrency$: Subscription;
  private _toCurrency$: Subscription;
  private _fromValue$: Subscription;
  private _toValue$: Subscription;

  constructor(
    public ConfigService: ConfigService
  ) { }

  ngOnInit() {
    this.initRatio();

    this._fromCurrency$ = this.form.controls.fromCurrency.valueChanges.subscribe(value => {
      if (value) this.ConfigService.getCurrencies(value).subscribe(result => {
        this.currency = result;
        this.calculateToCurrency();
      });
    });

    this._toCurrency$ = this.form.controls.toCurrency.valueChanges.subscribe(_ => {
      this.calculateToCurrency();
    });

    this._fromValue$ = this.form.controls.fromValue.valueChanges.subscribe(_ => {
      this.updateFromValue();
    });

    this._toValue$ = this.form.controls.toValue.valueChanges.subscribe(_ => {
      this.updateToValue();
    });
  }

  private initRatio(): void {
    this.loading = true;

    forkJoin({
      usdRatio: this.ConfigService.getCurrencies(Currency.USD),
      uahRatio: this.ConfigService.getCurrencies(Currency.UAH)
    }).subscribe({
      next: res => {
        if (res.usdRatio) this.currency = res.usdRatio;
        if (res.uahRatio) this.uahRation = res.uahRatio;
        this.loading = false;
      },
      error: _ => {
        this.loading = false;
      }
    });
  }

  private calculateToCurrency(): void {
    const fromValue = Number(this.form.controls.fromValue.value);
    const toCurrency = this.form.controls.toCurrency.value!;
    this.form.controls.toValue.setValue((fromValue * this.currency.data[toCurrency].value).toFixed(2));
  }

  private updateToValue(): void {
    const currency = this.form.controls.toCurrency.value;
    const toValue = this.form.controls.toValue.value;
    if (currency) {
      this.form.controls.fromValue.setValue((Number(toValue) / this.currency.data[currency].value).toFixed(2), { emitEvent: false });
    }
  }

  private updateFromValue(): void {
    const currency = this.form.controls.toCurrency.value;
    const fromValue = this.form.controls.fromValue.value;
    if (currency) {
      this.form.controls.toValue.setValue((fromValue * this.currency.data[currency].value).toFixed(2), { emitEvent: false });
    }
  }

  ngOnDestroy(): void {
    this._fromCurrency$.unsubscribe();
    this._toCurrency$.unsubscribe();
    this._fromValue$.unsubscribe();
    this._toValue$.unsubscribe();
  }
}
