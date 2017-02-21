function currency(o, currency, locale) {
  var value = currency_value(o);
  return value.toLocaleString(locale || 'en-GB', { style: 'currency', currency: currency || 'GBP' });
}

function currency_value(o) {
  return Number(String(o).replace(/[^0-9.]/g, ''));
}
