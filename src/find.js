function find_predicate(arg1, arg2) {
  var predicate;
  if (is(arg1, 'function')) {
    predicate = arg2 ? arg1.bind(arg2) : arg1;
  } else if (is(arg1, 'object')) {
    var keys = keys(arg1);
    var values = values(arg1);
    predicate = function(item, index, items) {
      return equals(pick_values(item, keys), values);
    };
  } else if (is(arg1, 'string')) {
    var truthy = is(arg2, 'undefined');
    predicate = function(item, index, items) {
      var value = item[arg1];
      return truthy ? value : value === arg2;
    };
  }
  return predicate;
}

function find(items, arg1, arg2, options) {
  options = options || {};
  var output_all = options.find_all || options.remove_all;
  var match_index = [];
  var match_value = [];
  if (is_not_empty(items)) {
    var predicate = find_predicate(arg1, arg2);
    if (predicate) {
      for (var i = 0, il = items.length; i < il; i++) {
        var item = items[i];
        if (predicate(item, i, items)) {
          match_index.push(i);
          match_value.push(options.index ? i : item);
          if (!output_all) { break; }
        }
      }
      if (options.remove || options.remove_all) {
        for (var j = 0, jl = match_index.length; j < jl; j++) {
          items.splice(match_index[j], 1);
        }
      }
    }
  }
  return output_all ? match_value : match_value[0];
}

function any(items, arg1, arg2) {
  return find(items, arg1, arg2, { find: true }) !== undefined;
}

function find_all(items, arg1, arg2) {
  return find(items, arg1, arg2, { find_all: true });
}

function find_index(items, arg1, arg2) {
  return find(items, arg1, arg2, { index: true });
}

function remove(items, arg1, arg2) {
  return find(items, arg1, arg2, { remove: true });
}

function remove_all(items, arg1, arg2) {
  return find(items, arg1, arg2, { remove_all: true });
}
