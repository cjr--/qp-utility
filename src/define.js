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
