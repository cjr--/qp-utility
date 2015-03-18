function copy(o) {
  if (is(o, 'array')) {
    return o.slice(0);
  } else if (is(o, 'object')) {
    return assign({}, o);
  } else if (is(o, 'date')) {
    return new Date(o.getTime());
  } else {
    return o;
  }
}
