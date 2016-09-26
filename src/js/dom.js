function get_attributes(el) {
  if (el && el.attributes) {
    return slice.call(el.attributes);
  } else {
    return [];
  }
}

function get_attribute(el, name) {
  if (el && el.attributes) {
    var attributes = el.attributes;
    for (var i = 0, l = attributes.length; i < l; i++) {
      var attribute = el.attributes[i];
      if (match(attribute.name, name)) {
        return attribute;
      }
    }
  }
}

function is_element(el) {
  if (el) {
    var node_type = el.nodeType;
    return defined(node_type) && (node_type === 1 || node_type === 9);
  }
  return false;
}

function element(arg0, arg1) {
  var arg_count = arguments.length;
  var arg0_type = qp_typeof(arg0);
  if (arg0_type === 'array') {
    return arg_count === 1 ? element(arg0[0]) : element(arg0[0], arg1);
  } else if (arg0_type === 'string' && arg_count === 1) {
    return select_first(arg0);
  } else if (is_element(arg0)) {
    if (arg_count === 1) {
      return arg0;
    } else if (arg_count === 2) {
      return select_first(arg0, arg1);
    }
  } else if (defined(arg0.length)) {
    return arg_count === 1 ? element(arg0[0]) : element(arg0[0], arg1);
  }
  return null;
}

function on(el, event_name, handler, scope) {
  if (scope) handler.bind(scope);
  el.addEventListener(event_name, handler, false);
}

function off(el, event_name, handler) {
  el.removeEventListener(event_name, handler);
}

function nodefault(e) {
  e.preventDefault();
  e.stopPropagation();
}

function show(el, v) {
  el.style.display = v || 'block';
}

function hide(el, v) {
  el.style.display = v || '';
}

function visible(el) {
  el = element(el);
  if (el) return el.style.display !== 'hidden' && el.style.display !== '';
  return false;
}

function hidden(el) { return !visible(el); }

function add_class(el, class_name) {
  el = element(el);
  if (el) { el.classList.add(class_name); }
}

function remove_class(el, class_name) {
  el = element(el);
  if (el) { el.classList.remove(class_name); }
}

function has_class(el, class_name) {
  el = element(el);
  if (el) { el.classList.contains(class_name); }
}

function set_style(el, k, v) {
  el = element(el);
  if (el) { el.style.setProperty(k, v); }
}

function get_style(el, k) {
  el = element(el);
  if (el) { el.style.getPropertyValue(k); }
}

function attr(el, name, value) {
  if (arguments.length === 2) {
    return el.getAttribute(name);
  } else {
    el.setAttribute(name, value);
  }
}

function html() {
  var tmp = document.implementation.createHTMLDocument();
  tmp.body.innerHTML = slice.call(arguments).join('');
  return tmp.body.children;
}

function swap(a, b) {
  if (is(b, 'string')) b = html(b);
  a = element(a);
  a.parentNode.replaceChild(b, a);
  return b;
};

function parents_until(child_el, parent_el, match) {
  var result = match(child_el);
  if (result) {
    return result;
  } else if (child_el === parent_el) {
    return null;
  } else {
    return parents_until(child_el.parentNode, parent_el, match);
  }
}

function ready(fn) {
  if (document.readyState !== 'loading') {
    fn(window, module.require);
  } else {
    document.addEventListener('DOMContentLoaded', function() { fn(window, module.require); });
  }
}
