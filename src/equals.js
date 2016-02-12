function neq(o1, o2) { return !eq(o1, o2); }

function eq(o1, o2) {
  function _equals(a, b) {
    if (a === b) {
      return true;
    } else {
      var type_a = qp_typeof(a);
      var type_b = qp_typeof(b);
      if (type_a == type_b) {
        if (type_a == 'object') {
          var keys_a = Object.keys(a);
          var keys_b = Object.keys(b);
          if (keys_a.length == keys_b.length) {
            keys_a = keys_a.sort();
            keys_b = keys_b.sort();
            if (keys_a.join() == keys_b.join()) {
              for (var i = 0, il = keys_a.length; i < il; i++) {
                if (!_equals(a[keys_a[i]], b[keys_a[i]])) {
                  return false;
                }
              }
              return true;
            }
          }
        } else if (type_a == 'array' && a.length == b.length) {
          for (var j = 0, jl = a.length; j < jl; j++) {
            if (!_equals(a[j], b[j])) {
              return false;
            }
          }
          return true;
        }
      }
      return false;
    }
  }
  return _equals(o1, o2);
}
