function filter_key() {
  var key = '';
  if (is(arguments[0], 'array')) {
    return filter_key.apply(null, arguments[0]);
  } else if (arguments.length > 1) {
    key = join(map(arg(arguments), function(o) { return filter_key(o); }).sort(sort.string), '|');
  } else {
    var filter = arguments[0];
    if (is(filter, 'object')) {
      key = join(map(keys(filter).sort(sort.string), function(k) {
        return k + '=' + filter[k];
      }), '&');
    }
  }
  return key;
}

function filter_display() {
  var key;
  if (is(arguments[0], 'array')) {
    return filter_display.apply(null, arguments[0]);
  } else if (arguments.length > 1) {
    key = map(arg(arguments), function(o) { return filter_display(o); });
    return join(key, ' || ');
  } else {
    var filter = arguments[0];
    if (is(filter, 'object')) {
      key = map(keys(filter), function(k) { return k + ' == ' + filter[k]; });
      if (key.length > 1) {
        return '(' + join(key, ' && ') + ')';
      } else {
        return key[0];
      }
    } else {
      return '';
    }
  }
}

function filter_predicate() {
  var filters = map(arguments, function(filter) { return { filter: filter, keys: keys(filter) }; });
  return function(item, index, items) {
    return any(filters, function(o) { return eq(pick(item, o.keys), o.filter); });
  };
}

function filter(o) {
  if (is(arguments[1], 'array')) {
    return filter.apply(null, [o].concat(arguments[1]));
  } else if (arguments.length === 2) {
    return find_all(o, arguments[1]);
  } else {
    return find_all(o, filter_predicate.apply(null, rest(arguments)));
  }
}
