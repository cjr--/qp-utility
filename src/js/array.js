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
  } else {
    return [];
  }
}

function reduce(o, fn, init) {
  return empty(o) ? undefined : o.reduce(fn, init);
}

function arg(o) { return slice.call(o); }

function to_array(o) {
  if (is_array(o)) {
    return o;
  } else if (o && has_key(o, 'length')) {
    return slice.call(o);
  } else if (typeof o === 'string') {
    return o.split('');
  } else if (typeof o === 'number') {
    return o === 0 ? [] : new Array(o);
  } else if (o) {
    return [o];
  } else {
    return [];
  }
}

function union() {
  return slice.call(arguments).reduce(function(output, input) {
    return to_array(output).concat(to_array(input));
  }, []);
}

function unique(o) {
  var unique = [];
  if (is_array(o)) {
    for (var i = 0, l = o.length; i < l; i++) {
      var item = o[i];
      if (unique.indexOf(item) === -1) unique.push(item);
    }
  }
  return unique;
}

function flatten() {
  function _flatten(items) {
    return items.reduce(function(output, input) {
      return any(input, is_array) ? output.concat(_flatten(input)) : output.concat(input);
    }, []);
  }
  var args = slice.call(arguments);
  return any(args, is_array) ? _flatten(args) : args;
}

function compact(array) {
  var index = -1;
  var length = array ? array.length : 0;
  var result = [];
  while (++index < length) {
    var value = array[index];
    if (value) {
      result.push(value);
    }
  }
  return result;
}

function clear(o) {
  if (is_array(o)) {
    for (var i = 0, l = o.length; i < l; i++) { o.pop(); }
  } else {
    for (var key in o) { if (o.hasOwnProperty(key)) { delete o[key]; } }
  }
  return o;
}

function push(o, value) {
  if (is_array(value)) {
    if (!is_array(o)) {
      o = value;
    } else {
      for (var i = 0, l = value.length; i < l; i++) { o.push(value[i]); }
    }
  } else if (value === undefined) {
    if (!is_array(o)) {
      o = [];
    }
  } else {
    if (!is_array(o)) {
      o = [ value ];
    } else {
      o.push(value);
    }
  }
  return o;
}

function load(o, value) {
  clear(o);
  push(o, value);
}
