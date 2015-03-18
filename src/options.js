function options(_options, defaults) {
  if (is(_options, 'object') && is(defaults, 'object')) {
    each_own(defaults, function(v, k) {
      if (is(_options[k], 'undefined')) {
        _options[k] = defaults[k];
      }
    });
  } else {
    _options = defaults || _options || {};
  }
  return _options;
}
