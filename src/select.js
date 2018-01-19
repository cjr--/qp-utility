function select(items, fn, scope) {
  var out = [];
  if (is_array(items)) {
    var args = rest(arguments, 2);
    for (var i = 0, l = items.length; i < l; i++) {
      args[0] = items[i];
      var result = fn.apply(scope, args);
      if (result !== undefined) push(out, result);
    }
  }
  return out;
}
