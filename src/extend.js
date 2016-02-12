function extend(a, b) {
  if (is_function(b)) {
    b = b.apply(null, slice.call(arguments, 2));
  }
  for (var key in b) {
    if (b.hasOwnProperty(key)) {
      var v = b[key];
      if (is_function(v)) {
        a[key] = v.bind(a);
      } else {
        a[key] = v;
      }
    }
  }
  return a;
}
