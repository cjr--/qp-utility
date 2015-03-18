function size(o) {
  if (is_array(o)) {
    return o.length;
  } else {
    return Object.keys(o).length;
  }
}

function each(o, fn, scope) {
  var no_exit = true;
  if (is_array(o)) {
    for (var i = 0, l = o.length; i < l; i++) {
      if (fn.call(scope, o[i], i, o) === false) {
        no_exit = false;
        break;
      }
    }
  } else {
    var index = 0;
    for (var key in o) {
      if (fn.call(scope, o[key], key, index++, o) === false) {
        no_exit = false;
        break;
      }
    }
  }
  return no_exit;
}

function each_own(o, fn, scope) {
  var no_exit = true;
  var index = 0;
  for (var key in o) {
    if (o.hasOwnProperty(key)) {
      if (fn.call(scope, o[key], key, index++, o) === false) {
        no_exit = false;
        break;
      }
    }
  }
  return no_exit;
}

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
