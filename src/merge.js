function merge() {
  function _merge(a, b) {
    var type_a = qp_typeof(a);
    var type_b = qp_typeof(b);
    if (type_a == 'array' && type_b == 'array') {
      for (var i = 0, l = Math.min(a.length, b.length); i < l; i++) {
        var type_ai = qp_typeof(a[i]);
        var type_bi = qp_typeof(b[i]);
        if (type_ai == 'undefined' && type_bi != 'undefined') {
          a[i] = b[i];
        } else if (type_ai == type_bi) {
          a[i] = _merge(a[i], b[i]);
        }
      }
      if (a.length < b.length) {
        a = a.concat(b.slice(a.length));
      }
    } else if (type_a == 'object' && type_b == 'object') {
      for (var k in b) {
        if (b.hasOwnProperty(k)) {
          var type_ak = qp_typeof(a[k]);
          var type_bk = qp_typeof(b[k]);
          if (type_ak == 'undefined' && type_bk != 'undefined') {
            a[k] = b[k];
          } else {
            a[k] = _merge(a[k], b[k]);
          }
        }
      }
    } else if (type_a == 'undefined') {
      return type_b == 'undefined' ? {} : b;
    }
    return a;
  }
  var target = arguments[0];
  for (var i = 1, l = arguments.length; i < l; i++) {
    target = _merge(target, arguments[i]);
  }
  return target;
}
