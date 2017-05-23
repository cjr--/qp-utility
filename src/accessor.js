function get(o, key, dfault) {
  var value = dfault;
  var path = key.split('.');
  if (is(o, 'object')) {
    var item = o;
    for (var i = 0, l = path.length; i < l; i++) {
      item = item[path[i]];
      if (item === null || item === undefined) break;
      if (i == (l - 1)) value = item;
    }
  }
  return value;
}

function take(o, key, dfault) {
  var value = dfault;
  var path = key.split('.');
  if (is(o, 'object')) {
    var item = o;
    var last;
    for (var i = 0, l = path.length; i < l; i++) {
      last = item;
      item = item[path[i]];
      if (item === undefined) break;
      if (i == (l - 1)) {
        delete last[path[i]];
        value = item;
      }
    }
  }
  return value;
}

function has(o, key) {
  var has = false;
  var path = key.split('.');
  if (is(o, 'object')) {
    var item = o;
    for (var i = 0, l = path.length; i < l; i++) {
      var item_key = path[i];
      if (item.hasOwnProperty(item_key)) {
        item = item[item_key];
        if (item === undefined) break;
        if (i == (l - 1)) has = true;
      } else { break; }
    }
  }
  return has;
}

function set(o, key, value) {
  var item = o;
  var path = key.split('.');
  for (var i = 0, l = path.length; i < l; i++) {
    if (i == (l - 1)) {
      item[path[i]] = value;
      break;
    } else if (item[path[i]] === undefined) {
      item = item[path[i]] = {};
    } else {
      item = item[path[i]];
    }
  }
  return o;
}
