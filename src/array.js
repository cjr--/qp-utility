function reduce(o, fn, init) {
  return is(o, 'array') ? o.reduce(fn, init) : undefined;
}

function arg(o) { return slice.call(o); }

function to_array(o, copy) {
  if (is_array(o)) {
    return copy ? o.slice(0) : o;
  } else if (typeof o === 'function') {
    return [o];
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

function csv() {
  return compact(arguments).join(',');
}

function zip(keys, values) {
  var zipped = {};
  if (is_array(keys) && is_array(values)) {
    for (var i = 0, l = Math.min(keys.length, values.length); i < l; i++) {
      zipped[keys[i]] = values[i];
    }
  }
  return zipped;
}

function unzip(o) {
  var unzipped = { keys: [], values: [] };
  each_own(o, function(v, k) {
    unzipped.values.push(v);
    unzipped.keys.push(k);
  });
  return unzipped;
}

function union() {
  return slice.call(arguments).reduce(function(output, input) {
    return to_array(output).concat(to_array(input));
  }, []);
}

function chunk(o, n) {
  var out = [];
  var l = o.length;
  var i = 0;
  var size;
  if (l % n === 0) {
    size = Math.floor(l / n);
    while (i < l) {
      out.push(o.slice(i, i += size));
    }
  } else {
    n--;
    size = Math.floor(l / n);
    if (l % size === 0) size--;
    while (i < size * n) {
      out.push(o.slice(i, i += size));
    }
    out.push(o.slice(size * n));
  }
  return out;
}

function segment(o, n) {
  var out = [];
  while (o.length) {
    out.push(o.splice(0, n));
  }
  return out;
}

function shuffle(set) {
  var i = set.length;
  while (i) {
    var rnd = Math.floor(Math.random() * i--);
    var tmp = set[i];
    set[i] = set[rnd];
    set[rnd] = tmp;
  }
  return set;
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

function insert_at(o, index, value) {
  o.splice(index, 0, value);
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

function load(o) {
  clear(o);
  each(rest(arguments), function(value) { push(o, value); });
}
