function collect(items, fn, scope) {
  var out = [];
  for (var i = 0, l = items.length; i < l; i++) {
    fn.call(scope, items[i], out);
  }
  return out;
}
