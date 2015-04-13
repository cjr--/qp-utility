function map(o, fn, scope) { return o.map(fn, scope); }

function reduce(o, fn, init) { return is_empty(o) ? undefined : o.reduce(fn, init); }

function arg(o) { return array_slice.call(o); }

function to_array(o) {
  if (is_array(o)) {
    return o;
  } else if (o && o.length) {
    return array_slice.call(o);
  } else if (typeof o === 'string') {
    return o.split('');
  } else if (o) {
    return [o];
  } else {
    return [];
  }
}

function union() {
  return slice.call(arguments).reduce(function(output, input) {
    return output.concat(input);
  }, []);
}

function flatten() {
  function _flatten(items) {
    return items.reduce(function(output, input) {
      return input.some(is_array) ? output.concat(flatten(input)) : output.concat(input);
    }, []);
  }
  var args = slice.call(arguments);
  return args.some(is_array) ? _flatten(args) : args;
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
