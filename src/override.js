function override(a, b) {
  function _override(a, b) {
    var type_a = qp_typeof(a);
    var type_b = qp_typeof(b);
    if (b === undefined || b === 0 || b === null || (b.length && !b.length)) {
      return a;
    } else if (type_a == 'object' && type_b == 'object') {
      for (var k in b) {
        if (b.hasOwnProperty(k)) {
          a[k] = _override(a[k], b[k]);
        }
      }
      return a;
    }
    return b;
  }
  return _override(a, b);
}
