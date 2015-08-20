function show(el) {
  el.style.display = '';
}

function hide(el) {
  el.style.display = 'none';
}

function is_element(el) {
  if (el) {
    var node_type = el.nodeType;
    return node_type && (node_type === 1 || node_type === 9);
  }
  return false;
}

function element(el) {
  if (qp.typeof(el) === 'string') {
    return qp.select_first(el);
  } else if (qp.is_element(el)) {
    return el;
  } else {
    return null;
  }
}

function add_class(el, class_name) {
  el = qp.element(el);
  if (el) { el.classList.add(class_name); }
}

function remove_class(el, class_name) {
  el = qp.element(el);
  if (el) { el.classList.remove(class_name); }
}

var dom_ready = (function() {
  var ready = false;
  return function(fn) {
    if (fn && ready) {
      fn.call(app);
    } else if (fn) {
      ready = fn;
    } else if (ready) {
      ready.call(app);
    } else {
      ready = true;
    }
  };
})();

document.addEventListener('DOMContentLoaded', dom_ready);
