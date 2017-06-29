var currency_definitions = [
  { id: 1,  code: 'USD', name: 'US Dollar',           unit: 'dollar', symbol: '$',  fa: 'usd',    decimals: 2 },
  { id: 2,  code: 'EUR', name: 'Euro',                unit: 'euro',   symbol: '€',  fa: 'eur',    decimals: 2 },
  { id: 3,  code: 'JPY', name: 'Japanese Yen',        unit: 'yen',    symbol: '¥',  fa: 'jpy',    decimals: 0 },
  { id: 4,  code: 'GBP', name: 'Pound Sterling',      unit: 'pound',  symbol: '£',  fa: 'gbp',    decimals: 2 },
  { id: 5,  code: 'AUD', name: 'Australian Dollar',   unit: 'dollar', symbol: '$',  fa: 'dollar', decimals: 2 },
  { id: 6,  code: 'CAD', name: 'Canadian Dollar',     unit: 'dollar', symbol: '$',  fa: 'dollar', decimals: 2 },
  { id: 7,  code: 'CHF', name: 'Swiss Franc',         unit: 'franc',  symbol: 'Fr', fa: '',       decimals: 2 },
  { id: 8,  code: 'CNY', name: 'Chineese Yuan',       unit: 'yuan',   symbol: '¥',  fa: 'cny',    decimals: 2 },
  { id: 9,  code: 'SEK', name: 'Swedish Krona',       unit: 'krona',  symbol: 'kr', fa: '',       decimals: 2 },
  { id: 10, code: 'NZD', name: 'New Zealand Dollar',  unit: 'dollar', symbol: '$',  fa: 'dollar', decimals: 2 },
  { id: 11, code: 'MXN', name: 'Mexican Peso',        unit: 'peso',   symbol: '$',  fa: 'dollar', decimals: 2 },
  { id: 12, code: 'SGD', name: 'Singapore Dollar',    unit: 'dollar', symbol: '$',  fa: 'dollar', decimals: 2 },
  { id: 13, code: 'HKD', name: 'Hong Kong Dollar',    unit: 'dollar', symbol: '$',  fa: 'dollar', decimals: 2 },
  { id: 14, code: 'NOK', name: 'Norwegian Krone',     unit: 'krone',  symbol: 'kr', fa: '',       decimals: 2 },
  { id: 15, code: 'KRW', name: 'South Korean Won',    unit: 'won',    symbol: '₩',  fa: 'krw',    decimals: 0 },
  { id: 16, code: 'TRY', name: 'Turkish Lira',        unit: 'lira',   symbol: '₺',  fa: 'try',    decimals: 2 },
  { id: 17, code: 'RUB', name: 'Russian Ruble',       unit: 'ruble',  symbol: '₽',  fa: 'rub',    decimals: 2 },
  { id: 18, code: 'INR', name: 'Indian Rupee',        unit: 'rupee',  symbol: '₹',  fa: 'inr',    decimals: 2 },
  { id: 19, code: 'BRL', name: 'Brazilian Real',      unit: 'real',   symbol: 'R$', fa: '',       decimals: 2 },
  { id: 20, code: 'ZAR', name: 'South African Rand',  unit: 'rand',   symbol: 'R',  fa: '',       decimals: 2 },
  { id: 21, code: 'THB', name: 'Thai Baht',           unit: 'baht',   symbol: '฿',  fa: '',       decimals: 2 }
];

var currency_lookup = { };
each(currency_definitions, function(currency) {
  currency.display = currency.code + ' - ' + currency.symbol + ' - ' + currency.name;
  currency.pow = Math.pow(10, currency.decimals);
  currency_lookup[currency.code] = currency;
});

function currency_list() {
  return clone(currency_definitions);
}

function currency(code) {
  return currency_lookup[code] ? currency_lookup[code] : null;
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

function Money(currency_code, value, o) {
  o = qp_options(o, { locale: navigator.language });
  this.input = value;
  this.locale = o.locale;
  if (is(currency_code, 'string')) {
    this.currency = currency(currency_code);
  } else if (is(currency_code, 'object')) {
    this.currency = currency_code;
  }
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
    this.entry = this.value.toLocaleString(this.locale, {
      style: 'decimal',
      minimumFractionDigits: this.currency.decimals,
      maximumFractionDigits: this.currency.decimals
    });
  } else {
    this.precision = 0;
    this.int_value = this.value = 0;
    this.entry = this.display = '0';
  }
}

Money.prototype.toString = function() { return this.display; };

Money.prototype.clone = function() {
  return new Money(this.currency, this.input, this.locale);
};

Money.prototype.add = function(value) {
  var money = value instanceof Money ? value : new Money(this.currency, value, this.locale);
  return new Money(this.currency, (this.int_value + money.int_value) / this.currency.pow, this.locale);
};

Money.prototype.subtract = function(value) {
  var money = value instanceof Money ? value : new Money(this.currency, value, this.locale);
  return new Money(this.currency, (this.int_value - money.int_value) / this.currency.pow, this.locale);
};

Money.prototype.divide = function(value) {
  var decimal = value instanceof Decimal ? value : new Decimal(value);
  return new Money(this.currency, bankers_round((this.value / decimal.value), this.precision), this.locale);
};

Money.prototype.multiply = function(value) {
  var decimal = value instanceof Decimal ? value : new Decimal(value);
  return new Money(this.currency, bankers_round(this.value * decimal.value, (this.precision + decimal.precision)), this.locale);
};
