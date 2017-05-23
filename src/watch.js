function watch(target, on_change) {
  each_own(target, function(value, key) {
    watch_property(target, key, on_change);
    if (is(value, 'object')) watch(value, on_change);
  });
  return target;
}

function unwatch(target) {
  each_own(target, function(value, key) {
    unwatch_property(target, key);
    if (is(value, 'object')) unwatch(value);
  });
  return target;
}

function watch_property(target, key, on_change) {
  var value = target[key];
  if (delete target[key]) {
    Object.defineProperty(target, key, {
      enumerable: true,
      configurable: true,
      get: function() { return value; },
      set: function(new_value) {
        var old_value = value;
        if (qp.is(new_value, 'object')) watch(new_value, on_change);
        value = new_value;
        on_change.call(target, key, new_value, old_value);
      }
    });
  }
}

function unwatch_property(target, key) {
  var value = target[key];
  delete target[key];
  target[key] = value;
}
