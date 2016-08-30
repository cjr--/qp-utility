define(module, function(exports, require, make) {

  var qp = require('qp-utility');

  make({

    ns: 'qp-utility/store',

    store: null,
    store_key: 'qp.cache.',

    init: function(options) {
      this.store = window.localStorage;
      this.store_key = qp.rtrim(options.key, '.') + '.';
    },

    size: function() {
      var kb = 0;
      var store_key = this.store_key;
      qp.each_own(this.store, function(value, key) {
        if (qp.starts(key, store_key)) {
          kb += (qp.get_utf8_length(value) / 1000);
        }
      });
      return kb;
    },

    data: function() {
      var data = {};
      var store_key = this.store_key;
      var store_key_len = store_key.length
      qp.each_own(this.store, function(value, key) {
        if (qp.starts(key, store_key)) {
          qp.set(data, key.slice(store_key_len), JSON.parse(value));
        }
      });
      return data;
    },

    get_key: function(key) { return this.store_key + key; },

    get_item: function(key) {
      var item = this.store.getItem(this.get_key(key));
      if (item) {
        return JSON.parse(item);
      } else {
        return {
          key: key,
          created: +(new Date()),
          data: null
        };
      }
    },

    set_item: function(key, item) {
      this.store.setItem(this.get_key(key), JSON.stringify(item));
    },

    get: function(options) {
      var item = this.get_item(options.key);
      if (options.max_age && options.max_age > 0) {
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
    },

    set: function(options) {
      var item = this.get_item(options.key);
      item.modified = +(new Date());
      item.data = options.data;
      this.set_item(options.key, item);
      return options.data;
    },

    remove: function(options) {
      this.store.removeItem(this.get_key(options.key));
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
