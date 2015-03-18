(function(global) {
  var array_slice = Array.prototype.slice;
  var object_to_string = Object.prototype.toString;
  var is_array = Array.isArray;
  
  function noop() { }
  
  function is_number(o) { return o - parseFloat(o) >= 0; }
  
  function is_function(o) { return typeof o === 'function'; }
  
  function escape_re(s) { return s.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1"); }
  
  function random(min, max) { return Math.floor(Math.random() * (max - min)) + min; }
  
  function is_empty(o) { return typeof o === 'undefined' || o === null || (o.length && o.length === 0); }
  
  function is_not_empty(o) { return !is_empty(o); }
  
  function trim(s, chars) {
    chars = escape_re(chars || ' ');
    if (s === undefined || s === null) {
      return '';
    } else {
      return String(s).replace(new RegExp('^' + chars + '+|' + chars + '+$', 'g'), '');
    }
  }
  
  function ltrim(s, chars) {
    chars = escape_re(chars || ' ');
    if (s === undefined || s === null) {
      return '';
    } else {
      return String(s).replace(new RegExp('^' + chars + '+'), '');
    }
  }
  
  function rtrim(s, chars) {
    chars = escape_re(chars || ' ');
    if (s === undefined || s === null) {
      return '';
    } else {
      return String(s).replace(new RegExp(chars + '+$'), '');
    }
  }
  
  function build() {
    return flatten(arguments).join('');
  }
  
  function escape(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\"/g, '&quot;')
      .replace(/\'/g, '&#39;');
  }
  
  function unescape(s) {
    return String(s)
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  }
  
  function lpad(s, padding, width) {
    if (s === undefined || s === null) {
      return '';
    } else {
      while (s.length < width) {
        s = padding + s;
      }
      return s;
    }
  }
  
  function rpad(s, padding, width) {
    if (s === undefined || s === null) {
      return '';
    } else {
      while (s.length < width) {
        s = s + padding;
      }
      return s;
    }
  }
  
  function starts(s, str) {
    return s.lastIndexOf(str, 0) === 0;
  }
  
  function ends(s, str) {
    return s.indexOf(str, s.length - str.length) !== -1;
  }
  
  function between(s, left, right) {
    if (!right) right = left;
    if (s && left && right) {
      var startAt = s.indexOf(left) + 1;
      return s.slice(startAt, s.indexOf(right, startAt));
    } else {
      return s;
    }
  }
  
  function snake_to_camel(input) {
    var output = '';
    for (var i = 0, l = input.length; i < l; i++) {
      var chr = input[i];
      if (i === 0) {
        output += chr.toUpperCase();
      } else if (chr === '_' || chr === '-') {
        output += input[++i].toUpperCase();
      } else {
        output += chr;
      }
    }
    return output;
  }
  
  function camel_to_snake(input) {
    var output = '';
    var chr = '';
    var last = '';
    var lower = '';
    for (var i = 0, l = input.length; i < l; i++) {
      last = chr;
      chr = input[i];
      lower = chr.toLowerCase();
      if (i === 0 || last == '.' || chr == '.' || chr == '_' || is_number(chr)) {
        output += lower;
      } else if (chr == chr.toUpperCase()) {
        output += '_' + lower;
      } else {
        output += lower;
      }
    }
    return output;
  }
  
  function repeat(o, times, delim) {
    for (var buffer = [], i = times; i--;) {
      buffer.push(o);
    }
    return buffer.join(delim || '');
  }
  
  function replace_all(s0, s1, s2) {
    s1 = s1 ? escape_re(s1) : '';
    if (s0 === undefined || s0 === null) {
      return '';
    } else {
      return String(s0).replace(new RegExp(s1, 'g'), s2 || '');
    }
  }
  
  // http://stackoverflow.com/a/12206089
  function get_utf8_length(s) {
    var len = 0;
    for (var i = 0; i < s.length; i++) {
      var code = s.charCodeAt(i);
      if (code <= 0x7f) {
        len += 1;
      } else if (code <= 0x7ff) {
        len += 2;
      } else if (code >= 0xd800 && code <= 0xdfff) {
        // Surrogate pair: These take 4 bytes in UTF-8 and 2 chars in UCS-2
        // (Assume next char is the other [valid] half and just skip it)
        len += 4; i++;
      } else if (code < 0xffff) {
        len += 3;
      } else {
        len += 4;
      }
    }
    return len;
  }
  
  function stringify(o, simple) {
    if (simple) {
      return is_empty(o) ? '' : pairs(o).map(function(pair) {
        return pair[0] + ':' + pair[1];
      }).join(', ');
    } else {
      if (is_empty(o)) return '{ }';
      return '{ ' + pairs(o).map(function(pair) {
        var value = pair[1];
        return pair[0] + ': ' + (is(value, 'object') ? stringify(value) : value);
      }).join(', ') + ' }';
    }
  }
  
  function map(o, fn, scope) { return o.map(fn, scope); }
  
  function reduce(o, fn, init) { return is_empty(o) ? undefined : o.reduce(fn, init); }
  
  function arg(o) { return array_slice.call(o); }
  
  function to_array(o) {
    if (is_array(o)) {
      return o;
    } else if (o && o.length) {
      return array_slice.call(o);
    } else if (typeof o === 'string') {
      return o.split('');
    } else if (o) {
      return [o];
    } else {
      return [];
    }
  }
  
  function flatten() {
    function _flatten(items) {
      return items.reduce(function(output, input) {
        return input.some(is_array) ? output.concat(flatten(input)) : output.concat(input);
      }, []);
    }
    var args = slice.call(arguments);
    return args.some(is_array) ? _flatten(args) : args;
  }
  
  function compact(array) {
    var index = -1;
    var length = array ? array.length : 0;
    var result = [];
    while (++index < length) {
      var value = array[index];
      if (value) {
        result.push(value);
      }
    }
    return result;
  }
  
  function first(o, count) {
    if (count) {
      return o && o.length ? array_slice.call(o, 0, count) : undefined;
    } else {
      return o && o.length ? o[0] : undefined;
    }
  }
  
  function last(o, count) {
    if (count) {
      return o && o.length ? array_slice.call(o, -count) : undefined;
    } else {
      return o && o.length ? o[o.length -1] : undefined;
    }
  }
  
  function rest(o, index) {
    return o && o.length ? array_slice.call(o, index || 1) : undefined;
  }
  
  function at(o, i) {
    if (o && o.length) {
      return i < 0 ? o[((o.length - 1) + i)] : o[i];
    }
    return undefined;
  }
  
  function range(o, from, to) {
    return o && o.length ? array_slice.call(o, from, to) : undefined;
  }
  
  function _in(item, items) {
    if (is_array(items)) {
      return items.indexOf(item) != -1;
    } else {
      return rest(arguments).indexOf(item) != -1;
    }
  }
  
  function not_in() { return !_in.apply(null, arguments); }
  
  function now(format) {
    var _now = new Date();
    if (format) {
      if (format === 'utc') {
        return _now.toUTCString();
      } else if (format === 'int') {
        return _now.valueOf();
      }
    }
    now.offset = function(offset, unit) {
      if (unit === 'day' || unit === 'days') {
        offset = offset * 24 * 60 * 60 * 1000;
      } else if (unit === 'hour' || unit === 'hours') {
        offset = offset * 60 * 60 * 1000;
      }
      return new Date(now.getTime() + offset);
    };
    return _now;
  }
  
  function date(dt) {
    return new Date(dt);
  }
  
  function file_date() {
    var dt = now();
    var year = dt.getUTCFullYear().toString();
    var month = lpad(dt.getUTCMonth().toString(), '0', 2);
    var day = lpad(dt.getUTCDate().toString(), '0', 2);
    return [year, month, day].join('');
  }
  
  function bind(o, scope) {
    scope = scope || o;
    each(pick(o, function(v) { return is(v, 'function'); }), function(v, k) {
      o[k] = v.bind(scope);
    });
    return o;
  }
  
  function invoke(fn, ctx) {
    if (fn && is(fn, 'function')) {
      return fn.apply(ctx, array_slice.call(arguments, 2));
    }
    return undefined;
  }
  
  function invoke_after(n, fn, ctx) {
    var count = 0;
    return function() {
      if (++count === n) {
        fn.apply(ctx, arguments);
      }
    };
  }
  
  function invoke_delay(milli, fn) {
    var args = rest(arguments, 2);
    var id = setTimeout(function() {
      clearTimeout(id);
      fn.apply(null, args);
    }, milli);
  }
  
  function size(o) {
    if (is_array(o)) {
      return o.length;
    } else {
      return Object.keys(o).length;
    }
  }
  
  function each(o, fn, scope) {
    var no_exit = true;
    if (is_array(o)) {
      for (var i = 0, l = o.length; i < l; i++) {
        if (fn.call(scope, o[i], i, o) === false) {
          no_exit = false;
          break;
        }
      }
    } else {
      var index = 0;
      for (var key in o) {
        if (fn.call(scope, o[key], key, index++, o) === false) {
          no_exit = false;
          break;
        }
      }
    }
    return no_exit;
  }
  
  function each_own(o, fn, scope) {
    var no_exit = true;
    var index = 0;
    for (var key in o) {
      if (o.hasOwnProperty(key)) {
        if (fn.call(scope, o[key], key, index++, o) === false) {
          no_exit = false;
          break;
        }
      }
    }
    return no_exit;
  }
  
  function assign() {
    var target = first(arguments);
    each(rest(arguments), function(source) {
      each(source, function(value, key) {
        if (typeof value !== 'undefined') {
          target[key] = value;
        }
      });
    });
    return target;
  }
  
  function assign_own() {
    var target = first(arguments);
    each(rest(arguments), function(source) {
      each_own(source, function(value, key) {
        if (typeof value !== 'undefined' && target.hasOwnProperty(key)) {
          target[key] = value;
        }
      });
    });
    return target;
  }
  
  function assign_if() {
    var target = first(arguments);
    each(rest(arguments), function(source) {
      var keys = Object.keys(target);
      each(source, function(value, key) {
        if (typeof value !== 'undefined' && keys.indexOf(key) == -1) {
          target[key] = value;
        }
      });
    });
    return target;
  }
  
  function qp_typeof(o, ctor) {
    var type = object_to_string.call(o).slice(8, -1).toLowerCase();
    if (ctor && type === 'object') {
      if (o.constructor && o.constructor.name) {
        type = o.constructor.name.toLowerCase();
        return type === 'object' ? 'pojo' : type;
      } else {
        return 'pojo';
      }
    }
    return type;
  }
  
  function is(o, o_class) {
    var type = qp_typeof(o);
    if (arguments.length > 2) {
      var args = rest(arguments);
      return args.indexOf(type) != -1 || (type === 'object' && args.indexOf(qp_typeof(o, true)));
    } else {
      return type === o_class || (type === 'object' && qp_typeof(o, true) === o_class);
    }
  }
  
  function is_not() { return !is.apply(null, arguments); }
  
  function clone(original) {
    function _clone(o) {
      var copy;
      var type_o = qp_typeof(o);
      if (type_o == 'array') {
        copy = [];
        for (var i = 0, l = o.length; i < l; i++) {
          copy[i] = _clone(o[i]);
        }
      } else if (type_o == 'object') {
        copy = {};
        for (var key in o) {
          if (o.hasOwnProperty(key)) {
            copy[key] = _clone(o[key]);
          }
        }
      } else if (type_o == 'date') {
        copy = new Date(o.getTime());
      } else {
        copy = o;
      }
      return copy;
    }
    return _clone(original);
  }
  
  function copy(o) {
    if (is(o, 'array')) {
      return o.slice(0);
    } else if (is(o, 'object')) {
      return assign({}, o);
    } else if (is(o, 'date')) {
      return new Date(o.getTime());
    } else {
      return o;
    }
  }
  
  function equals(o1, o2) {
    function _equals(a, b) {
      if (a === b) {
        return true;
      } else {
        var type_a = qp_typeof(a);
        var type_b = qp_typeof(b);
        if (type_a == type_b) {
          if (type_a == 'object') {
            var keys_a = Object.keys(a);
            var keys_b = Object.keys(b);
            if (keys_a.length == keys_b.length) {
              keys_a = keys_a.sort();
              keys_b = keys_b.sort();
              if (keys_a.join() == keys_b.join()) {
                for (var i = 0, il = keys_a.length; i < il; i++) {
                  if (!_equals(a[keys_a[i]], b[keys_a[i]])) {
                    return false;
                  }
                }
                return true;
              }
            }
          } else if (type_a == 'array' && a.length == b.length) {
            for (var j = 0, jl = a.length; j < jl; j++) {
              if (!_equals(a[j], b[j])) {
                return false;
              }
            }
            return true;
          }
        }
        return false;
      }
    }
    return _equals(o1, o2);
  }
  
  function extend(a, b) {
    if (is_function(b)) {
      b.apply(null, array_slice.call(arguments, 2));
    }
    for (var key in b) {
      if (b.hasOwnProperty(key)) {
        a[key] = b[key];
      }
    }
  }
  
  function merge() {
    function _merge(a, b) {
      var type_a = qp_typeof(a);
      var type_b = qp_typeof(b);
      if (type_a == 'array' && type_b == 'array') {
        for (var i = 0, l = Math.min(a.length, b.length); i < l; i++) {
          var type_ai = qp_typeof(a[i]);
          var type_bi = qp_typeof(b[i]);
          if (type_ai == 'undefined' && type_bi != 'undefined') {
            a[i] = b[i];
          } else if (type_ai == type_bi) {
            a[i] = _merge(a[i], b[i]);
          }
        }
        if (a.length < b.length) {
          a = a.concat(b.slice(a.length));
        }
      } else if (type_a == 'object' && type_b == 'object') {
        for (var k in b) {
          if (b.hasOwnProperty(k)) {
            var type_ak = qp_typeof(a[k]);
            var type_bk = qp_typeof(b[k]);
            if (type_ak == 'undefined' && type_bk != 'undefined') {
              a[k] = b[k];
            } else {
              a[k] = _merge(a[k], b[k]);
            }
          }
        }
      } else if (type_a == 'undefined') {
        return type_b == 'undefined' ? {} : b;
      }
      return a;
    }
    var target = arguments[0];
    for (var i = 1, l = arguments.length; i < l; i++) {
      target = _merge(target, arguments[i]);
    }
    return target;
  }
  
  function ns(scope, _ns, value) {
    scope = scope || global;
    var setter = arguments.length === 3;
    each(_ns.split('.'), function(part, index, parts) {
      if (setter && index === parts.length - 1) {
        if (!scope[part]) {
          scope[part] = {};
        }
        scope = (scope[part] = value);
      } else {
        scope = scope[part] || (scope[part] = {});
      }
    });
    return scope;
  }
  
  function options(_options, defaults) {
    if (is(_options, 'object') && is(defaults, 'object')) {
      each_own(defaults, function(v, k) {
        if (is(_options[k], 'undefined')) {
          _options[k] = defaults[k];
        }
      });
    } else {
      _options = defaults || _options || {};
    }
    return _options;
  }
  
  function override(a, b) {
    function _override(a, b) {
      var type_a = qp_typeof(a);
      var type_b = qp_typeof(b);
      if (b === undefined || b === 0 || b === null || (b.length && !b.length)) {
        return a;
      } else if (type_a == 'object' && type_b == 'object') {
        for (var k in b) {
          if (b.hasOwnProperty(k)) {
            a[k] = _override(a[k], b[k]);
          }
        }
        return a;
      }
      return b;
    }
    return _override(a, b);
  }
  
  function pick_predicate() {
    if (is(arguments[0], 'function')) {
      return arguments[1] ? arguments[0].bind(arguments[1]) : arguments[0];
    } else {
      var picks = flatten(arguments);
      return function(v, k, o) { return picks.indexOf(k) !== -1; };
    }
    return undefined;
  }
  
  function _pick(o, predicate, options) {
    options = options || {};
    if (predicate) {
      output = {};
      for (var key in o) {
        if (!options.own || o.hasOwnProperty(key)) {
          if (predicate(o[key], key, o)) {
            output[key] = o[key];
          }
        }
      }
      return output;
    }
    return undefined;
  }
  
  function pick(o) {
    return _pick(o, pick_predicate.apply(null, rest(arguments)));
  }
  
  function pick_own(o) {
    return _pick(o, pick_predicate.apply(null, rest(arguments)), { own: true });
  }
  
  function pairs(o) {
    var _pairs = [];
    if (is(o, 'object')) {
      each_own(o, function(v, k) { _pairs.push([k, v]); });
    }
    return _pairs;
  }
  
  function keys(o) {
    var _keys = [];
    for (var key in o) {
      if (o.hasOwnProperty(key)) {
        _keys.push(key);
      }
    }
    return _keys;
  }
  
  function values(o) {
    var _values = [];
    for (var key in o) {
      if (o.hasOwnProperty(key)) {
        _values.push(o[key]);
      }
    }
    return _values;
  }
  
  function pick_values(o) {
    var keys = flatten(rest(arguments));
    var output = [];
    for (var key in o) {
      if (o.hasOwnProperty(key)) {
        if (keys.indexOf(key) !== -1) {
          output.push(o[key]);
        }
      }
    }
    return output;
  }
  
  function series() {
    var data = arguments[2] ? arguments[0] : null;
    var actions = arguments[2] ? arguments[1] : arguments[0];
    var done = arguments[2] ? arguments[2] : arguments[1];
    var results = {};
    function next() {
      var action = actions.shift();
      if (action) {
        action[1](data, function(error, result) {
          results[action[0]] = result;
          if (error) {
            done(error, results);
          } else {
            next();
          }
        });
      } else {
        done(null, results);
      }
    }
    next();
  }
  
  function parallel() {
    var data = arguments[2] ? arguments[0] : null;
    var actions = arguments[2] ? arguments[1] : arguments[0];
    var done = arguments[2] ? arguments[2] : arguments[1];
    var errors = null;
    var results = {};
    var remaining = size(actions) - 1;
    each(actions, function(action, key) {
      action(data, function(error, result) {
        if (error) {
          errors = errors || {};
          errors[key] = error;
        }
        results[key] = result;
        remaining--;
        if (!remaining) {
          done(errors, results);
        }
      });
    });
  }
  
  function find_predicate(arg1, arg2) {
    var predicate;
    if (is(arg1, 'function')) {
      predicate = arg2 ? arg1.bind(arg2) : arg1;
    } else if (is(arg1, 'object')) {
      var keys = keys(arg1);
      var values = values(arg1);
      predicate = function(item, index, items) {
        return equals(pick_values(item, keys), values);
      };
    } else if (is(arg1, 'string')) {
      var truthy = is(arg2, 'undefined');
      predicate = function(item, index, items) {
        var value = item[arg1];
        return truthy ? value : value === arg2;
      };
    }
    return predicate;
  }
  
  function find(items, arg1, arg2, options) {
    options = options || {};
    var output_all = options.find_all || options.remove_all;
    var match_index = [];
    var match_value = [];
    if (is_not_empty(items)) {
      var predicate = find_predicate(arg1, arg2);
      if (predicate) {
        for (var i = 0, il = items.length; i < il; i++) {
          var item = items[i];
          if (predicate(item, i, items)) {
            match_index.push(i);
            match_value.push(options.index ? i : item);
            if (!output_all) { break; }
          }
        }
        if (options.remove || options.remove_all) {
          for (var j = 0, jl = match_index.length; j < jl; j++) {
            items.splice(match_index[j], 1);
          }
        }
      }
    }
    return output_all ? match_value : match_value[0];
  }
  
  function any(items, arg1, arg2) {
    return find(items, arg1, arg2, { find: true }) !== undefined;
  }
  
  function find_all(items, arg1, arg2) {
    return find(items, arg1, arg2, { find_all: true });
  }
  
  function find_index(items, arg1, arg2) {
    return find(items, arg1, arg2, { index: true });
  }
  
  function remove(items, arg1, arg2) {
    return find(items, arg1, arg2, { remove: true });
  }
  
  function remove_all(items, arg1, arg2) {
    return find(items, arg1, arg2, { remove_all: true });
  }
  
  var identity = 101;
  
  function id(use_date) {
    if (use_date) {
      return String(new Date().getTime() + identity++);
    } else {
      return String(identity++);
    }
  }
  
  function uuid() {
    var d = new Date().getTime();
    var _uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r&0x7|0x8)).toString(16);
    });
    return _uuid;
  }
  
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
  
  function sort(items, fn) {
    return items.sort(fn);
  }
  
  function sort_on(items, keys, options) {
    var stable_sort = true;
    if (stable_sort) {
      for (var i = 0, l = items.length; i < l; i++) {
        items[i].sort_index = i;
      }
    }
    each(keys, function(key) {
      items.sort(function(o1, o2) {
        var v1 = o1[key], v2 = o2[key];
        if (v1 > v2) { return 1; }
        if (v1 < v2) { return -1; }
        if (stable_sort) {
          return o1.sort_index > o2.sort_index ? 1 : -1;
        }
        return 0;
      });
    });
  }
  
  function group_on(items, key, name, sort_key) {
    var sort = [ key ];
    if (sort_key) {
      sort.push(sort_key);
    }
    sort_on(items, sort);
    var group;
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var item_key = ns(item, key);
      if (!group || item_key !== group.key) {
        group = { group: true, key: item_key, name: ns(item, name) };
        items.splice(i, 0, group);
      }
    }
    return items;
  }
  
  function group_by(items, key, name, sort_key) {
    var sort = [ key ];
    if (sort_key) {
      sort.push(sort_key);
    }
    var groups = [];
    var group;
    each(sort_on(items, sort), function(item) {
      var item_key = ns(item, key);
      if (!group || item_key !== group.key) {
        group = {
          group: true,
          key: item_key,
          name: ns(item, name),
          items: [item]
        };
        groups.push(group);
      } else {
        group.items.push(item);
      }
    });
    return groups;
  }
  
  var qp = {
    escape_re: escape_re,
    trim: trim,
    ltrim: ltrim,
    rtrim: rtrim
  };
  
  global.qp = qp;

})(this);