(function(global) {

  var slice = Array.prototype.slice;

  if (!global.library) {
    var library;
    if (module && module.exports) {
      var path = require('path');
      var lib = path.join(__dirname, '..');
      library = function() {
        if (arguments.length === 2) {
          arguments[0].exports = define(arguments[1]);
        } else {
          return require(path.join(lib, arguments[0]));
        }
      };
      library.export = function(_module, definition) {
        _module.exports = definition;
      };
    } else {
      library = function() {
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
    }
    library.create = function(definition) {
      return define(definition).create();
    };
    global.library = library;
  }

  function define(definition) {
    if (typeof definition === 'function') definition = definition();
    var ctor = make_ctor(definition.ns);
    // TODO
    return ctor;
  }

  function make_ctor(name) {
    /*jslint evil: true*/
    var ctor = (new Function('return function ' + name + '(o){this.ctor.apply(this,o);}'))();
    ctor.create = function() { return new ctor(arguments); };
    ctor.prop = {};
    ctor.init = [];
    return ctor;
  }

})(this);
