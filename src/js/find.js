function find_predicate(arg1, arg2) {
  var predicate;
  if (is(arg1, 'function')) {
    predicate = not_empty(arg2) ? arg1.bind(arg2) : arg1;
  } else if (is(arg1, 'object')) {
    var object_keys = keys(arg1);
    predicate = function(item, index, items) {
      return eq(pick(item, object_keys), arg1);
    };
  } else if (is(arg1, 'string')) {
    var truthy = is(arg2, 'undefined');
    predicate = function(item, index, items) {
      var value = item[arg1];
      return truthy ? !!value : value === arg2;
    };
  }
  return predicate;
}

function find(items, arg1, arg2, options) {
  options = options || {};
  var output_all = options.find_all || options.remove_all;
  var match_index = [];
  var match_value = [];
  if (not_empty(items)) {
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
    return output_all ? match_value : options.index && match_value[0] === undefined ? -1 : match_value[0];
  }
  return output_all ? [] : options.index ? -1 : undefined;
}

function count(items, arg1, arg2) {
  return find(items, arg1, arg2, { find_all: true }).length;
}

function any(items, arg1, arg2) {
  return find(items, arg1, arg2, { index: true }) !== -1;
}

function all(items, arg1, arg2) {
  return find(items, arg1, arg2, { find_all: true }).length !== items.length;
}

function none(items, arg1, arg2) {
  return find(items, arg1, arg2, { find_all: true }).length === 0;
}

function find_all(items, arg1, arg2) {
  return find(items, arg1, arg2, { find_all: true });
}

function find_last(items, arg1, arg2) {
  var all = find(items, arg1, arg2, { find_all: true });
  return all[all.length - 1];
}

function find_index(items, arg1, arg2) {
  return find(items, arg1, arg2, { index: true });
}

function exists(items, arg1, arg2) {
  return find(items, arg1, arg2, { index: true }) !== -1;
}

function remove(items, arg1, arg2) {
  return find(items, arg1, arg2, { remove: true });
}

function remove_all(items, arg1, arg2) {
  return find(items, arg1, arg2, { remove_all: true });
}

function replace(items, arg1, arg2, item) {
  var index = find(items, arg1, arg2, { index: true });
  if (index > -1) {
    items[index] = item;
  }
  return index !== -1;
}

function upsert(items, arg1, arg2, item) {
  if (is(items, 'array') && is(item, 'object')) {
    var index = find(items, arg1, arg2, { index: true });
    if (index !== -1) {
      items[index] = item;
    } else {
      items.push(item);
    }
    return true;
  }
  return false;
}
