function ungroup(item_list) {
  remove_all(item_list, { group: true });
  return item_list;
}

function group(item_list, group_list) {
  item_list = to_array(item_list);
  group_list = to_array(group_list);
  var reverse_group_list = copy(group_list).reverse();
  var group_id = -1000;
  var item_index = 0;
  var item = null;
  var last_item = null;
  while (item_index <= item_list.length) {
    item = item_list[item_index];
    if (item_index === 0) {
      each(group_list, function(group) { add_item(header(item, group)); });
    } else if (item_index < item_list.length) {
      var header_list = [];
      each(reverse_group_list, function(group) {
        if (item[group.group_key] !== last_item[group.group_key]) {
          add_item(footer(last_item, group));
          header_list.unshift(header(item, group));
        }
      });
      each(header_list, function(header) { add_item(header); });
    } else if (item_index === item_list.length) {
      each(reverse_group_list, function(group) { add_item(footer(last_item, group)); });
    }
    last_item = item;
    item_index++;
  }

  function header(item, group) { return group_item(item, group, { header: true }); }
  function footer(item, group) { return group_item(item, group, { footer: true }); }
  function add_item(item) { item_list.splice(item_index++, 0, item); }

  function group_item(item, group, group_item) {
    group_item.id = group_id--;
    group_item.group = true;
    group_item.key = item[group.group_key];
    if (group.name_key) group_item.name = get(item, group.name_key);
    if (group.data_key) group_item.data = get(item, group.data_key);
    return group_item;
  }

  return build_group_list(item_list);
}

function build_group_list(item_list) {
  var group = { group_list: [ ] };
  var stack = [];
  qp.each(item_list, function(item) {
    if (item.group && item.header) {
      var new_group = { header: item, key: item.key, group_list: [ ], item_list: [ ] };
      if (item.name) new_group.name = item.name;
      if (item.data) new_group.data = item.data;
      group.group_list.push(new_group);
      stack.push(group);
      group = new_group;
    } else if (item.group && item.footer) {
      group.footer = item;
      group = stack.pop();
    } else {
      group.item_list.push(item);
    }
  });
  return group.group_list;
}
