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
    for (var i = 0, l = o.length, last = o.length - 1; i < l; i++) {
      if (fn.call(scope, o[i], i, last, o) === false) {
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
  } else if (is_array(o) || o.length) {
    var out0 = [];
    for (var i = 0, l = o.length, last = o.length - 1; i < l; i++) {
      out0.push(fn.call(scope, o[i], i, last, o));
    }
    return out0;
  } else if (is(o, 'object')) {
    var out1 = [];
    each_own(o, function(v, k, i, o) { out1.push(fn.call(scope, v, k, i, o)); });
    return out1;
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
