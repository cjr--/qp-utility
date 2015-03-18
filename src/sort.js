function sort(items, fn) {
  return items.sort(fn);
}

function sort_on(items, keys, options) {
  var stable_sort = true;
  if (stable_sort) {
    for (var i = 0, l = items.length; i < l; i++) {
      items[i].sort_index = i;
    }
  }
  each(keys, function(key) {
    items.sort(function(o1, o2) {
      var v1 = o1[key], v2 = o2[key];
      if (v1 > v2) { return 1; }
      if (v1 < v2) { return -1; }
      if (stable_sort) {
        return o1.sort_index > o2.sort_index ? 1 : -1;
      }
      return 0;
    });
  });
}

function group_on(items, key, name, sort_key) {
  var sort = [ key ];
  if (sort_key) {
    sort.push(sort_key);
  }
  sort_on(items, sort);
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

function group_by(items, key, name, sort_key) {
  var sort = [ key ];
  if (sort_key) {
    sort.push(sort_key);
  }
  var groups = [];
  var group;
  each(sort_on(items, sort), function(item) {
    var item_key = ns(item, key);
    if (!group || item_key !== group.key) {
      group = {
        group: true,
        key: item_key,
        name: ns(item, name),
        items: [item]
      };
      groups.push(group);
    } else {
      group.items.push(item);
    }
  });
  return groups;
}
