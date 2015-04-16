function extend(a, b) {
  if (is_function(b)) {
    b = b.apply(null, array_slice.call(arguments, 2));
  }
  for (var key in b) {
    if (b.hasOwnProperty(key)) {
      a[key] = b[key];
    }
  }
  return a;
}
