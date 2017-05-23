function get(o, key, dfault) {
  var value = dfault;
  var path = key.split('.');
  if (path[0] === 'global') return get(global, path.slice(1).join('.'), dfault);
  if (is(o, 'object') || o === global) {
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
  if (path[0] === 'global') return take(global, path.slice(1).join('.'), dfault);
  if (is(o, 'object') || o === global) {
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
  if (path[0] === 'global') return has(global, path.slice(1).join('.'), dfault);
  if (is(o, 'object') || o === global) {
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
  if (path[0] === 'global') return set(global, path.slice(1).join('.'), value);
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
