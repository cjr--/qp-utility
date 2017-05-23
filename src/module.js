function _module(_exports) {
  var args = slice.call(arguments, 1);
  var id;
  if (is(args[0], 'string')) id = args.shift();
  var _export = args.shift();
  for (var i = args.length, l = 0; i >= l; i--) {
    for (var key in args[i]) {
      if (args[i].hasOwnProperty(key)) _export[key] = args[i][key];
    }
  }
  
  if (_export.ns) {
    id = _export.ns;
  } else if (id) {
    _export.ns = id;
  }

  if (_export) {
    for (var k in _export) {
      if (typeof _export[k] === 'function' && _export.hasOwnProperty(k)) _export[k] = _export[k].bind(_export);
    }
    if (_export.init) _export.init();
    return _exports(id, _export);
  }
}
