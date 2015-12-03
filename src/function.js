function get_fn_name(fn) {
  if (fn.name) {
    return fn.name;
  } else {
    var fn_name_re = /function\s([^(]{1,})\(/;
    var results = fn_name_re.exec(fn.toString());
    return (results && results.length > 1) ? results[1].trim() : '';
  }
}

function combine() {
  var fns = slice.call(arguments);
  return function() {
    for (var i = 0, l = fns.length; i < l; i++) {
      fns[i].apply(null, arguments);
    }
  };
}

function done() {
  var args = arg(arguments);
  var type = qp_typeof(args[0]);
  if (type === 'object') {
    qp.invoke_next(args[0].done.bind(args[0].context || args[0].bind), args[1], args[2]);
  } else if (type === 'function') {
    qp.invoke_next(args[0].bind(args[1]), args[2], args[3]);
  }
  return null;
}

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
  } else if (is(fn, 'array')) {
    var args = array_slice.call(arguments, 2);
    return map(fn, function(func) { return func.apply(ctx, args); });
  }
  return undefined;
}

function invoke_after(fn, n, ctx) {
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
  return id;
}

function invoke_next(fn) {
  var args = rest(arguments);
  if (global.process && global.process.nextTick) {
    process.nextTick(fn.bind(null, args));
  } else {
    var id = setTimeout(function() {
      clearTimeout(id);
      fn.apply(null, args);
    }, 0);
  }
}

function invoke_when(fn, check, interval) {
  (function timer_event() {
    invoke_delay(interval || 500, function() {
      if (check()) {
        fn();
      } else {
        timer_event();
      }
    });
  })();
}
