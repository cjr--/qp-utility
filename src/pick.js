function pick_predicate() {
  if (is(arguments[0], 'function')) {
    return arguments[1] ? arguments[0].bind(arguments[1]) : arguments[0];
  } else {
    var picks = flatten(array_slice.call(arguments));
    return function(v, k, o) { return picks.indexOf(k) !== -1; };
  }
  return undefined;
}

function _pick(o, predicate, options) {
  options = options || {};
  if (predicate) {
    output = {};
    for (var key in o) {
      if (!options.own || o.hasOwnProperty(key)) {
        if (predicate(o[key], key, o)) {
          output[key] = o[key];
        }
      }
    }
    return output;
  }
  return undefined;
}

function pick(o) {
  return _pick(o, pick_predicate.apply(null, rest(arguments)));
}

function pick_own(o) {
  return _pick(o, pick_predicate.apply(null, rest(arguments)), { own: true });
}

function pairs(o) {
  var _pairs = [];
  if (is(o, 'object')) {
    each_own(o, function(v, k) { _pairs.push([k, v]); });
  }
  return _pairs;
}

function keys(o) {
  var _keys = [];
  for (var key in o) {
    if (o.hasOwnProperty(key)) {
      _keys.push(key);
    }
  }
  return _keys;
}

function values(o) {
  var _values = [];
  for (var key in o) {
    if (o.hasOwnProperty(key)) {
      _values.push(o[key]);
    }
  }
  return _values;
}

function pick_values(o) {
  var keys = flatten(rest(arguments));
  var output = [];
  for (var key in o) {
    if (o.hasOwnProperty(key)) {
      if (keys.indexOf(key) !== -1) {
        output.push(o[key]);
      }
    }
  }
  return output;
}
