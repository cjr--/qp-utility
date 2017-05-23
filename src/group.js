function ungroup(items) {
  remove_all(items, { group: true });
  return items;
}

function group(items, group_keys, options) {
  items = to_array(items);
  group_keys = to_array(group_keys);
  var group_count = group_keys.length;
  if (group_count === 0) return;

  var summary = [];
  var group_id = -99;
  var item_index = 0;

  while (item_index < items.length) {
    if (group_count === 1) {
      summary.push(create_group(group_id--, get_key(items[item_index], group_keys[0])));
    } else {
      var groups = [];
      var summary_groups = [];
      while (groups.length < group_count - 1) {
        var key = get_key(items[item_index], group_keys[groups.length]);
        var group = create_header(group_id--, key);
        groups.push(group);
        items.splice(item_index++, 0, group);
        summary_groups.push(create_group_summary(group, 'groups'));
      }
      var outer_group = groups[groups.length - 1];
      var outer_summary_group = summary_groups[groups.length - 1];
      while (items[item_index] && items[item_index][outer_group.name] === outer_group.key) {
        outer_summary_group.groups.push(create_group(group_id--, get_key(items[item_index], group_keys[group_count - 1]), groups));
      }
      while (groups.length) {
        groups.pop();
        var group_summary = summary_groups.shift();
        group_summary.footer = create_footer(group_summary.id, {
          name: group_summary.name,
          key: group_summary.key,
          id_name: group_summary.id_name,
          id_key: group_summary.id_key
        });
        items.splice(item_index++, 0, group_summary.footer);
        summary.push(group_summary);
      }
    }
  }

  function get_key(item, o) {
    if (is(o, 'string')) {
      var key_name = o;
      var key_value = get(item, key_name);
      return { name: key_name, value: key_value, id_name: key_name,  id_value: key_value };
    } else if (is(o, 'object')) {
      return { name: o.key, value: get(item, o.key), id_name: o.id_key, id_value: get(item, o.id_key) };
    } else {
      return null;
    }
  }

  function create_group(id, key, outer_groups) {
    var header = create_header(id, key);
    var group_summary = create_group_summary(header, 'items');
    items.splice(item_index++, 0, header);
    while (items[item_index] && get_key(items[item_index], key.name).value === key.value) {
      group_summary.items.push(items[item_index]);
      if (outer_groups) {
        each(outer_groups, function(grp) { grp.count++; });
      }
      group_summary.count++;
      item_index++;
    }
    group_summary.footer = create_footer(id, key);
    items.splice(item_index++, 0, group_summary.footer);
    return group_summary;
  }

  function create_group_summary(group, list_key) {
    var summary = { group_id: group.id, name: group.name, key: group.key, id_name: group.id_name, id_key: group.id_key, header: group, count: 0 };
    summary[list_key] = [];
    return summary;
  }

  function create_header(id, key) {
    return {
      id: id,
      group: true,
      group_header: true,
      name: key.name,
      key: key.value,
      id_name: key.id_name,
      id_key: key.id_value
    };
  }

  function create_footer(id, key) {
    return {
      id: id,
      group: true,
      group_footer: true,
      name: key.name,
      key: key.value,
      id_name: key.id_name,
      id_key: key.id_value
    };
  }

  return summary;
}
