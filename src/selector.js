var class_re = /^\.([\w\-]+)$/;

function select_all() {
  var one_arg = arguments.length === 1;
  var element = one_arg ? document : arguments[0];
  var selector = one_arg ? arguments[0] : arguments[1];
  var elements;
  var class_name = selector.match(class_re);
  if (class_name) {
    elements = element.getElementsByClassName(class_name[1]);
  } else {
    elements = element.querySelectorAll(selector);
  }
  return slice.call(elements);
}

function select_each() {
  var args = arguments.length === 2 ? [arguments[0]] : [arguments[0], arguments[1]];
  var elements = qp.select_all.apply(null, args);
  forEach.call(elements, arguments[arguments.length - 1]);
}

function select_first() {
  return qp.select_all.apply(null, arguments)[0];
}
