(function(global, undefined) {

  function eol() {
    return '\n';
  }
  
  var is_array = Array.isArray;
  var slice = Array.prototype.slice;
  var concat = Array.prototype.concat;
  var to_string = Object.prototype.toString;
  var for_each = Array.prototype.forEach;
  var class_re = /^\.([\w\-]+)$/;
  
  function noop(o) { return o; }
  
  function noop_callback(data, done) { invoke_next(done, null, data); }
  
  function is_value(o) { return typeof o !== 'undefined' && o !== null; }
  
  function is_number(o) { return o - parseFloat(o) >= 0; }
  
  function is_string(o) { return typeof o === 'string'; }
  
  function is_function(o) { return typeof o === 'function'; }
  
  function defined(o) { return !not_defined(o); }
  
  function not_defined(o) { return typeof o === 'undefined'; }
  
  function escape_re(o) { return o.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); }
  
  function random(min, max) { return Math.floor(Math.random() * (max - min)) + min; }
  
  function is_array_like(o) { return !is_array(o) && is_value(o) && !is_string(o) && !is_function(o) && o.length; }
  
  function empty(o) {
    return typeof o === 'undefined' || o === null ||
      (is_array(o) && o.length === 0) ||
      (is_string(o) && o.length === 0) ||
      (is_number(o) && o === 0);
  }
  
  function not_empty(o) { return !empty(o); }
  
  function dfault(value, dfault_value) { return not_defined(value) ? dfault_value : value; }
  
  function lower(s) {
    return String(s).toLocaleLowerCase();
  }
  
  function upper(s) {
    return String(s).toLocaleUpperCase();
  }
  
  function trim(s, chars) {
    if (s === undefined || s === null) {
      return '';
    } else if (chars === undefined || chars === null) {
      var trim_re = /(^\s+|\s+$)/g;
      return String(s).replace(trim_re, '');
    } else {
      chars = escape_re(chars);
      return String(s).replace(new RegExp('^' + chars + '+|' + chars + '+$', 'g'), '');
    }
  }
  
  function ltrim(s, chars) {
    chars = chars ? escape_re(chars) : ' ';
    if (s === undefined || s === null) {
      return '';
    } else {
      return String(s).replace(new RegExp('^' + chars + '+'), '');
    }
  }
  
  function rtrim(s, chars) {
    chars = chars ? escape_re(chars) : ' ';
    if (s === undefined || s === null) {
      return '';
    } else {
      return String(s).replace(new RegExp(chars + '+$'), '');
    }
  }
  
  function clean_whitespace(s) {
    var newline_re = /\r?\n|\r/g;
    var trim_re = /(^\s+|\s+$)/g;
    if (s === undefined || s === null) {
      return '';
    } else {
      return String(s).replace(newline_re, ' ').replace(trim_re, '');
    }
  }
  
  function split(s, chars) {
    return s.split(chars);
  }
  
  function lines(s) {
    return String(s).split(/\r\n|\r|\n/g);
  }
  
  function build() {
    return compact(flatten(to_array(arguments))).join('');
  }
  
  function plural(o, prefix, single, multi, suffix) {
    var size = size(o);
    return size + ' ' + (prefix || '') + (size > 1 ? multi : single) + (suffix || '');
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
    return pad(s, padding, width, false);
  }
  
  function rpad(s, padding, width) {
    return pad(s, padding, width, true);
  }
  
  function pad(s, padding, width, rpad) {
    if (s === undefined || s === null) {
      return '';
    } else {
      if (not_defined(width)) {
        width = padding;
        padding = ' ';
      }
      s = String(s);
      while (s.length < width) {
        s = rpad ? s + padding : padding + s;
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
  
  function before(s, str) {
    return s.slice(0, s.indexOf(str));
  }
  
  function before_last(s, str) {
    return s.slice(0, s.lastIndexOf(str));
  }
  
  function after(s, str) {
    return s.slice(s.indexOf(str) + str.length);
  }
  
  function after_last(s, str) {
    return s.slice(s.lastIndexOf(str) + str.length);
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
  
  function title_case(s) {
    return s.replace(/\w+/g, function(o) {
      return o.charAt(0).toUpperCase() + o.substr(1).toLowerCase();
    });
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
  
  function increase_indent(o, indent, times, options) {
    options = options || {};
    if (is_value(indent)) {
      if (is_number(indent)) {
        times = indent;
        indent = '  ';
      } else {
        if (is_value(times) && times > 1) {
          indent = repeat(indent, times);
        }
      }
    } else {
      indent = '  ';
    }
    return o.split('\n').map(function(line, index) {
      if (index === 0 && options.ignore_first_line) {
        return line;
      } else {
        return indent + line;
      }
    }).join('\n');
  }
  
  function hashcode(s) {
    var h = 0;
    if (s.length === 0) return h;
    for (var i = 0, l = s.length; i < l; i++) {
      var c = s.charCodeAt(i);
      h = ((h << 5) - h) + c;
      h = h & h;
    }
    return h;
  }
  
  /* To Title Case 2.1 – http://individed.com/code/to-title-case */
  /* Copyright © 2008–2013 David Gouch. Licensed under the MIT License. */
  function title_case(s) {
    var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;
    return s.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function(match, index, title) {
      if (index > 0 && index + match.length !== title.length &&
        match.search(smallWords) > -1 && title.charAt(index - 2) !== ":" &&
        (title.charAt(index + match.length) !== '-' || title.charAt(index - 1) === '-') &&
        title.charAt(index - 1).search(/[^\s-]/) < 0) {
        return match.toLowerCase();
      }
      if (match.substr(1).search(/[A-Z]|\../) > -1) {
        return match;
      }
      return match.charAt(0).toUpperCase() + match.substr(1);
    });
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
  
  function format(s, o, options) {
    if (is(o, 'object')) {
      options = qp_options(options, { leave_unmatched: false });
      return s.replace(/\{{([A-Za-z0-9_\.]+)\}}/g, function(t, k) {
        var v = get(o, k);
        return v === undefined ? options.leave_unmatched ? t : '' : v;
      });
    } else {
      o = flatten(slice.call(arguments, 1));
      return s.replace(/\{{([0-9]+)\}}/g, function (_, i) {
        var v = o[i];
        return v === undefined ? '' : v;
      });
    }
  }
  
  function stringify(o, options) {
    if (qp.is(format, 'string') && format === 'json') {
      return JSON.stringify(o, null, '  ');
    } else {
      if (o && o.toJSON) o = o.toJSON();
      if (options === true) {
        return empty(o) ? '' : '{ ' + pairs(o).map(function(pair) {
          var value = pair[1];
          var type = qp_typeof(value);
          if (type === 'function') value = value.name || 'fn';
          if (type === 'array') value = '[ ' + value.length + ' ]';
          if (type === 'object') {
            if (empty(value)) value = '{ }'; else value = '{ … }';
          }
          return pair[0] + ': ' + value;
        }).join(', ') + ' }';
      } else {
        if (empty(o)) return '{ }';
        if (is_not(o, 'object', 'array')) return o;
        return '{ ' + pairs(o).map(function(pair) {
          var value = pair[1];
          if (is(value, 'function')) {
            return pair[0] + ': ' + value.name || 'fn';
          } else if (is(value, 'array')) {
            return pair[0] + ': [ ' + map(value, function(item) {
              return stringify(item);
            }).join(', ') + ' ]';
          } else if (is(value, 'object')) {
            return pair[0] + ': ' + stringify(value);
          } else {
            return pair[0] + ': ' + value;
          }
        }).join(', ') + ' }';
      }
    }
  }
  
  function reduce(o, fn, init) {
    return is(o, 'array') ? o.reduce(fn, init) : undefined;
  }
  
  function arg(o) { return slice.call(o); }
  
  function to_array(o) {
    if (is_array(o)) {
      return o;
    } else if (o && o['length']) {
      return slice.call(o);
    } else if (typeof o === 'string') {
      return o.split('');
    } else if (typeof o === 'number') {
      return o === 0 ? [] : new Array(o);
    } else if (o) {
      return [o];
    } else {
      return [];
    }
  }
  
  function union() {
    return slice.call(arguments).reduce(function(output, input) {
      return to_array(output).concat(to_array(input));
    }, []);
  }
  
  function unique(o, fn) {
    var unique = [];
    if (is_array(o)) {
      fn = fn || function(items, item) { return items.indexOf(item) === -1; };
      for (var i = 0, l = o.length; i < l; i++) {
        var item = o[i];
        if (fn(unique, item)) unique.push(item);
      }
    }
    return unique;
  }
  
  function flatten() {
    function _flatten(items) {
      return reduce(items, function(output, input) {
        return any(input, is_array) ? output.concat(_flatten(input)) : output.concat(input);
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
  
  function clear(o) {
    if (is_array(o)) {
      for (var i = 0, l = o.length; i < l; i++) { o.pop(); }
    } else {
      for (var key in o) { if (o.hasOwnProperty(key)) { delete o[key]; } }
    }
    return o;
  }
  
  function push(o, value) {
    if (is_array(value)) {
      if (!is_array(o)) {
        o = value;
      } else {
        for (var i = 0, l = value.length; i < l; i++) { o.push(value[i]); }
      }
    } else if (value === undefined) {
      if (!is_array(o)) {
        o = [];
      }
    } else {
      if (!is_array(o)) {
        o = [ value ];
      } else {
        o.push(value);
      }
    }
    return o;
  }
  
  function load(o, value) {
    clear(o);
    push(o, value);
  }
  
  function has_key(o, k) {
    return Object.keys(o).indexOf(k) !== -1;
  }
  
  function delete_key(o, k, d) {
    if (not_defined(o)) {
      return d;
    } else if (not_defined(k) || not_defined(o[k])) {
      return d;
    } else {
      var v = o[k];
      delete o[k];
      return v;
    }
  }
  
  function qp_delete(o, k) {
    if (not_defined(o)) {
      o = { };
    } else if (not_defined(k) || not_defined(o[k])) {
    } else {
      delete o[k];
    }
    return o;
  }
  
  var month_long = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var month_short = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var day_long = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  var day_short = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  var iso_date_re = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+/;
  
  function now(format) {
    var _now = new Date();
    if (format) {
      if (format === 'utc') {
        return _now.toUTCString();
      } else if (format === 'iso') {
        return _now.toISOString();
      } else if (format === 'int') {
        return _now.getTime();
      } else if (format === 'string') {
        return String(_now.getTime());
      } else if (format === 'time') {
        var hours = lpad(_now.getUTCHours().toString(), '0', 2);
        var minutes = lpad(_now.getUTCMinutes().toString(), '0', 2);
        var seconds = lpad(_now.getUTCSeconds().toString(), '0', 2);
        return [hours, minutes, seconds].join(':');
      }
    }
    _now.offset = function(offset, unit) {
      if (unit === 'day' || unit === 'days') {
        offset = offset * 24 * 60 * 60 * 1000;
      } else if (unit === 'hour' || unit === 'hours') {
        offset = offset * 60 * 60 * 1000;
      }
      return new Date(_now.getTime() + offset);
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
  
  function get_fn_name(fn) {
    if (fn.name) {
      return fn.name;
    } else {
      var fn_name_re = /function\s([^(]{1,})\(/;
      var results = fn_name_re.exec(fn.toString());
      return (results && results.length > 1) ? results[1].trim() : '';
    }
  }
  
  function combine() {
    var fns = slice.call(arguments);
    return function() {
      for (var i = 0, l = fns.length; i < l; i++) {
        fns[i].apply(null, arguments);
      }
    };
  }
  
  function done() {
    var args = slice.call(arguments);
    var type = qp_typeof(args[0]);
    if (type === 'object') {
      invoke_next(args[0].done.bind(args[0].context || args[0].bind), args[1], args[2]);
    } else if (type === 'function') {
      invoke_next(args[0].bind(args[1]), args[2], args[3]);
    }
    return null;
  }
  
  function bind(o) {
    if (arguments.length === 1 || (arguments.length === 2 && is(arguments[1], 'object'))) {
      var scope = arguments[1] || o;
      each(pick(o, function(v) { return is(v, 'function'); }), function(v, k) {
        o[k] = v.bind(scope);
      });
    } else {
      each(rest(arguments), function(v, k) {
        o[k] = v.bind(o);
      });
    }
    return o;
  }
  
  function invoke(fn, ctx) {
    var type = qp_typeof(arguments[0]);
    if (fn && type === 'function') {
      return fn.apply(ctx, slice.call(arguments, 2));
    } else if (type === 'array') {
      var args = slice.call(arguments, 2);
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
  
  function invoke_delay(milli, fn) {
    var args = rest(arguments, 2);
    var id = setTimeout(function() {
      clearTimeout(id);
      fn.apply(null, args);
    }, milli);
    return id;
  }
  
  function invoke_next(fn) {
    var args = rest(arguments);
    if (global.process && global.process.nextTick) {
      process.nextTick(fn.bind(null, args));
    } else {
      var id = setTimeout(function() {
        clearTimeout(id);
        fn.apply(null, args);
      }, 0);
    }
  }
  
  function invoke_when(fn, check, interval) {
    (function timer_event() {
      invoke_delay(interval || 500, function() {
        if (check()) fn(); else timer_event();
      });
    })();
  }
  
  function debounce(fn, wait, immediate, scope) {
    var timeout;
    return function() {
      var context = scope || this, args = slice.call(arguments);
      var later = function() {
        timeout = clearTimeout(timeout);
        if (!immediate && fn) fn.apply(context, args);
      };
      var call = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (call && fn) fn.apply(context, args);
    };
  }
  
  function throttle(fn, threshhold, scope) {
    threshhold = threshhold || 250;
    var last, deferTimer;
    return function () {
      var context = scope || this;
      var now = +(new Date()), args = slice.call(arguments);
      if (last && now < last + threshhold) {
        clearTimeout(deferTimer);
        deferTimer = setTimeout(function () {
          last = now;
          fn.apply(context, args);
        }, threshhold);
      } else {
        last = now;
        fn.apply(context, args);
      }
    };
  }
  
  function patch(scope, fn_name, patch) {
    var base = scope[fn_name];
    scope[fn_name] = patch.bind(scope, base.bind(scope));
  }
  
  function get(o, key, dfault) {
    var value = dfault;
    if (is(o, 'object')) {
      var item = o;
      var path = key.split('.');
      for (var i = 0, l = path.length; i < l; i++) {
        item = item[path[i]];
        if (item === undefined) break;
        if (i == (l - 1)) value = item;
      }
    }
    return value;
  }
  
  function take(o, key, dfault) {
    var value = dfault;
    if (is(o, 'object')) {
      var item = o;
      var last;
      var path = key.split('.');
      for (var i = 0, l = path.length; i < l; i++) {
        last = item;
        item = item[path[i]];
        if (item === undefined) break;
        if (i == (l - 1)) {
          delete last[path[i]];
          value = item;
        }
      }
    }
    return value;
  }
  
  function has(o, key) {
    var has = false;
    if (is(o, 'object')) {
      var item = o;
      var path = key.split('.');
      for (var i = 0, l = path.length; i < l; i++) {
        var item_key = path[i];
        if (item.hasOwnProperty(item_key)) {
          item = item[item_key];
          if (item === undefined) break;
          if (i == (l - 1)) has = true;
        } else { break; }
      }
    }
    return has;
  }
  
  function set(o, key, value) {
    var item = o;
    var path = key.split('.');
    for (var i = 0, l = path.length; i < l; i++) {
      if (i == (l - 1)) {
        item[path[i]] = value;
        break;
      } else if (item[path[i]] === undefined) {
        item = item[path[i]] = {};
      } else {
        item = item[path[i]];
      }
    }
    return o;
  }
  
  function assign() {
    var target = first(arguments) || {};
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
    var target = first(arguments) || {};
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
    var type = to_string.call(o).slice(8, -1).toLowerCase();
    if (ctor && type === 'object') {
      if (o.constructor) {
        type = get_fn_name(o.constructor).toLowerCase();
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
    var type = qp_typeof(o);
    if (type === 'array') {
      return o.slice(0);
    } else if (type === 'object') {
      return assign({}, o);
    } else if (type === 'date') {
      return new Date(o.getTime());
    } else {
      return o;
    }
  }
  
  function neq(o1, o2) { return !eq(o1, o2); }
  
  function eq(o1, o2) {
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
      b = b.apply(null, slice.call(arguments, 2));
    }
    for (var key in b) {
      if (b.hasOwnProperty(key)) {
        var v = b[key];
        if (is_function(v)) {
          a[key] = v.bind(a);
        } else {
          a[key] = v;
        }
      }
    }
    return a;
  }
  
  function merge(target, source, override) {
    function _merge(a, b) {
      var type_a = qp_typeof(a);
      var type_b = qp_typeof(b);
      if (type_a == 'array' && type_b == 'array') {
        for (var i = 0, l = Math.min(a.length, b.length); i < l; i++) {
          var type_ai = qp_typeof(a[i]);
          var type_bi = qp_typeof(b[i]);
          if (override && type_bi != 'undefined') {
            a[i] = b[i];
          } else if (type_ai == 'undefined' && type_bi != 'undefined') {
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
            if (override && type_bk != 'undefined') {
              a[k] = b[k];
            } else if (type_ak == 'undefined' && type_bk != 'undefined') {
              a[k] = b[k];
            } else {
              a[k] = _merge(a[k], b[k]);
            }
          }
        }
      } else if (override && type_b != 'undefined') {
        return b;
      } else if (type_a == 'undefined') {
        return b;
      }
      return a;
    }
    return _merge(target, source);
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
  
  function qp_options(_options, defaults) {
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
  
  function override(target, source) {
    return merge(target, source, true); 
  }
  
  function pick_predicate() {
    if (is_function(arguments[0])) {
      return arguments[1] ? arguments[0].bind(arguments[1]) : arguments[0];
    } else {
      var picks = flatten(slice.call(arguments));
      return function(v, k, o) { return picks.indexOf(k) !== -1; };
    }
    return undefined;
  }
  
  function _pick(o, predicate, options) {
    options = options || {};
    if (predicate) {
      var output = {};
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
  
  function get_data(original) {
    var non_transferable = 'NON_TRANSFERABLE';
    function _get_data(o) {
      var data = non_transferable;
      var value;
      var type_o = qp_typeof(o);
      if (type_o == 'array') {
        data = [];
        for (var i = 0, l = o.length; i < l; i++) {
          value = _get_data(o[i]);
          if (value === non_transferable) value = undefined;
          data[i] = value;
        }
      } else if (type_o == 'date' || (o && o.toISOString)) {
        data = o.toISOString();
      } else if (type_o == 'object') {
        data = {};
        for (var key in o) {
          if (o.hasOwnProperty(key)) {
            value = _get_data(o[key]);
            if (value !== non_transferable) data[key] = value;
          }
        }
      } else if (type_o == 'number' || type_o == 'string' || type_o == 'boolean') {
        data = o;
      }
      return data;
    }
    return _get_data(original);
  }
  
  function set_data(original) {
    function _set_data(o) {
      var type_o = qp_typeof(o);
      if (type_o == 'array') {
        for (var i = 0, l = o.length; i < l; i++) {
          o[i] = _set_data(o[i]);
        }
      } else if (type_o == 'object') {
        for (var key in o) {
          if (o.hasOwnProperty(key)) o[key] = _set_data(o[key]);
        }
      } else if (type_o == 'string') {
        if (iso_date_re.test(o)) {
          if (moment) {
            return moment(o);
          } else {
            return new Date(o);
          }
        }
      }
      return o;
    }
    return _set_data(original);
  }
  
  function first(o, count) {
    if (count) {
      return o && o.length ? slice.call(o, 0, count) : undefined;
    } else {
      return o && o.length ? o[0] : undefined;
    }
  }
  
  function last(o, count) {
    if (count) {
      return o && o.length ? slice.call(o, -count) : undefined;
    } else {
      return o && o.length ? o[o.length -1] : undefined;
    }
  }
  
  function rest(o, index) {
    return o && o.length ? slice.call(o, index || 1) : undefined;
  }
  
  function at(o, i) {
    if (o && o.length) {
      return i < 0 ? o[((o.length - 1) + i)] : o[i];
    }
    return undefined;
  }
  
  function range(o, from, to) {
    return o && o.length ? slice.call(o, from, to) : undefined;
  }
  
  function _in(item, items) {
    if (is_array(items)) {
      return items.indexOf(item) != -1;
    } else {
      return rest(arguments).indexOf(item) != -1;
    }
  }
  
  function not_in() { return !_in.apply(null, arguments); }
  
  function contains(o) {
    var contains = false;
    var items = rest(arguments);
    for (var i = 0, l = o.length; i < l; i++) {
      contains = o.indexOf(items[i]) !== -1;
      if (contains) break;
    }
    return contains;
  }
  
  function inlist(o) {
    return rest(arguments).indexOf(o) !== -1;
  }
  
  function pick_path(o) {
    var keys = flatten(rest(arguments));
    var output = {};
    for (var i = 0, l = keys.length; i < l; i++) {
      var key = keys[i];
      ns(o, key, ns(o, key));
    }
    return output;
  }
  
  function size(o) {
    if (empty(o)) {
      return 0;
    } else if (is_array(o)) {
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
  
  function map(o, fn, scope) {
    if (empty(o)) {
      return [];
    } else if (is_array(o)) {
      return o.map(fn, scope);
    } else if (o.length) {
      var out = [];
      for (var i = 0, l = o.length; i < l; i++) {
        out.push(fn.call(scope, o[i]));
      }
      return out;
    } else if (is(o, 'object')) {
      var out = [];
      each_own(o, function(item) { out.push(fn.call(scope, item)); });
      return out;
    } else {
      return [];
    }
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
  
  function series() {
    var args = slice.call(arguments);
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
    var args = slice.call(arguments);
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
    if (is(arg1, 'function')) {
      predicate = not_empty(arg2) ? arg1.bind(arg2) : arg1;
    } else if (is(arg1, 'object')) {
      var object_keys = keys(arg1);
      predicate = function(item, index, items) {
        return eq(pick(item, object_keys), arg1);
      };
    } else if (is(arg1, 'string')) {
      var truthy = is(arg2, 'undefined');
      predicate = function(item, index, items) {
        var value = item[arg1];
        return truthy ? !!value : value === arg2;
      };
    }
    return predicate;
  }
  
  function find(items, arg1, arg2, options) {
    options = options || {};
    var output_all = options.find_all || options.remove_all;
    var match_index = [];
    var match_value = [];
    if (not_empty(items)) {
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
      return output_all ? match_value : options.index && match_value[0] === undefined ? -1 : match_value[0];
    }
    return output_all ? [] : options.index ? -1 : undefined;
  }
  
  function count(items, arg1, arg2) {
    return find(items, arg1, arg2, { find_all: true }).length;
  }
  
  function any(items, arg1, arg2) {
    return find(items, arg1, arg2, { index: true }) !== -1;
  }
  
  function all(items, arg1, arg2) {
    return find(items, arg1, arg2, { find_all: true }).length !== items.length;
  }
  
  function none(items, arg1, arg2) {
    return find(items, arg1, arg2, { find_all: true }).length === 0;
  }
  
  function find_all(items, arg1, arg2) {
    return find(items, arg1, arg2, { find_all: true });
  }
  
  function find_last(items, arg1, arg2) {
    var all = find(items, arg1, arg2, { find_all: true });
    return all[all.length - 1];
  }
  
  function find_last_index(items, arg1, arg2) {
    var all = find(items, arg1, arg2, { find_all: true, index: true });
    return all[all.length - 1];
  }
  
  function find_index(items, arg1, arg2) {
    return find(items, arg1, arg2, { index: true });
  }
  
  function exists(items, arg1, arg2) {
    return find(items, arg1, arg2, { index: true }) !== -1;
  }
  
  function remove(items, arg1, arg2) {
    return find(items, arg1, arg2, { remove: true });
  }
  
  function remove_all(items, arg1, arg2) {
    return find(items, arg1, arg2, { remove_all: true });
  }
  
  function replace(items, arg1, arg2, item) {
    var index = find(items, arg1, arg2, { index: true });
    if (index > -1) {
      items[index] = item;
    }
    return index !== -1;
  }
  
  function upsert(items, arg1, arg2, item) {
    if (is(items, 'array') && is(item, 'object')) {
      var index = find(items, arg1, arg2, { index: true });
      if (index !== -1) {
        items[index] = item;
      } else {
        items.push(item);
      }
      return true;
    }
    return false;
  }
  
  var _id = Math.round(+(new Date()) * 0.001);
  
  function qp_id() { return _id++; }
  
  function uuid() {
    var d = new Date().getTime();
    var _uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r&0x7|0x8)).toString(16);
    });
    return _uuid;
  }
  
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
  
    each(definition, function(v, k) {
      each(definition.self, function(v, k) { ctor[k] = is(v, 'function') ? v.bind(ctor) : v; });
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
  
  var sort = (function() {
    function _sort(items, sorters, options) {
      items = to_array(items);
      each(items, function(item, i) { item.__idx = i; });
      sorters = to_array(sorters);
      var sorters_length = sorters.length;
      return items.sort(function(a, b) {
        var result = 0;
        for (var i = 0; i < sorters_length; i++) {
          var sorter = sorters[i];
          result = sorter.fn(get(a, sorter.key), get(b, sorter.key));
          if (result !== 0) break;
        }
        return result === 0 ? (a.__idx > b.__idx ? 1 : -1) : result;
      });
    }
  
    function natural_sort(case_insensitive) {
      /*
       * Natural Sort algorithm for Javascript - Version 0.8 - Released under MIT license
       * Author: Jim Palmer (based on chunking idea from Dave Koelle)
       * https://github.com/overset/javascript-natural-sort
       */
      return function(a, b) {
        var re = /(^([+\-]?(?:\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?)?$|^0x[\da-fA-F]+$|\d+)/g,
            sre = /^\s+|\s+$/g,   // trim pre-post whitespace
            snre = /\s+/g,        // normalize all whitespace to single ' ' character
            dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,
            hre = /^0x[0-9a-f]+$/i,
            ore = /^0/,
            i = function(s) {
              return (case_insensitive && ('' + s).toLowerCase() || '' + s).replace(sre, '');
            },
            // convert all to strings strip whitespace
            x = i(a) || '',
            y = i(b) || '',
            // chunk/tokenize
            xN = x.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
            yN = y.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
            // numeric, hex or date detection
            xD = parseInt(x.match(hre), 16) || (xN.length !== 1 && Date.parse(x)),
            yD = parseInt(y.match(hre), 16) || xD && y.match(dre) && Date.parse(y) || null,
            normChunk = function(s, l) {
              // normalize spaces; find floats not starting with '0', string or 0 if not defined (Clint Priest)
              if (typeof s === 'undefined') return 0;
              return (!s.match(ore) || l == 1) && parseFloat(s) || s.replace(snre, ' ').replace(sre, '') || 0;
            },
            oFxNcL, oFyNcL;
        // first try and sort Hex codes or Dates
        if (yD) {
          if (xD < yD) { return -1; }
          else if (xD > yD) { return 1; }
        }
        // natural sorting through split numeric strings and default strings
        for (var cLoc=0, xNl = xN.length, yNl = yN.length, numS=Math.max(xNl, yNl); cLoc < numS; cLoc++) {
          oFxNcL = normChunk(xN[cLoc], xNl);
          oFyNcL = normChunk(yN[cLoc], yNl);
          // handle numeric vs string comparison - number < string - (Kyle Adams)
          if (isNaN(oFxNcL) !== isNaN(oFyNcL)) { return (isNaN(oFxNcL)) ? 1 : -1; }
          // rely on string comparison if different types - i.e. '02' < 2 != '02' < '2'
          else if (typeof oFxNcL !== typeof oFyNcL) {
            oFxNcL += '';
            oFyNcL += '';
          }
          if (oFxNcL < oFyNcL) { return -1; }
          if (oFxNcL > oFyNcL) { return 1; }
        }
        return 0;
      };
    }
  
    _sort.asc =  function(a, b) { return (a < b) ? -1 : (a > b) ? 1 : 0; };
    _sort.desc = function(a, b) { return (a > b) ? -1 : (a < b) ? 1 : 0; };
    _sort.number = {
      asc:  function(a, b) { return a - b; },
      desc: function(a, b) { return b - a; }
    };
    _sort.string = {
      asc:  function(a, b) { return a.localeCompare(b); },
      desc: function(a, b) { return b.localeCompare(a); }
    };
    _sort.moment = {
      asc: function(a, b) { return (a < b) ? -1 : (a > b) ? 1 : 0; },
      desc: function(a, b) { return (a > b) ? -1 : (a < b) ? 1 : 0; }
    };
    _sort.date = {
      asc:  function(a, b) { return a.getTime() - b.getTime(); },
      desc: function(a, b) { return b.getTime() - a.getTime(); }
    };
    _sort.empty = {
      last: function(a, b) { return (!!a) ? -1 : (!!b) ? 1 : 0; },
      first: function(a, b) { return (!!a) ? 1 : (!!b) ? -1 : 0; }
    };
    _sort.natural = natural_sort();
  
    return _sort;
  })();
  
  function get_comparer(type, asc, desc, key) {
    type = type || '';
    var fn = (sort[type] || sort)[asc ? 'asc' : desc ? 'desc' : 'asc'];
    return { fn: fn, key: key };
  }
  
  function ungroup(items) {
    remove_all(items, { group: true });
    return items;
  }
  
  function group(items, group_keys, options) {
    items = to_array(items);
    group_keys = to_array(group_keys);
    var group_count = group_keys.length;
    if (group_count === 0) return;
  
    var summary = [];
    var group_id = -99;
    var item_index = 0;
  
    while (item_index < items.length) {
      if (group_count === 1) {
        summary.push(create_group(group_id--, get_key(items[item_index], group_keys[0])));
      } else {
        var groups = [];
        var summary_groups = [];
        while (groups.length < group_count - 1) {
          var key = get_key(items[item_index], group_keys[groups.length]);
          var group = create_header(group_id--, key);
          groups.push(group);
          items.splice(item_index++, 0, group);
          summary_groups.push(create_group_summary(group, 'groups'));
        }
        var outer_group = groups[groups.length - 1];
        var outer_summary_group = summary_groups[groups.length - 1];
        while (items[item_index] && items[item_index][outer_group.name] === outer_group.key) {
          outer_summary_group.groups.push(create_group(group_id--, get_key(items[item_index], group_keys[group_count - 1]), groups));
        }
        while (groups.length) {
          groups.pop();
          var group_summary = summary_groups.shift();
          group_summary.footer = create_footer(group_summary.id, {
            name: group_summary.name,
            key: group_summary.key,
            id_name: group_summary.id_name,
            id_key: group_summary.id_key
          });
          items.splice(item_index++, 0, group_summary.footer);
          summary.push(group_summary);
        }
      }
    }
  
    function get_key(item, o) {
      if (is(o, 'string')) {
        var key_name = o;
        var key_value = get(item, key_name);
        return { name: key_name, value: key_value, id_name: key_name,  id_value: key_value };
      } else if (is(o, 'object')) {
        return { name: o.key, value: get(item, o.key), id_name: o.id_key, id_value: get(item, o.id_key) };
      } else {
        return null;
      }
    }
  
    function create_group(id, key, outer_groups) {
      var header = create_header(id, key);
      var group_summary = create_group_summary(header, 'items');
      items.splice(item_index++, 0, header);
      while (items[item_index] && get_key(items[item_index], key.name).value === key.value) {
        group_summary.items.push(items[item_index]);
        if (outer_groups) {
          each(outer_groups, function(grp) { grp.count++; });
        }
        group_summary.count++;
        item_index++;
      }
      group_summary.footer = create_footer(id, key);
      items.splice(item_index++, 0, group_summary.footer);
      return group_summary;
    }
  
    function create_group_summary(group, list_key) {
      var summary = { group_id: group.id, name: group.name, key: group.key, id_name: group.id_name, id_key: group.id_key, header: group, count: 0 };
      summary[list_key] = [];
      return summary;
    }
  
    function create_header(id, key) {
      return {
        id: id,
        group: true,
        group_header: true,
        name: key.name,
        key: key.value,
        id_name: key.id_name,
        id_key: key.id_value
      };
    }
  
    function create_footer(id, key) {
      return {
        id: id,
        group: true,
        group_footer: true,
        name: key.name,
        key: key.value,
        id_name: key.id_name,
        id_key: key.id_value
      };
    }
  
    return summary;
  }
  
  function sum(o, key) {
    if (is_array(o)) {
      if (key) {
        return o.reduce(function(sum, item) {
          return sum + Number(get(item, key));
        }, 0);
      } else {
        return o.reduce(function(sum, item) {
          return sum + Number(item); 
        }, 0);
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
  
  function build_match(s) {
    var escape = '/$^+.()=!|[]{},';
    var re = '';
    for (var i = 0, l = s.length; i < l; i++) {
      var c = s[i];
      if (c === '\\' || escape.indexOf(c) !== -1) {
        re += '\\' + c;
      } else if (c == '?') {
        var j = i;
        while (c == '?') { c = s[++i]; }
        re += '(.{' + (i - j) + '})';
      } else if (c == '*') {
        re += '(.*)';
      } else {
        re += c;
      }
    }
    return '^' + re + '$';
  }
  
  function match(s, expr) {
    return new RegExp(build_match(expr), 'ig').test(s);
  }
  
  function get_matches(s, expr) {
    var matches = new RegExp(build_match(expr), 'ig').exec(s);
    return matches && matches.slice(1) || [];
  }
  
  function select(items, fn, scope) {
    var out = [];
    var args = rest(arguments, 2);
    for (var i = 0, l = items.length; i < l; i++) {
      args[0] = items[i];
      var result = fn.apply(scope, args);
      if (result !== undefined) out.push(result);
    }
    return out;
  }
  
  var alpha_numeric_re = /^[a-z0-9]+$/i;
  
  function is_alpha_numeric(s) {
    return alpha_numeric_re.test(s);
  }
  
  function is_length(s, l0, l1) {
    if (is(s, 'string')) {
      if (arguments.length === 2) {
        return s.length === l0;
      } else if (arguments.length === 3) {
        return s.length >= l0 && s.length <= l1;
      }
    }
    return false;
  }
  
  global.debug = function() {
    var format = ['%cDEBUG:','color:black;background-color:yellow;'];
    console.log.apply(console, format.concat(slice.call(arguments)));
  };
  
  global.log = function() {
    console.log.apply(console, arguments);
  };
  
  function http_request(options) {
    options.done = options.done || noop;
    if (options.bind) options.done.bind(options.bind);
    options.headers = options.headers || {};
    options.method = options.method || 'GET';
    options.data = options.data || null;
  
    var response = { ok: false };
    var request = new XMLHttpRequest();
    if (options.with_credentials) request.withCredentials = true;
  
    if (options.json) {
      options.method = 'POST';
      var json = JSON.stringify(options.json, null, '  ');
      if (json.length) options.data = json;
      options.headers['Content-Type'] = 'application/json';
    } else if (options.text) {
      options.data = options.text;
      options.headers['Content-Type'] = 'text/plain';
    } else if (options.html) {
      options.headers['Content-Type'] = 'text/html';
      options.data = options.html;
    }
    options.method = upper(options.method);
    request.open(options.method, options.url, true);
    set_request_headers(request, options.headers);
    request.onload = function() {
      if (options.timeout_id) { clearTimeout(options.timeout_id); }
      response.status = request.status;
      response.state = request.readyState;
      response.data = response.text = request.responseText;
      response.headers = get_response_headers(request);
      response.header = function(key, value) {
        var header = response.headers[key];
        if (arguments.length === 1) {
          return header[0];
        } else {
          return header && contains(header, value);
        }
      };
      if (response.header('content-type', 'application/json')) {
        response.data = JSON.parse(response.text);
      }
      if (request.status >= 200 && request.status < 400) {
        response.ok = true;
        options.done(null, response);
      } else {
        options.done(new Error(response.status), response);
      }
    };
    request.onerror = function(e) {
      options.done(e, null);
    };
    if (options.timeout) {
      options.timeout_id = setTimeout(function() {
        response.timeout = true;
        request.abort();
      }, options.timeout);
    }
    request.send(options.data);
    return request;
  }
  
  function set_request_headers(http_request, headers) {
    for (var key in headers) {
      http_request.setRequestHeader(key, headers[key]);
    }
  }
  
  function get_response_headers(http_request) {
    var headers = { };
    http_request.getAllResponseHeaders().split('\r\n').forEach(function(header) {
      if (not_empty(header)) {
        var h = lower(header).split(': ');
        var v = h[1].split('; ');
        if (v.length === 1) {
          headers[h[0]] = [h[1]];
        } else {
          headers[h[0]] = v;
        }
      }
    });
    return headers;
  }
  
  function get_attributes(el) {
    if (el && el.attributes) {
      return slice.call(el.attributes);
    } else {
      return [];
    }
  }
  
  function get_attribute(el, name) {
    if (el && el.attributes) {
      var attributes = el.attributes;
      for (var i = 0, l = attributes.length; i < l; i++) {
        var attribute = el.attributes[i];
        if (match(attribute.name, name)) {
          return attribute;
        }
      }
    }
  }
  
  function is_element(el) {
    if (el) {
      var node_type = el.nodeType;
      return defined(node_type) && (node_type === 1 || node_type === 9);
    }
    return false;
  }
  
  function not_element(el) { return !is_element(el); }
  
  function element(arg0, arg1) {
    var arg_count = arguments.length;
    var arg0_type = qp_typeof(arg0);
    if (empty(arg0)) {
      return null;
    } else if (arg0_type === 'array') {
      return arg_count === 1 ? element(arg0[0]) : element(arg0[0], arg1);
    } else if (arg0_type === 'string' && arg_count === 1) {
      return select_first(arg0);
    } else if (is_element(arg0)) {
      if (arg_count === 1) {
        return arg0;
      } else if (arg_count === 2) {
        return select_first(arg0, arg1);
      }
    } else if (defined(arg0.length)) {
      return arg_count === 1 ? element(arg0[0]) : element(arg0[0], arg1);
    }
    return null;
  }
  
  function on(el, event_name, handler, scope) {
    if (scope) handler.bind(scope);
    el.addEventListener(event_name, handler, false);
  }
  
  function off(el, event_name, handler) {
    el.removeEventListener(event_name, handler);
  }
  
  function nodefault(e) {
    e.preventDefault();
    e.stopPropagation();
  }
  
  function show(el, v) {
    el.style.display = v || 'block';
  }
  
  function hide(el, v) {
    el.style.display = v || '';
  }
  
  function visible(el) {
    el = element(el);
    if (el) return el.style.display !== 'hidden' && el.style.display !== '';
    return false;
  }
  
  function hidden(el) { return !visible(el); }
  
  function text(el, s) {
    el = element(el);
    if (el) {
      if (arguments.length === 2) {
        el.textContent = s;
      } else {
        return el.textContent;
      }
    }
  }
  
  function add_class(el, class_name) {
    el = element(el);
    if (el) {
      if (is_array(class_name)) {
        qp.each(class_name, function(name) {
          el.classList.add(name);
        });
      } else {
        el.classList.add(class_name);
      }
    }
  }
  
  function remove_class(el, class_name) {
    el = element(el);
    if (el) {
      if (is_array(class_name)) {
        qp.each(class_name, function(name) {
          el.classList.remove(name);
        });
      } else {
        el.classList.remove(class_name);
      }
    }
  }
  
  function has_class(el, class_name) {
    el = element(el);
    if (el) { el.classList.contains(class_name); }
  }
  
  function set_style(el, k, v) {
    el = element(el);
    if (el) { el.style.setProperty(k, v); }
  }
  
  function get_style(el, k) {
    el = element(el);
    if (el) { el.style.getPropertyValue(k); }
  }
  
  function attr(el, name, value) {
    el = element(el);
    if (el) {
      if (arguments.length === 2) {
        return el.getAttribute(name);
      } else {
        el.setAttribute(name, value);
      }
    }
  }
  
  function has_attr(el, name) {
    el = element(el);
    if (el) {
      return !!attr(el, name);
    }
  }
  
  function html() {
    var tmp = document.implementation.createHTMLDocument();
    tmp.body.innerHTML = slice.call(arguments).join('');
    return tmp.body.children[0];
  }
  
  function swap(a, b) {
    if (is(b, 'string')) b = html(b);
    a = element(a);
    a.parentNode.replaceChild(b, a);
    return b;
  };
  
  function parents_until(child_el, parent_el, match) {
    var result = match(child_el);
    if (result) {
      return result;
    } else if (child_el === parent_el) {
      return null;
    } else {
      return parents_until(child_el.parentNode, parent_el, match);
    }
  }
  
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn(window, module.require);
    } else {
      document.addEventListener('DOMContentLoaded', function() { fn(window, module.require); });
    }
  }
  
  function animate(o) {
    var effect = o.effect || 'none';
    var done = o.done || noop;
    var el = o.el;
    var interval = o.interval;
  
    if (effect === 'none' || not_element(el)) {
      invoke_next(done);
    } else if (effect === 'fade_in') {
      el.style.opacity = 0;
      el.style.display = 'block';
      interval = interval || 0.25;
      fade_in();
    } else if (effect === 'fade_out') {
      el.style.opacity = 1;
      interval = interval || 0.25;
      fade_out();
    }
  
    function fade_in() {
      var opacity = parseFloat(el.style.opacity);
      opacity += interval;
      el.style.opacity = opacity;
      if (opacity >= 1) {
        qp.done(done);
      } else {
        requestAnimationFrame(fade_in);
      }
    }
  
    function fade_out() {
      var opacity = parseFloat(el.style.opacity);
      opacity -= interval;
      el.style.opacity = opacity;
      if (opacity <= 0) {
        el.style.display = 'none';
        done();
      } else {
        requestAnimationFrame(fade_out);
      }
    }
  
  }
  
  function select_all() {
    var one_arg = arguments.length === 1;
    if (!one_arg && !is_element(arguments[0])) return [];
    var element = one_arg ? document : arguments[0];
    var selector = one_arg ? arguments[0] : arguments[1];
    return slice.call(element.querySelectorAll(selector));
  }
  
  function select_children(element, selector) {
    if (!is_element(element)) return [];
    var id = element.id;
    var guid = element.id = (id || 'qp' + qp_id());
    var scope = '#' + guid + ' > ';
    selector = scope + (selector + '').replace(',', ',' + scope, 'g');
    var result = slice.call(element.parentNode.querySelectorAll(selector));
    if (!id) element.removeAttribute('id');
    return result;
  }
  
  function matches(el, selector) {
    el = element(el);
    if (el) {
      return (el.matches || el.matchesSelector).call(el, selector);
    }
    return false;
  }
  
  function select_each() {
    var args = arguments.length === 2 ? [arguments[0]] : [arguments[0], arguments[1]];
    var elements = select_all.apply(null, args);
    for_each.call(elements, arguments[arguments.length - 1]);
  }
  
  function select_first() {
    return select_all.apply(null, arguments)[0];
  }
  
  global.app = { };
  

  var qp = {
    noop: noop,
    noop_callback: noop_callback,
    escape_re: escape_re,
    is_value: is_value,
    is_number: is_number,
    is_function: is_function,
    is_string: is_string,
    is_array: is_array,
    is_array_like: is_array_like,
    defined: defined,
    undefined: not_defined,
    random: random,
    dfault: dfault,
    empty: empty,
    not_empty: not_empty,
    upper: upper,
    lower: lower,
    trim: trim,
    ltrim: ltrim,
    rtrim: rtrim,
    split: split,
    build: build,
    escape: escape,
    unescape: unescape,
    pad: pad,
    lpad: lpad,
    rpad: rpad,
    starts: starts,
    clean_whitespace: clean_whitespace,
    lines: lines,
    plural: plural,
    ends: ends,
    between: between,
    before: before,
    before_last: before_last,
    after: after,
    after_last: after_last,
    title_case: title_case,
    repeat: repeat,
    replace_all: replace_all,
    format: format,
    camel_to: camel_to,
    to_camel: to_camel,
    snake_to_camel: snake_to_camel,
    camel_to_snake: camel_to_snake,
    snake_to_kebab: snake_to_kebab,
    kebab_to_snake: kebab_to_snake,
    camel_to_kebab: camel_to_kebab,
    kebab_to_camel: kebab_to_camel,
    increase_indent: increase_indent,
    hashcode: hashcode,
    title_case: title_case,
    get_utf8_length: get_utf8_length,
    stringify: stringify,
    eol: eol,
    sum: sum,
    min: min,
    max: max,
    avg: avg,
    map: map,
    reduce: reduce,
    arg: arg,
    to_array: to_array,
    flatten: flatten,
    compact: compact,
    now: now,
    date: date,
    date_time: date_time,
    file_date: file_date,
    get_fn_name: get_fn_name,
    timer: timer,
    combine: combine,
    done: done,
    bind: bind,
    invoke: invoke,
    invoke_after: invoke_after,
    invoke_delay: invoke_delay,
    invoke_next: invoke_next,
    invoke_when: invoke_when,
    debounce: debounce,
    throttle: throttle,
    patch: patch,
    typeof: qp_typeof,
    is: is,
    is_not: is_not,
    size: size,
    each: each,
    each_own: each_own,
    assign: assign,
    assign_own: assign_own,
    assign_if: assign_if,
    eq: eq,
    neq: neq,
    clone: clone,
    copy: copy,
    merge: merge,
    extend: extend,
    override: override,
    make: make,
    first: first,
    last: last,
    rest: rest,
    at: at,
    range: range,
    in: _in,
    not_in: not_in,
    find_predicate: find_predicate,
    find: find,
    any: any,
    find_all: find_all,
    find_last: find_last,
    find_last_index: find_last_index,
    find_index: find_index,
    remove: remove,
    remove_all: remove_all,
    pick_predicate: pick_predicate,
    pick: pick,
    pick_own: pick_own,
    pairs: pairs,
    keys: keys,
    values: values,
    pick_values: pick_values,
    sort: sort,
    get_comparer: get_comparer,
    group: group,
    ungroup: ungroup,
    ns: ns,
    options: qp_options,
    id: qp_id,
    uuid: uuid,
    series: series,
    parallel: parallel,
    get: get,
    take: take,
    has: has,
    set: set,
    union: union,
    unique: unique,
    clear: clear,
    push: push,
    load: load,
    contains: contains,
    inlist: inlist,
    pick_path: pick_path,
    get_data: get_data,
    set_data: set_data,
    count: count,
    all: all,
    none: none,
    exists: exists,
    replace: replace,
    upsert: upsert,
    build_match: build_match,
    match: match,
    get_matches: get_matches,
    has_key: has_key,
    delete_key: delete_key,
    delete: qp_delete,
    select: select,
    is_alpha_numeric: is_alpha_numeric,
    is_length: is_length,
    animate: animate,
    debug: debug,
    get_attributes: get_attributes,
    get_attribute: get_attribute,
    is_element: is_element,
    not_element: not_element,
    element: element,
    on: on,
    off: off,
    nodefault: nodefault,
    show: show,
    hide: hide,
    visible: visible,
    hidden: hidden,
    text: text,
    add_class: add_class,
    remove_class: remove_class,
    html: html,
    swap: swap,
    set_style: set_style,
    get_style: get_style,
    attr: attr,
    has_attr: has_attr,
    parents_until: parents_until,
    ready: ready,
    select_all: select_all,
    select_children: select_children,
    matches: matches,
    select_each: select_each,
    select_first: select_first,
    request: http_request
  };

  if (global.define) {
    global.define.make = make;
    global.module.require.cache["qp-utility"] = qp;
  } else {
    global.qp = qp;
  }

  define(module, function(exports, require, make) {
  
    var qp = require('qp-utility');
  
    make({
  
      ns: 'qp-utility/websocket',
  
      websocket: null,
      secure: false,
      auto: true,
  
      url: '',
      protocols: null,
      on_error: false,
      on_close: false,
      on_open: false,
      message: false,
      json: false,
  
      init: function(options) {
        if (this.auto) this.open();
      },
  
      open: function() {
        if (!this.websocket) {
          var websocket = this.websocket = new WebSocket((this.secure ? 'wss://' : 'ws://') + this.url, this.protocols);
          if (this.on_error) websocket.addEventListener('error', this.on_error.bind(this));
          if (this.on_close) websocket.addEventListener('close', this.on_close.bind(this));
          if (this.protocols) {
            this.json = qp.contains(this.protocols, 'json-message');
          }
          websocket.addEventListener('open', function(e) {
            if (this.on_open) this.on_open(e);
            if (this.message) {
              websocket.addEventListener('message', function(e) {
                var data = e.data;
                if (this.json) data = JSON.parse(data);
                log('MSG_IN', qp.stringify(data, true));
                if (this.message) this.message(data, e);
              }.bind(this));
            }
          }.bind(this));
        }
      },
  
      send: function(data) {
        if (this.is_state('OPEN')) {
          log('MSG_OUT', qp.stringify(data, true));
          if (this.json) data = JSON.stringify(data);
          this.websocket.send(data);
        }
      },
  
      close: function() {
        if (this.is_state('OPEN')) {
          this.websocket.close();
          this.websocket = null;
        }
      },
  
      is_state: function(state) {
        return this.websocket && this.websocket.readyState === this.websocket[state];
      }
  
    });
  
  });
  
  define(module, function(exports, require, make) {
  
    var qp = require('qp-utility');
  
    make({
  
      ns: 'qp-utility/store',
  
      store: null,
      key: 'qp',
      ctx: '',
  
      init: function(options) {
        this.store = window.localStorage;
      },
  
      get_key: function(key) { return this.key + (this.ctx ? '.' + this.ctx : '') + (key ? '.' + key : ''); },
      set_context: function(ctx) { this.ctx = ctx; },
  
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
        var key_len = key.length
        qp.each_own(this.store, function(v, k) {
          if (qp.starts(k, key)) {
            var item = JSON.parse(v);
            qp.set(data, key.slice(key_len), include_meta ? item : item.data);
          }
        });
        return data;
      },
  
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
  
  define(module, function(exports, require, make) {
  
    var qp = require('qp-utility');
  
    make({
  
      ns: 'qp-utility/viewmodel',
  
      properties: {
        model: null,
        element: null,
        view: {},
        bindings: []
      },
  
      init: function(config) {
        this.model = config.model;
        this.element = config.el || config.element || config.view;
      },
  
      bind: function() {
        this.bindings = this.parse({ element: this.element, bindings: [] });
      },
  
      update_view: function(node_name) {
        this.sync('view', this.bindings, this.model, node_name);
      },
  
      update_model: function(node_name) {
        this.sync('model', this.bindings, this.model, node_name);
      },
  
      sync: function(target, node, model, node_name) {
        if (!node_name || node.name === node_name) {
          node_name = null;
          qp.each(node.bindings, function(binding) {
            binding['update_' + target].call(this, model);
          }, this);
        }
        qp.each(node.children, function(child_node, index) {
          if (node.each) {
            var binder = qp.find(node.bindings, { name: 'each' });
            model[binder.item_name] = model[binder.path][index];
          }
          this.sync(target, child_node, model, node_name);
          if (node.each) qp.delete(model, binder.item_name);
        }, this);
      },
  
      parse: function(node) {
        this.parse_node(node);
        if (node.element.parentNode) {
          node.children = qp.select(node.element.children, function(child_element) {
            if (qp.is_element(child_element)) {
              if (child_element.hasAttribute('v-each')) {
                node.parent = node.element;
                node.element = child_element;
                node.each = true;
                this.parse_node(node);
              } else {
                return this.parse({ element: child_element, bindings: [] });
              }
            }
          }, this);
        }
        return node;
      },
  
      parse_node: function(node) {
        qp.each(qp.get_attributes(node.element), function(attribute) {
          if (attribute.name.slice(0, 2) === 'v-') {
            var binding = this.create_binding(node, attribute);
            node.element.removeAttribute(binding.key);
            if (binding.name === 'node') {
              node.name = binding.path;
            } else if (binding.name === 'if') {
              binding.type = 'if';
            } else if (qp.inlist(binding.name, 'show', 'hide')) {
              binding.type = 'visible';
              binding.show = binding.name === 'show';
              binding.hide = !binding.show;
            } else if (qp.inlist(binding.name, 'readonly', 'disabled')) {
              binding.attribute = binding.name;
              binding.boolean = true;
            } else if (binding.name === 'text') {
              binding.property = 'textContent';
            } else if (binding.name === 'html') {
              binding.property = 'innerHTML';
            } else if (binding.name === 'value') {
              binding.property = 'value';
            } else if (binding.name === 'template') {
              binding.type = 'template';
            } else if (binding.name === 'each') {
              var items = binding.path.split(' in ');
              binding.item_name = items[0];
              binding.path = items[1];
              binding.template = node.parent.removeChild(node.element);
              node.element = node.parent;
              delete node.parent;
            } else if (binding.name === 'add-class') {
              binding.type = 'add_class';
            } else if (qp.match(binding.name, 'on-*')) {
              binding.type = 'on';
              binding.event = binding.name.slice(3);
            } else if (qp.match(binding.name, 'class-*')) {
              binding.type = 'class';
              binding.class = binding.name.slice(6);
            } else if (qp.match(binding.name, 'style-*')) {
              binding.type = 'style';
              binding.style = binding.name.slice(6);
            } else {
              binding.attribute = binding.type;
            }
  
            if (binding.type === 'node') {
              //
            } else if (binding.property) {
              this.property(binding, node.element);
            } else if (binding.attribute) {
              this.attribute(binding, node.element);
            } else if (binding.name === 'each') {
              this.each(binding, node);
            } else {
              this[binding.type](binding, node.element);
            }
          }
        }.bind(this));
      },
  
      create_binding: function(node, attribute) {
        var attribute_name = attribute.name.slice(2);
        var binding = {
          key: attribute.name,
          name: attribute_name,
          type: attribute_name,
          path: attribute.value,
          negate: false,
          priority: 99
        };
        if (qp.match(attribute_name, 'not *')) {
          binding.path = attribute.value.slice(4);
          binding.negate = true;
        }
        if (binding.type !== 'node') {
          node.bindings.push(binding);
        }
        return binding;
      },
  
      if: function(binding, element) {
        binding.priority = 1;
      },
  
      visible: function(binding, element) {
        binding.update_view = function(model) {
          var toggle = qp.get(model, binding.path);
          if ((binding.show && toggle) || (binding.hide && !toggle)) {
            qp.show(element);
          } else {
            qp.hide(element);
          }
        };
        binding.update_model = function(model) {
          qp.set(model, binding.path, (element.style.display === 'block' && binding.show));
        };
      },
  
      class: function(binding, element) {
        binding.update_view = function(model) {
          if (qp.get(model, binding.path)) {
            qp.add_class(element, binding.class);
          } else {
            qp.remove_class(element, binding.class);
          }
        };
        binding.update_model = function(model) {
          qp.set(model, binding.path, qp.has_class(element));
        };
      },
  
      style: function(binding, element) {
        binding.update_view = function(model) {
          qp.set_style(element, binding.style, qp.get(model, binding.path));
        };
        binding.update_model = function(model) {
          qp.set(model, binding.path, qp.get_style(element, binding.style));
        };
      },
  
      template: function(binding, element) {
        binding.update_view = function(model) {
          element.textContent = qp.format(binding.path, model);
        };
        binding.update_model = function(model) { };
      },
  
      property: function(binding, element) {
        binding.update_view = function(model) {
          element[binding.property] = qp.get(model, binding.path);
        };
        binding.update_model = function(model) {
          qp.set(model, binding.path, element[binding.property]);
        };
      },
  
      attribute: function(binding, element) {
        if (binding.boolean) {
          binding.update_view = function(model) {
            if (qp.get(model, binding.path)) {
              element.setAttribute(binding.attribute);
            } else {
              element.removeAttribute(binding.attribute);
            }
          };
          binding.update_model = function(model) {
            qp.set(model, binding.path, element.hasAttribute(binding.attribute));
          };
        } else {
          binding.update_view = function(model) {
            element.setAttribute(binding.attribute, qp.get(model, binding.path));
          };
          binding.update_model = function(model) {
            qp.set(model, binding.path, element.getAttribute(binding.attribute));
          };
        }
      },
  
      on: function(binding, element) {
        binding.update_view = function(model) {
          binding.event_listener = function(e) {
            qp.nodefault(e);
            var id = element.getAttribute('data-id');
            if (!id) {
              id = qp.parents_until(e.target, element,
                function(el) { return el.getAttribute('data-id'); }
              );
            }
            qp.get(model, binding.path).call(model, Number(id));
          };
          qp.on(element, binding.event, binding.event_listener);
        };
        binding.update_model = function(model) { };
      },
  
      each: function(binding, node) {
        var list_element = node.element;
        binding.update_view = function(model) {
          list_element.innerHTML = '';
          node.children = qp.map(qp.get(model, binding.path), function(item) {
            var item_element = binding.template.cloneNode(true);
            item_element.setAttribute('data-id', item.id);
            list_element.appendChild(item_element);
            return this.parse({ element: item_element, bindings: [] });
          }, this);
        };
        binding.update_model = function(model) { };
      }
  
    });
  
  });
  

})(window);