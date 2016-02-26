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
    return node_type && (node_type === 1 || node_type === 9);
  }
  return false;
}

function element(el) {
  if (qp_typeof(el) === 'string') {
    return select_first(el);
  } else if (is_element(el)) {
    return el;
  } else {
    return null;
  }
}

function on(el, event_name, handler) {
  el.addEventListener(event_name, handler, false);
}

function off(el, event_name, handler) {
  el.removeEventListener(event_name, handler);
}

function show(el, v) {
  el.style.display = v || 'block';
}

function hide(el, v) {
  el.style.display = v || '';
}

function add_class(el, class_name) {
  el = element(el);
  if (el) { el.classList.add(class_name); }
}

function remove_class(el, class_name) {
  el = element(el);
  if (el) { el.classList.remove(class_name); }
}

function html() {
  var tmp = document.implementation.createHTMLDocument();
  tmp.body.innerHTML = slice.call(arguments).join('');
  return tmp.body.children;
}

function attr(el, name, value) {
  if (arguments.length === 2) {
    el.getAttribute(name);
  } else {
    el.setAttribute(name, value);
  }
}

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
    fn(window);
  } else {
    document.addEventListener('DOMContentLoaded', function() { fn(window); });
  }
}
