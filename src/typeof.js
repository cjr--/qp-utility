function qp_typeof(o, ctor) {
  var type = object_to_string.call(o).slice(8, -1).toLowerCase();
  if (ctor && type === 'object') {
    if (o.constructor && o.constructor.name) {
      type = o.constructor.name.toLowerCase();
      return type === 'object' ? 'pojo' : type;
    } else {
      return 'pojo';
    }
  }
  return type;
}

function is(o, o_class) {
  var type = qp_typeof(o);
  if (arguments.length > 2) {
    var args = rest(arguments);
    return args.indexOf(type) != -1 || (type === 'object' && args.indexOf(qp_typeof(o, true)));
  } else {
    return type === o_class || (type === 'object' && qp_typeof(o, true) === o_class);
  }
}

function is_not() { return !is.apply(null, arguments); }
