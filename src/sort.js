function sort(items, fn) {
  return items.sort(fn);
}

function sort_on(items, keys, _options) {
  var opts = options(_options, { stable: true });
  keys = is_array(keys) ? keys : keys.split(',');
  if (opts.stable) {
    for (var i = 0, l = items.length; i < l; i++) {
      items[i].sort_index = i;
    }
  }
  each(keys, function(key) {
    items.sort(function(o1, o2) {
      var v1 = o1[key], v2 = o2[key];
      if (v1 > v2) { return 1; }
      if (v1 < v2) { return -1; }
      if (opts.stable) {
        return o1.sort_index > o2.sort_index ? 1 : -1;
      }
      return 0;
    });
  });
  return items;
}

function group_on(items, key, name, sort_key) {
  var sort = [ key ];
  if (sort_key) sort.push(sort_key);
  sort_on(items, sort, { stable: true });
  var group;
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var item_key = ns(item, key);
    if (!group || item_key !== group.key) {
      group = { group: true, key: item_key, name: ns(item, name) };
      items.splice(i, 0, group);
    }
  }
  return items;
}

function group_by(items, group_key, group_name, sort_key) {
  group_name = group_name || group_key;
  var sort = [ group_key ];
  if (sort_key) sort.push(sort_key);
  var groups = [];
  var group;
  sort_on(items, sort, { stable: true }).forEach(function(item) {
    var item_key = ns(item, group_key);
    if (!group || item_key !== group.key) {
      group = {
        group: true,
        key: item_key,
        name: ns(item, group_name),
        items: [item]
      };
      groups.push(group);
    } else {
      group.items.push(item);
    }
  });
  return groups;
}
