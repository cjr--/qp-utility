function assign() {
  var target = first(arguments);
  each(rest(arguments), function(source) {
    each(source, function(value, key) {
      if (typeof value !== 'undefined') {
        target[key] = value;
      }
    });
  });
  return target;
}

function assign_own() {
  var target = first(arguments);
  each(rest(arguments), function(source) {
    each_own(source, function(value, key) {
      if (typeof value !== 'undefined' && target.hasOwnProperty(key)) {
        target[key] = value;
      }
    });
  });
  return target;
}

function assign_if() {
  var target = first(arguments);
  each(rest(arguments), function(source) {
    var keys = Object.keys(target);
    each(source, function(value, key) {
      if (typeof value !== 'undefined' && keys.indexOf(key) == -1) {
        target[key] = value;
      }
    });
  });
  return target;
}
