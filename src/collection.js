function first(o, count) {
  if (count) {
    return o && o.length ? array_slice.call(o, 0, count) : undefined;
  } else {
    return o && o.length ? o[0] : undefined;
  }
}

function last(o, count) {
  if (count) {
    return o && o.length ? array_slice.call(o, -count) : undefined;
  } else {
    return o && o.length ? o[o.length -1] : undefined;
  }
}

function rest(o, index) {
  return o && o.length ? array_slice.call(o, index || 1) : undefined;
}

function at(o, i) {
  if (o && o.length) {
    return i < 0 ? o[((o.length - 1) + i)] : o[i];
  }
  return undefined;
}

function range(o, from, to) {
  return o && o.length ? array_slice.call(o, from, to) : undefined;
}

function _in(item, items) {
  if (is_array(items)) {
    return items.indexOf(item) != -1;
  } else {
    return rest(arguments).indexOf(item) != -1;
  }
}

function not_in() { return !_in.apply(null, arguments); }
