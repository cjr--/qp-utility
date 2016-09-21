function size(o) {
  if (empty(o)) {
    return 0;
  } else if (is_array(o)) {
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

function map(o, fn, scope) {
  if (empty(o)) {
    return [];
  } else if (is_array(o)) {
    return o.map(fn, scope);
  } else if (o.length) {
    var out = [];
    for (var i = 0, l = o.length; i < l; i++) {
      out.push(fn.call(scope, o[i]));
    }
    return out;
  } else if (is(o, 'object')) {
    var out = [];
    each_own(o, function(item) { out.push(fn.call(scope, item)); });
    return out;
  } else {
    return [];
  }
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
