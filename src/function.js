function bind(o, scope) {
  scope = scope || o;
  each(pick(o, function(v) { return is(v, 'function'); }), function(v, k) {
    o[k] = v.bind(scope);
  });
  return o;
}

function invoke(fn, ctx) {
  if (is(fn, 'function')) {
    return fn.apply(ctx, array_slice.call(arguments, 2));
  } else if (is(fn, 'array')) {
    var args = array_slice.call(arguments, 2);
    return map(fn, function(func) { return func.apply(ctx, args); });
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

function invoke_next(fn) {
  if (global.process && global.process.nextTick) {
    process.nextTick(fn);
  } else {
    setTimeout(fn, 0);
  }
}
