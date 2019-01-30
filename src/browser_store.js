define(module, function(exports, require) {

  var qp = require('qp-utility');

  qp.make(exports, {

    ns: 'qp-utility/store',

    self: {

      get: function() {
        var key = qp.arg(arguments).join('.');
        var value = window.localStorage.getItem(key);
        if (qp.defined(value)) {
          return JSON.parse(value);
        }
      },

      set: function() {
        var args = qp.arg(arguments);
        var value = args.pop();
        if (qp.defined(value)) {
          var key = args.join('.');
          window.localStorage.setItem(key, JSON.stringify(value));
          return value;
        }
      },

      remove: function() {
        var key = qp.arg(arguments).join('.');
        window.localStorage.removeItem(key);
      }

    },

    root: null,
    store: null,
    cache: null,
    key: 'qp',
    ctx: '',

    init: function(options) {
      this.root = this.self;
      this.store = window.localStorage;
      this.cache = { };
    },

    get_key: function(key) { return this.key + (this.ctx ? '.' + this.ctx : '') + (key ? '.' + key : ''); },
    set_context: function(ctx) { this.ctx = ctx || ''; },

    size: function() {
      var kb = 0;
      var key = this.get_key();
      qp.each_own(this.store, function(v, k) {
        if (qp.starts(k, key)) {
          kb += (qp.get_utf8_length(v) / 1000);
        }
      });
      return kb;
    },

    data: function(include_meta) {
      var data = {};
      var key = this.get_key();
      var key_len = key.length;
      qp.each_own(this.store, function(v, k) {
        if (qp.starts(k, key)) {
          var item = JSON.parse(v);
          qp.set(data, key.slice(key_len), include_meta ? item : item.data);
        }
      });
      return data;
    },

    each: function(fn) {
      qp.each_own(this.store, fn);
    },

    get_item: function(key, o) {
      key = this.get_key(key);
      var item;
      if (o.memory) {
        item = this.cache[key];
      } else {
        var value = this.store.getItem(key);
        if (value) item = JSON.parse(value);
      }
      return item || { key: key, created: +(new Date()), data: null };
    },

    set_item: function(key, item, o) {
      key = this.get_key(key);
      if (o.memory) {
        this.cache[key] = item;
      } else {
        this.store.setItem(key, JSON.stringify(item));
      }
    },

    get: function(options) {
      if (qp.defined(options.max_age) && options.max_age === 0) {
        log('%cCACHE OVERRIDE %s', 'color:darkblue', options.key);
        return null;
      } else {
        var item = this.get_item(options.key, { memory: options.memory });
        if (options.max_age && qp.is_number(options.max_age)) {
          var max_age = moment().subtract(options.max_age);
          if (item.data === null) {
            log('%cCACHE FAIL %s', 'color:darkblue', item.key);
            return null;
          } else if (max_age < item.modified) {
            log('%cCACHE HIT %s expires in %s', 'color:darkblue', item.key, moment.duration(item.modified - max_age).humanize());
            return item.data;
          } else {
            log('%cCACHE MISS %s expired %s ago', 'color:darkblue', item.key, moment.duration(item.modified - max_age).humanize());
            return null;
          }
        } else {
          return item ? item.data : null;
        }
      }
    },

    set: function(options) {
      var item = this.get_item(options.key, { memory: options.memory });
      item.modified = +(new Date());
      item.data = options.data;
      this.set_item(options.key, item, { memory: options.memory });
      return options.data;
    },

    remove: function(options) {
      var key = this.get_key(options.key)
      if (options.memory) {
        qp.delete_key(this.cache, key);
      } else {
        this.store.removeItem(key);
      }
    },

    destroy: function() {
      qp.each_own(this.store, function(v, k) { this.store.removeItem(k); }.bind(this));
      this.cache = {};
    },

    // Collections

    find: function(options) {
      var items = this.get({ key: options.key, max_age: options.max_age });
      return qp.find(items, { id: options.id });
    },

    upsert: function(options) {
      var items = this.get({ key: options.key });
      qp.upsert(items, { id: options.item.id }, null, options.item);
      this.set({ key: options.key, data: items });
    }

  });

});
