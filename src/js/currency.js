function currency(n, currency, locale) {
  var value = Number(String(n).replace(/[^0-9.]/g, ''));
  return value.toLocaleString(locale || 'en-GB', { style: 'currency', currency: currency || 'GBP' });
}
