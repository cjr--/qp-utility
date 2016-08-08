var alpha_numeric_re = /^[a-z0-9]+$/i;

function is_alpha_numeric(s) {
  return alpha_numeric_re.test(s);
}

function is_length(s, l0, l1) {
  if (is(s, 'string')) {
    if (arguments.length === 2) {
      return s.length === l0;
    } else if (arguments.length === 3) {
      return s.length >= l0 && s.length <= l1;
    }
  }
  return false;
}
