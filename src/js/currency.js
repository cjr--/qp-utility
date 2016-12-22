function currency(n, currency, locale) {
  return Number(n).toLocaleString(locale || 'en-GB', { style: 'currency', currency: currency || 'GBP' });
}
