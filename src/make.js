function make(def) {

  /*jslint evil: true*/
  var ctor = (new Function('return function ' + def.ns + '(o){this.construct.call(this,o);}'))();
  ctor.create = function(o) { return new ctor(o); };
  ctor.ns = def.ns;
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

  qp.each(def, function(value, name) {
    if (name === 'ns' || name === 'mx') {
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
    each(ctor.inits, function(init) { init.call(this, options); }, this);
  };

}
