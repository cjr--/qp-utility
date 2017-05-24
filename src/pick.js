function pick(o1, keys) {
  var o2 = { };
  each(keys, function(k) { o2[k] = o1[k]; });
  return o2;
}
