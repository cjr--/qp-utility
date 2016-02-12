function select(items, fn, scope) {
  var out = [];
  var args = rest(arguments, 2);
  for (var i = 0, l = items.length; i < l; i++) {
    args[0] = items[i];
    var result = fn.apply(scope, args);
    if (result !== undefined) out.push(result);
  }
  return out;
}
