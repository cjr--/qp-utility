function reduce(o, fn, init) {
  return is(o, 'array') ? o.reduce(fn, init) : undefined;
}

function arg(o) { return slice.call(o); }

function to_array(o) {
  if (is_array(o)) {
    return o;
  } else if (o && o['length']) {
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

function unique(o, fn) {
  var unique = [];
  if (is_array(o)) {
    fn = fn || function(items, item) { return items.indexOf(item) === -1; };
    for (var i = 0, l = o.length; i < l; i++) {
      var item = o[i];
      if (fn(unique, item)) unique.push(item);
    }
  }
  return unique;
}

function flatten() {
  function _flatten(items) {
    return reduce(items, function(output, input) {
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
