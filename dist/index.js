(function(global) {
  var array_slice = Array.prototype.slice;
  var object_to_string = Object.prototype.toString;
  var is_array = Array.isArray;
  
  function noop() { }
  
  function is_number(o) { return o - parseFloat(o) >= 0; }
  
  function is_function(o) { return typeof o === 'function'; }
  
  function escape_re(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
  
  function random(min, max) { return Math.floor(Math.random() * (max - min)) + min; }
  
  function is_empty(o) { return typeof o === 'undefined' || o === null || (o.length && o.length === 0); }
  
  function not_empty(o) { return !is_empty(o); }
  
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
  
  function split(s, chars) {
    return s.split(chars);
  }
  
  function build() {
    return compact(flatten(arguments)).join('');
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
  
  function to_camel(s, sep) {
    var out = '';
    for (var i = 0, l = s.length; i < l; i++) {
      var chr = s[i];
      if (i === 0) {
        out += chr.toUpperCase();
      } else if (chr === sep) {
        out += s[++i].toUpperCase();
      } else {
        out += chr;
      }
    }
    return out;
  }
  
  function camel_to(s, sep) {
    var out = '';
    var chr = '';
    var last = '';
    var lower = '';
    for (var i = 0, l = s.length; i < l; i++) {
      last = chr;
      chr = s[i];
      lower = chr.toLowerCase();
      if (i === 0 || last == '.' || chr == '.' || chr == sep || is_number(chr)) {
        out += lower;
      } else if (chr == chr.toUpperCase()) {
        out += sep + lower;
      } else {
        out += lower;
      }
    }
    return out;
  }
  
  function snake_to_kebab(s) { return replace_all(s, '_', '-'); }
  function snake_to_camel(s) { return to_camel(s, '_'); }
  function camel_to_snake(s) { return camel_to(s, '_'); }
  function camel_to_kebab(s) { return camel_to(s, '-'); }
  function kebab_to_camel(s) { return to_camel(s, '-'); }
  function kebab_to_snake(s) { return replace_all(s, '-', '_'); }
  
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
      return qp.is_empty(o) ? '' : '{ ' + qp.pairs(o).map(function(pair) {
        var value = pair[1];
        if (qp.is(value, 'array')) value = '[ ' + value.length + ' ]';
        if (qp.is(value, 'object')) value = '{ }';
        return pair[0] + ': ' + value;
      }).join(', ') + ' }';
    } else {
      if (qp.is_empty(o)) return '{ }';
      if (qp.is_not(o, 'object', 'array')) return o;
      return '{ ' + qp.pairs(o).map(function(pair) {
        var value = pair[1];
        if (qp.is(value, 'function')) {
          return pair[0] + ': fn';
        } else if (qp.is(value, 'array')) {
          return pair[0] + ': [ ' + qp.map(value, function(item) {
            return qp.stringify(item);
          }).join(', ') + ' ]';
        } else if (qp.is(value, 'object')) {
          return pair[0] + ': ' + qp.stringify(value);
        } else {
          return pair[0] + ': ' + value;
        }
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
  
  function union() {
    return slice.call(arguments).reduce(function(output, input) {
      return output.concat(input);
    }, []);
  }
  
  function flatten() {
    function _flatten(items) {
      return items.reduce(function(output, input) {
        return any(input, is_array) ? output.concat(flatten(input)) : output.concat(input);
      }, []);
    }
    var args = slice.call(arguments);
    return any(args, is_array) ? _flatten(args) : args;
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
  
  var month_long = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var month_short = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var day_long = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  var day_short = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  
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
  
  function date_time(dt) {
    dt = (typeof dt === 'string' ? new Date(dt) : dt);
    return {
      format: function(format) {
        if (format === 'utc') {
          return dt.toUTCString();
        } else if (format === 'month day, year') {
          return month_short[dt.getMonth()] + ' ' + dt.getDate() + ', ' + dt.getFullYear();
        }
        return dt;
      }
    };
  }
  
  function timer() {
    var start = new Date();
    var lap = start;
    return {
      elapsed: function() {
        return ((new Date() - start) / 1000).toFixed(2);
      },
      lap: function() {
        var last_lap = lap;
        lap = new Date();
        return ((lap - last_lap) / 1000).toFixed(2);
      }
    };
  }
  
  function bind(o, scope) {
    scope = scope || o;
    each(pick(o, function(v) { return is(v, 'function'); }), function(v, k) {
      o[k] = v.bind(scope);
    });
    return o;
  }
  
  function invoke(fn, ctx) {
    if (is(fn, 'function')) {
      return fn.apply(ctx, array_slice.call(arguments, 2));
    } else if (is(fn, 'array')) {
      var args = array_slice.call(arguments, 2);
      return map(fn, function(func) { return func.apply(ctx, args); });
    }
    return undefined;
  }
  
  function invoke_after(fn, n, ctx) {
    var count = 0;
    return function() {
      if (++count === n) {
        fn.apply(ctx, arguments);
      }
    };
  }
  
  function invoke_delay(fn, milli) {
    var args = rest(arguments, 2);
    var id = setTimeout(function() {
      clearTimeout(id);
      fn.apply(null, args);
    }, milli);
  }
  
  function invoke_next(fn) {
    if (global.process && global.process.nextTick) {
      process.nextTick(fn);
    } else {
      setTimeout(fn, 0);
    }
  }
  
  function invoke_when(fn, check, interval) {
    (function timer_event() {
      invoke_delay(interval || 500, function() {
        if (check()) {
          fn();
        } else {
          timer_event();
        }
      });
    })();
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
      b = b.apply(null, array_slice.call(arguments, 2));
    }
    for (var key in b) {
      if (b.hasOwnProperty(key)) {
        a[key] = b[key];
      }
    }
    return a;
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
      var picks = flatten(array_slice.call(arguments));
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
    var args = arg(arguments);
    var data = args[2] ? args[0] : null;
    var actions = args[2] ? args[1] : args[0];
    var done = args[2] ? args[2] : args[1];
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
    var args = arg(arguments);
    var data = args[2] ? args[0] : null;
    var actions = args[2] ? args[1] : args[0];
    var done = args[2] ? args[2] : args[1];
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
    if (qp.is(arg1, 'function')) {
      predicate = qp.is_not_empty(arg2) ? arg1.bind(arg2) : arg1;
    } else if (qp.is(arg1, 'object')) {
      var keys = qp.keys(arg1);
      predicate = function(item, index, items) {
        return qp.eq(qp.pick(item, keys), arg1);
      };
    } else if (qp.is(arg1, 'string')) {
      var truthy = qp.is(arg2, 'undefined');
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
  
  function all(items, arg1, arg2) {
    return qp.find_all(items, arg1, arg2, { find_all: true }).length !== 0;
  }
  
  function none(items, arg1, arg2) {
    return qp.find_all(items, arg1, arg2, { find_all: true }).length === 0;
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
    ctor.inits = [];
  
    if (def.mixin) {
      each(def.mixin.reverse(), function(mixin) {
        ctor.mixins.push(mixin.ns);
        ctor.inits.unshift(mixin.inits);
        override(ctor.properties, mixin.properties);
        override(ctor.prototype, mixin.prototype);
      });
      mixin.inits = flatten(mixin.inits);
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
  
  function sort(items, fn) {
    return items.sort(fn);
  }
  
  function sort_on(items, keys, _options) {
    var opts = options(_options, { stable: true });
    keys = is_array(keys) ? keys : keys.split(',');
    if (opts.stable) {
      for (var i = 0, l = items.length; i < l; i++) {
        items[i].sort_index = i;
      }
    }
    each(keys, function(key) {
      items.sort(function(o1, o2) {
        var v1 = o1[key], v2 = o2[key];
        if (v1 > v2) { return 1; }
        if (v1 < v2) { return -1; }
        if (opts.stable) {
          return o1.sort_index > o2.sort_index ? 1 : -1;
        }
        return 0;
      });
    });
    return items;
  }
  
  function group_on(items, key, name, sort_key, options) {
    options = options || {};
    name = name || key;
    var sort = [ key ];
    if (sort_key) sort.push(sort_key);
    qp.sort_on(items, sort, { stable: true });
    var group;
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var item_key = qp.ns(item, key);
      if (!group || item_key !== group.key) {
        var group_name = typeof name === 'function' ? name(item, item_key, i) : qp.ns(item, name);
        group = { group: true, key: item_key, name: group_name, count: 1 };
        if (options.group_items) {
          group.items = [ item ];
        }
        items.splice(i, 0, group);
      }
      group.count++;
      if (group.items) {
        group.items.push(item);
      }
    }
    return items;
  }
  
  function group_by(items, group_key, group_name, sort_key) {
    group_name = group_name || group_key;
    var sort = [ group_key ];
    if (sort_key) sort.push(sort_key);
    var groups = [];
    var group;
    sort_on(items, sort, { stable: true }).forEach(function(item) {
      var item_key = ns(item, group_key);
      if (!group || item_key !== group.key) {
        group = {
          group: true,
          key: item_key,
          name: ns(item, group_name),
          items: [item]
        };
        groups.push(group);
      } else {
        group.items.push(item);
      }
    });
    return groups;
  }
  
  function sum(o, key) {
    if (is_array(o)) {
      if (key) {
        return o.reduce(function(sum, item) { return sum + item[key]; }, 0);
      } else {
        return o.reduce(function(sum, item) { return sum + item; }, 0);
      }
    }
    return 0;
  }
  
  function min_max(o, k, op) {
    if (is_array(o)) {
      if (k) {
        o = o.map(function(item) { return item[k]; });
      }
      return Math[op].apply(Math, o);
    }
    return 0;
  }
  
  function avg(o, k) { return sum(o, k) / (o.length || 1); }
  function max(o, k) { return min_max(o, k, 'max'); }
  function min(o, k) { return min_max(o, k, 'min'); }
  
  var qp = {
  
    // core.js
    noop: noop,
    escape_re: escape_re,
    is_number: is_number,
    is_function: is_function,
    random: random,
    is_empty: is_empty,
    not_empty: not_empty,
  
    // string.js
    trim: trim,
    ltrim: ltrim,
    rtrim: rtrim,
    split: split,
    build: build,
    escape: escape,
    unescape: unescape,
    lpad: lpad,
    rpad: rpad,
    starts: starts,
    ends: ends,
    between: between,
    snake_to_camel: snake_to_camel,
    camel_to_snake: camel_to_snake,
    repeat: repeat,
    replace_all: replace_all,
    get_utf8_length: get_utf8_length,
    stringify: stringify,
  
    // math.js
    sum: sum,
    min: min,
    max: max,
    avg: avg,
  
    // array.js
    map: map,
    reduce: reduce,
    arg: arg,
    to_array: to_array,
    flatten: flatten,
    compact: compact,
  
    // date.js
    now: now,
    date: date,
    file_date: file_date,
  
    // function.js
    bind: bind,
    invoke: invoke,
    invoke_after: invoke_after,
    invoke_delay: invoke_delay,
    invoke_next: invoke_next,
  
    // typeof.js
    typeof: qp_typeof,
    is: is,
    is_not: is_not,
  
    // iteration.js
    size: size,
    each: each,
    each_own: each_own,
  
    // assign.js
    assign: assign,
    assign_own: assign_own,
    assign_if: assign_if,
  
    // equals.js
    equals: equals,
    // clone.js
    clone: clone,
    // copy.js
    copy: copy,
    // merge.js
    merge: merge,
    // extend.js
    extend: extend,
    // override
    override: override,
    // make.js
    make: make,
  
    // collection.js
    first: first,
    last: last,
    rest: rest,
    at: at,
    range: range,
    in: _in,
    not_in: not_in,
  
    // find.js
    find_predicate: find_predicate,
    find: find,
    any: any,
    exists: any,
    find_all: find_all,
    find_index: find_index,
    remove: remove,
    remove_all: remove_all,
  
    // pick
    pick_predicate: pick_predicate,
    pick: pick,
    pick_own: pick_own,
    pairs: pairs,
    keys: keys,
    values: values,
    pick_values: pick_values,
  
    // sort.js
    sort: sort,
    sort_on: sort_on,
    group_on: group_on,
    group_by: group_by,
  
    // ns.js
    ns: ns,
  
    // options.js
    options: options,
  
    // id.js
    id: id,
    uuid: uuid,
  
    // async.js
    series: series,
    parallel: parallel
  
  };
  

  if (global.define) global.define.make = qp.make
  if (module && module.exports) {
    module.exports = qp;
  } else {
    global.qp = qp;
  }

})(this);