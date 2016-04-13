function make() {
  var ns, def;
  if (arguments.length === 1) {
    ns = arguments[0].ns;
    def = arguments[0];
  } else {
    ns = arguments[0];
    def = arguments[1];
  }

  var name = ns.split('/').pop().toLowerCase();
  /*jslint evil: true*/
  var ctor = (new Function('return function ' + name + '(o){this.construct.call(this,o||{});}'))();
  ctor.create = function(o) { return new ctor(o); };
  ctor.ns = ns;
  ctor.properties = {};
  ctor.mixins = [];
  ctor.inits = [];

  if (def.mixin) {
    each(def.mixin.reverse(), function(mixin) {
      ctor.mixins.push(mixin.ns);
      ctor.inits.unshift(mixin.inits);
      override(ctor.properties, mixin.properties);
      override(ctor.prototype, mixin.prototype);
    });
    ctor.inits = compact(flatten(ctor.inits));
  }

  each(def, function(value, name) {
    if (name === 'mixin') {
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
