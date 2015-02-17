var library = function() {
  if (typeof arguments[0] === 'string') {
    return library.bin[arguments[0]];
  } else {
    var definition = slice.call(arguments, -1);
    library.bin[definition.ns] = define(definition);
  }
};

library.export = function(ns, definition) {
  library.bin[ns] = definition;
};

library.bin = {};

library.create = function(definition) {
  return define(definition).create();
};
