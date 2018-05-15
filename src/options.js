function qp_options(_options, defaults) {
  if (is(_options, 'object') && is(defaults, 'object')) {
    each_own(defaults, function(v, k) {
      if (not_defined(_options[k])) {
        _options[k] = defaults[k];
      }
    });
  } else {
    _options = defaults || _options || {};
  }
  return _options;
}
