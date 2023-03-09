import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ICurrency } from 'src/app/models/currency';
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
export class ProductComponent implements OnInit {
  loading = false;

  options: Array<{ title: string; value: string }> = [
    { title: 'USD', value: Currency.USD },
    { title: 'EUR', value: Currency.EUR },
    { title: 'UAH', value: Currency.UAH },
  ];

  currency: { data: { [key: string]: ICurrency } };
  uahRation: { data: { [key: string]: ICurrency } };

  constructor(public ConfigService: ConfigService) {}

  form = new FormGroup({
    fromValue: new FormControl(),
    toValue: new FormControl(),
    fromCurrency: new FormControl(Currency.USD),
    toCurrency: new FormControl(Currency.UAH),
  });

  ngOnInit() {
    this.loading = true;
    this.getUahRatio();

    this.form.controls.fromCurrency.valueChanges.subscribe((value) => {
      if (value) {
        this.getCurrencies(value).then((result) => {
          if (value) {
            this.currency = result;
            const fromValue = Number(this.form.controls.fromValue.value);
            const toCurrency = this.form.controls.toCurrency.value!;
            this.form.controls.toValue.setValue(
              (fromValue * this.currency.data[toCurrency].value).toFixed(2)
            );
          }
        });
      }
    });

    this.form.controls.toCurrency.valueChanges.subscribe((value) => {
      const fromValue = Number(this.form.controls.fromValue.value);
      const toCurrency = this.form.controls.toCurrency.value!;
      this.form.controls.toValue.setValue(
        (fromValue * this.currency.data[toCurrency].value).toFixed(2)
      );
    });

    this.getCurrencies(Currency.USD).then((result) => {
      this.currency = result;
    });
  }

  updateToValue() {
    const currency = this.form.controls.toCurrency.value;
    const toValue = this.form.controls.toValue.value;
    if (currency) {
      this.form.controls.fromValue.setValue(
        (Number(toValue) / this.currency.data[currency].value).toFixed(2)
      );
    }
  }

  updateFromValue() {
    const currency = this.form.controls.toCurrency.value;
    const fromValue = this.form.controls.fromValue.value;
    if (currency) {
      this.form.controls.toValue.setValue(
        (fromValue * this.currency.data[currency].value).toFixed(2)
      );
    }
  }

  private getCurrencies(currency: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ConfigService.getCurrencies(currency).subscribe((data) => {
        resolve(data);
      });
    });
  }

  private getUahRatio() {
    this.ConfigService.getCurrencies(Currency.UAH).subscribe((data) => {
      this.uahRation = data;
      this.loading = false;
    });
  }
}
