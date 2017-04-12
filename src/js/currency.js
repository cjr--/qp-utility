function currency(code) {
  var lookup = {
    USD: { code: 'USD', name: 'Dollar', symbol: '$', decimals: 2, pow: 100 },
    EUR: { code: 'EUR', name: 'Euro', symbol: '€', decimals: 2, pow: 100 },
    GBP: { code: 'GBP', name: 'Pound', symbol: '£', decimals: 2, pow: 100 },
    JPY: { code: 'JPY', name: 'Yen', symbol: '¥', decimals: 0, pow: 0 },
    AUD: { code: 'AUD', name: 'Dollar', symbol: '$', decimals: 2, pow: 100 },
    CAD: { code: 'CAD', name: 'Dollar', symbol: '$', decimals: 2, pow: 100 },
    CHF: { code: 'CHF', name: 'Franc', symbol: 'Fr', decimals: 2, pow: 100 },
    CNY: { code: 'CNY', name: 'Yuan', symbol: '¥', decimals: 2, pow: 100 },
    RUB: { code: 'RUB', name: 'Ruble', symbol: '₽', decimals: 2, pow: 100 }
  };
  return lookup[code] ? lookup[code] : null;
}

function bankers_round(v, d) {
  d = d || 0;
  var m = Math.pow(10, d);
  var n = +(d ? v * m : v).toFixed(8);
  var i = Math.floor(n);
  var f = n - i;
  var e = 1e-8;
  var r = (f > 0.5 - e && f < 0.5 + e) ? ((i % 2 == 0) ? i : i + 1) : Math.round(n);
  return d ? r / m : r;
}

function calculate_precision(number) {
  var match = String(number).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
  if (!match) { return 0; }
  return Math.max(0, (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0));
}


function decimal(number, precision) {
  if (number instanceof Decimal) {
    return number.clone();
  } else {
    return new Decimal(number, precision);
  }
}

function Decimal(number, precision) {
  this.input = number;
  this.precision = (typeof precision === 'number' ? precision : calculate_precision(number));
  this.pow = Math.pow(10, this.precision);
  this.int_value = bankers_round(number * this.pow);
  this.value = this.int_value / this.pow;
}

Decimal.prototype.toString = function() { return this.value; };

Decimal.prototype.clone = function() {
  return new Decimal(this.input, this.precision);
};


function money(currency_code, value, locale) {
  if (currency_code instanceof Money) {
    return currency_code.clone();
  } else {
    return new Money(currency_code, value, locale);
  }
}

function Money(currency_code, value, locale) {
  this.input = value;
  this.locale = locale || navigator.language;
  this.currency = currency(currency_code);
  if (this.currency) {
    if (typeof value === 'string') {
      var sign = value.indexOf('-') !== -1 ? '-' : '';
      value = value.replace(/[^0-9.]/g, '');
      var parts = value.split('.');
      value = sign + (parts[0] || '0') + (this.currency.decimals ? '.' + (parts[1] || '0') : '');
      value = Number(value);
      this.int_value = Math.round(value * this.currency.pow);
    } else {
      this.int_value = bankers_round(value, this.currency.decimals) * this.currency.pow;
    }
    this.precision = this.currency.decimals;
    this.value = this.int_value / this.currency.pow;
    this.display = this.value.toLocaleString(this.locale, { style: 'currency', currency: this.currency.code });
  } else {
    this.precision = 0;
    this.int_value = this.value = 0;
    this.display = '0';
  }
}

Money.prototype.toString = function() { return this.display; };

Money.prototype.clone = function() {
  return new Money(this.currency.code, this.input, this.locale);
};

Money.prototype.add = function(value) {
  var money = value instanceof Money ? value : new Money(this.currency.code, value, this.locale);
  return new Money(this.currency.code, (this.int_value + money.int_value) / this.currency.pow, this.locale);
};

Money.prototype.subtract = function(value) {
  var money = value instanceof Money ? value : new Money(this.currency.code, value, this.locale);
  return new Money(this.currency.code, (this.int_value - money.int_value) / this.currency.pow, this.locale);
};

Money.prototype.divide = function(value) {
  var decimal = value instanceof Decimal ? value : new Decimal(value);
  return new Money(this.currency.code, bankers_round((this.value / decimal.value), this.precision), this.locale);
};

Money.prototype.multiply = function(value) {
  var decimal = value instanceof Decimal ? value : new Decimal(value);
  return new Money(this.currency.code, bankers_round(this.value * decimal.value, (this.precision + decimal.precision)), this.locale);
};
