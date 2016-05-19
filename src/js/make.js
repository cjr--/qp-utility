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
      each_own(mixin, function(v, k) {
        if (k === 'ns') {
          ctor.mixins.push(mixin.ns);
        } else if (k === 'inits') {
          ctor.inits = mixin.inits.concat(ctor.inits);
        } else if (k === 'properties') {
          ctro.properties = override(ctor.properties, mixin.properties);
        } else {
          ctor[k] = v;
        }
      });
      ctor.prototype = override(ctor.prototype, mixin.prototype);
    });
  }

  each_own(def, function(v, k) {
    if (inlist(k, 'mixin', 'ns')) {
    } else if (k === 'self') {
      each_own(def.self, function(v, k) { ctor[k] = v; });
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
