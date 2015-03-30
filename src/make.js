function make(ns, def) {

  var name = ns.split('/').pop().toLowerCase();
  /*jslint evil: true*/
  var ctor = (new Function('return function ' + name + '(o){this.construct.call(this,o||{});}'))();
  ctor.create = function(o) { return new ctor(o); };
  ctor.ns = ns;
  ctor.properties = {};
  ctor.inits = [];

  if (def.mx) {
    each(def.mx.reverse(), function(mixin) {
      ctor.mixins.push(mixin.ns);
      ctor.inits.unshift(mixin.inits);
      override(ctor.properties, mixin.properties);
      override(ctor.prototype, mixin.prototype);
    });
    mixin.inits = flatten(mixin.inits);
  }

  each(def, function(value, name) {
    if (name === 'mixins') {
    } else if (name === 'self') {
      assign(ctor, def.self);
    } else if (qp.is(value, 'function')) {
      if (name === 'init') {
        ctor.inits.unshift(value);
      } else {
        ctor.prototype[name] = value;
      }
    } else {
      ctor.properties[name] = override(ctor.properties[name], value);
    }
  });

  ctor.prototype.construct = function(options) {
    var reset = clone(ctor.properties);
    this.reset = function() { merge(this, reset); };
    bind(this);
    this.reset();
    this.self = ctor;
    assign_own(this, options);
    invoke(ctor.inits, this, options);
  };

  return ctor;
}
