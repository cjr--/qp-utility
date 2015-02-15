(function(global) {

  var slice = Array.prototype.slice;

  if (!global.library) {
    if (module && module.exports) {
      var path = require('path');
      var lib = path.join(__dirname, '..');
      global.library = function() {
        if (arguments.length === 2) {
          arguments[0].exports = define(arguments[1]);
        } else {
          return require(path.join(lib, arguments[0]));
        }
      };
    } else {
      global.library = function() {
        if (typeof arguments[0] === 'string') {
          return global.library.bin[arguments[0]];
        } else {
          var definition = slice.call(arguments, -1);
          global.library.bin[definition.ns] = define(definition);
        }
      };
      global.library.bin = {};
    }
    global.library.create = function(definition) {
      return define(definition).create();
    };
  }

  function define(definition) {
    if (typeof definition === 'function') definition = definition();
    var ctor = make_ctor(definition.ns);
    
    return ctor;
  }

  function make_ctor(name) {
    /*jslint evil: true*/
    var ctor = (new Function('return function ' + name + '(o){this.ctor.apply(this,o);}'))();
    ctor.create = function() { return new ctor(arguments); };
    ctor.properties = {};
    ctor.inits = [];
    return ctor;
  }

})(this);
