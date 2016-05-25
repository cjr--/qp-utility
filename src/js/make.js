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

  if (is_array(def.mixin)) {
    each(def.mixin.reverse(), function(mixin) {
      push(ctor.mixins, mixin.ns);
      push(ctor.inits, mixin.inits);
      ctor.properties = override(ctor.properties, mixin.properties);
      each(mixin.prototype, function(v, k) { ctor.prototype[k] = v; });
      each(mixin, function(v, k) {
        if (!inlist(k, 'ns', 'create', 'properties', 'mixins', 'inits')) {
          ctor[k] = v;
        }
      });
    });
  }

  each(def, function(v, k) {
    each(def.self, function(v, k) { ctor[k] = v; });
    if (inlist(k, 'ns', 'mixin', 'self')) {
    } else if (qp.is(v, 'function')) {
      if (k === 'init') {
        ctor.inits.push(v);
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
  };

  return ctor;
}
