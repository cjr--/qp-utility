function pick(source, o) {
  var target = { };
  if (is(o, 'array')) {
    each(o, function(k) { if (source.hasOwnProperty(k)) target[k] = source[k]; });
  } else if (is(o, 'function')) {
    each_own(source, function(v, k) { if (o(v, k, i)) target[k] = v; });
  }
  return target;
}
