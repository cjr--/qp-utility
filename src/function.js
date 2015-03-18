function bind(o, scope) {
  scope = scope || o;
  each(pick(o, function(v) { return is(v, 'function'); }), function(v, k) {
    o[k] = v.bind(scope);
  });
  return o;
}

function invoke(fn, ctx) {
  if (fn && is(fn, 'function')) {
    return fn.apply(ctx, array_slice.call(arguments, 2));
  }
  return undefined;
}

function invoke_after(n, fn, ctx) {
  var count = 0;
  return function() {
    if (++count === n) {
      fn.apply(ctx, arguments);
    }
  };
}

function invoke_delay(milli, fn) {
  var args = rest(arguments, 2);
  var id = setTimeout(function() {
    clearTimeout(id);
    fn.apply(null, args);
  }, milli);
}
