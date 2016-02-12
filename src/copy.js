function copy(o) {
  var type = qp_typeof(o);
  if (type === 'array') {
    return o.slice(0);
  } else if (type === 'object') {
    return assign({}, o);
  } else if (type === 'date') {
    return new Date(o.getTime());
  } else {
    return o;
  }
}
