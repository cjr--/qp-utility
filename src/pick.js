function pick(source, o) {
  var target = { };
  if (is(source, 'object')) {
    if (is(o, 'array')) {
      each(o, function(k) { if (source.hasOwnProperty(k)) target[k] = source[k]; });
    } else if (is(o, 'function')) {
      each_own(source, function(v, k) { if (o(v, k, i)) target[k] = v; });
    } else if (is(o, 'string')) {
      if (arguments.length === 2) {
        return pick(source, o.split(','));
      } else {
        return pick(source, rest(arguments));
      }
    }
  }
  return target;
}
