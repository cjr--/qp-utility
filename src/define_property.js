function define_property(target, key, on_change) {
  var value = target[key];
  if (delete target[key]) {
    Object.defineProperty(target, key, {
      enumerable: true,
      configurable: true,
      get: function() { return value; },
      set: function(new_value) {
        var old_value = value;
        value = new_value;
        on_change.call(target, key, new_value, old_value);
      }
    });
  }
}
