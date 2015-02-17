(function(global) {
  "use strict";

  var slice = Array.prototype.slice;

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
  

  global.library = library;

})(this);