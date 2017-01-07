function make(definition) {
  var name = definition.ns.split('/').pop().toLowerCase();
  /*jslint evil: true*/
  var ctor = (new Function('return function ' + name + '(o){this.construct.call(this,o||{});}'))();
  ctor.name = name;
  ctor.create = function(o) { return new ctor(o); };
  ctor.ns = definition.ns;
  ctor.properties = {};
  ctor.mixins = [];
  ctor.inits = [];
  ctor.setups = [];

  if (is_array(definition.mixin)) {
    each(definition.mixin.reverse(), function(mixin) {
      push(ctor.mixins, mixin.ns);
      push(ctor.inits, mixin.inits);
      push(ctor.setups, mixin.setups);
      ctor.properties = override(ctor.properties, mixin.properties);
      each(mixin.prototype, function(v, k) { ctor.prototype[k] = v; });
      each(mixin, function(v, k) {
        if (!inlist(k, 'ns', 'create', 'properties', 'mixins', 'inits', 'setups')) {
          ctor[k] = v;
        }
      });
    });
  }
  
  each(definition.self, function(v, k) { ctor[k] = is(v, 'function') ? v.bind(ctor) : v; });

  each(definition, function(v, k) {
    if (inlist(k, 'ns', 'mixin', 'self')) {
    } else if (is(v, 'function')) {
      if (k === 'init') {
        ctor.inits.push(v);
      } else if (k === 'setup') {
        ctor.setups.push(v);
      } else {
        ctor.prototype[k] = v;
      }
    } else {
      ctor.properties[k] = override(ctor.properties[k], v);
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
    invoke(ctor.setups, this);
  };

  return ctor;
}
