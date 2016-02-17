function clone(original) {
  function _clone(o) {
    var copy;
    var type_o = qp_typeof(o);
    if (type_o == 'array') {
      copy = [];
      for (var i = 0, l = o.length; i < l; i++) {
        copy[i] = _clone(o[i]);
      }
    } else if (type_o == 'object') {
      copy = {};
      for (var key in o) {
        if (o.hasOwnProperty(key)) {
          copy[key] = _clone(o[key]);
        }
      }
    } else if (type_o == 'date') {
      copy = new Date(o.getTime());
    } else {
      copy = o;
    }
    return copy;
  }
  return _clone(original);
}
