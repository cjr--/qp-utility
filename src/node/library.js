var path = require('path');
var lib = path.join(__dirname, '..');

var library = function() {
  if (arguments.length === 2) {
    arguments[0].exports = define(arguments[1]);
  } else {
    return require(path.join(lib, arguments[0]));
  }
};

library.export = function(_module, definition) {
  _module.exports = definition;
};

library.create = function(definition) {
  return define(definition).create();
};
