function select_all() {
  var one_arg = arguments.length === 1;
  if (!one_arg && !is_element(arguments[0])) return [];
  var element = one_arg ? document : arguments[0];
  var selector = one_arg ? arguments[0] : arguments[1];
  return slice.call(element.querySelectorAll(selector));
}

function select_children(element, selector) {
  if (!is_element(element)) return [];
  var id = element.id;
  var guid = element.id = (id || 'qp' + qp_id());
  var scope = '#' + guid + ' > ';
  selector = scope + (selector + '').replace(',', ',' + scope, 'g');
  var result = slice.call(element.parentNode.querySelectorAll(selector));
  if (!id) element.removeAttribute('id');
  return result;
}

function matches(el, selector) {
  el = element(el);
  if (el) {
    return (el.matches || el.matchesSelector || el.msMatchesSelector).call(el, selector);
  }
  return false;
}

function select_each() {
  var args = arguments.length === 2 ? [arguments[0]] : [arguments[0], arguments[1]];
  var elements = select_all.apply(null, args);
  for_each.call(elements, arguments[arguments.length - 1]);
}

function select_first() {
  return select_all.apply(null, arguments)[0];
}
