(function(global, undefined) {

  function eol() {
    return '\n';
  }
  
  function hex_to_rgb(hex, alpha) {
    hex = ltrim(hex, '#');
    alpha = alpha || 1;
    var r = parseInt(hex.substring(0, 2), 16);
    var g = parseInt(hex.substring(2, 4), 16);
    var b = parseInt(hex.substring(4, 6), 16);
    return build('rgba(', String(r), ', ', String(g), ', ', String(b), ', ', String(alpha), ')');
  }
  
  function validate_color_hex(hexcode) {
    if (hexcode && hexcode.length) {
      if (hexcode.length === 7 && hexcode[0] === '#') hexcode = hexcode.slice(1);
      if (hexcode.length === 6) {
        var hex_color_re = /(?:[A-F0-9A-F]{2}){3}/i;
        return hex_color_re.test(hexcode);
      }
    }
    return false;
  }
  
  function brighten_hex(hex, percent) {
    var a = Math.round(255 * percent / 100);
    var r = a + parseInt(hex.substring(1, 2), 16);
    var g = a + parseInt(hex.substring(3, 2), 16);
    var b = a + parseInt(hex.substring(5, 2), 16);
    r = r < 255 ? (r < 1 ? 0 : r) : 255;
    g = g < 255 ? (g < 1 ? 0 : g) : 255;
    b = b < 255 ? (b < 1 ? 0 : b) : 255;
    return '#' + (0x1000000 + (r * 0x10000) + (g * 0x100) + b).toString(16).slice(1);
  }
  
  function darken_hex(hex, percent) {
    return brighten_hex(hex, -percent);
  }
  
  /* Copyright (c) 2011, Daniel Guerrero */
  /* https://github.com/danguer/blog-examples/blob/master/js/base64-binary.js */
  
  var BASE64_KEYS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  
  function base64_decode(data_uri) {
    var data = rtrim(data_uri.slice(data_uri.indexOf(';base64,') + 8), '=');
    var bytes = parseInt((data.length / 4) * 3, 10);
    var uarray = new Uint8Array(bytes);
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    data = data.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    for (var i = 0, j = 0; i < bytes; i += 3) {	
      // get the 3 octects in 4 ascii chars
      enc1 = BASE64_KEYS.indexOf(data.charAt(j++));
      enc2 = BASE64_KEYS.indexOf(data.charAt(j++));
      enc3 = BASE64_KEYS.indexOf(data.charAt(j++));
      enc4 = BASE64_KEYS.indexOf(data.charAt(j++));
      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;
      uarray[i] = chr1;			
      if (enc3 != 64) uarray[i + 1] = chr2;
      if (enc4 != 64) uarray[i + 2] = chr3;
    }
    return uarray;	
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
  
  function is_boolean(o) { return typeof o === 'boolean'; }
  
  function is_number(o) { return o - parseFloat(o) >= 0; }
  
  function is_string(o) { return typeof o === 'string'; }
  
  function is_function(o) { return typeof o === 'function'; }
  
  function is_object(o) { return o && o.constructor === Object; }
  
  function is_null(o) { return o === null; }
  
  function not_null(o) { return o !== null; }
  
  function defined(o) { return !not_defined(o); }
  
  function not_defined(o) { return typeof o === 'undefined'; }
  
  function escape_re(o) { return o.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); }
  
  function random(min, max) { return Math.floor(Math.random() * (max - min)) + min; }
  
  function is_array_like(o) { return !is_array(o) && is_value(o) && !is_string(o) && !is_function(o) && o.length; }
  
  function is_empty(o) {
    return o === null ||
      typeof o === 'undefined' ||
      (is_array(o) && o.length === 0) ||
      (is_string(o) && o.length === 0) ||
      (is_number(o) && o === 0) ||
      (is_object(o) && Object.keys(o).length === 0);
  }
  
  function empty(o) {
    return typeof o === 'undefined' || o === null ||
      (is_array(o) && o.length === 0) ||
      (is_string(o) && o.length === 0) ||
      (is_number(o) && o === 0);
  }
  
  function not_empty(o) { return !empty(o); }
  
  function not(o) { return o === false; }
  
  function iif(condition, a, b) { return condition ? a || b : b; }
  
  function dfault(value, dfault) { return not_defined(value) ? dfault : value; }
  
  function boolean(value, dfault) { return is_boolean(value) ? value : dfault; }
  
  function number(value, dfault) { return is_number(value) ? value : dfault; }
  
  function empty_or_whitespace(o) {
    return empty(o) || (is_string(o) && o.replace(/\s/g, '').length === 0);
  }
  
  function lower(s) {
    return String(s).toLocaleLowerCase();
  }
  
  function upper(s) {
    return String(s).toLocaleUpperCase();
  }
  
  function items(o) {
    var list = '';
    if (is_array(o)) {
      for (var i = 0, l = o.length; i < l; i++) {
        var item = o[i];
        if (i === 0) {
          list = item;
        } else if (i === (l - 1)) {
          list += (' & ' + item);
        } else {
          list += (', ' + item);
        }
      }
    }
    return list;
  }
  
  function trim(s, chars) {
    if (s === undefined || s === null) {
      return '';
    } else if (chars === undefined || chars === null) {
      return String(s).replace(/(^\s+|\s+$)/g, '');
    } else {
      chars = escape_re(chars);
      return String(s).replace(new RegExp('^' + chars + '+|' + chars + '+$', 'g'), '');
    }
  }
  
  function ltrim(s, chars) {
    if (s === undefined || s === null) {
      return '';
    } else if (chars === undefined || chars === null) {
      return String(s).replace(/^\s+/, '');
    } else {
      return String(s).replace(new RegExp('^' + escape_re(chars) + '+'), '');
    }
  }
  
  function rtrim(s, chars) {
    if (s === undefined || s === null) {
      return '';
    } else if (chars === undefined || chars === null) {
      return String(s).replace(/\s+$/, '');
    } else {
      return String(s).replace(new RegExp(escape_re(chars) + '+$'), '');
    }
  }
  
  function clean_whitespace(s) {
    var newline_re = /\r?\n|\r/g;
    var trim_re = /(^\s+|\s+$)/g;
    if (s === undefined || s === null) {
      return '';
    } else {
      return String(s).replace(newline_re, '').replace(trim_re, '');
    }
  }
  
  function split(s, chars, o) {
    if (is(s, 'string') && s.length > 0) {
      var parts = String(s).split(chars);
      if (o && o.remove_empty) parts = qp.compact(parts);
      return parts;
    } else {
      return [];
    }
  }
  
  function join(o, s) {
    return to_array(o).join(s || ', ');
  }
  
  function lines(s) {
    return String(s).split(/\r\n|\r|\n/g);
  }
  
  function build() {
    return compact(flatten(to_array(arguments))).join('');
  }
  
  function plural(o, prefix, single, multi, suffix) {
    var _size = size(o);
    return _size + ' ' + (prefix) + (_size > 1 ? multi : single) + (' ' + suffix || '');
  }
  
  function escape(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
  
  function unescape(s) {
    return String(s)
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, '\'');
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
    var i = s.indexOf(str);
    return i === -1 ? s : s.slice(i + str.length);
  }
  
  function after_last(s, str) {
    return s.slice(s.lastIndexOf(str) + str.length);
  }
  
  function between(s, left, right) {
    if (!right) right = left;
    if (s && left && right) {
      var startAt = s.indexOf(left) + 1;
      if (startAt > 0) {
        return s.slice(startAt, s.indexOf(right, startAt));
      } else {
        return '';
      }
    } else {
      return '';
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
        out += chr.toLowerCase();
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
      }
      if (is_number(times) && times > 1) {
        indent = repeat(indent, times);
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
  function to_title_case(s) {
    var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;
    return s.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function(match, index, title) {
      if (index > 0 && index + match.length !== title.length &&
        match.search(smallWords) > -1 && title.charAt(index - 2) !== ':' &&
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
      return s.replace(/\{{([A-Za-z0-9_.]+)\}}/g, function(t, k) {
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
  
  function pairs(o) {
    var _pairs = [];
    if (is(o, 'object')) {
      each_own(o, function(v, k) { _pairs.push([k, v]); });
    }
    return _pairs;
  }
  
  function stringify(o, options) {
    if (qp.is(options, 'string') && options === 'json') {
      return JSON.stringify(o, null, '  ');
    } else {
      if (o && o.toJSON) o = o.toJSON();
      if (options === true) {
        return empty(o) ? '' : '{ ' + pairs(o).map(function(pair) {
          var value = pair[1];
          var type = qp_typeof(value);
          if (type === 'function') { value = value.name || 'fn';
          } else if (type === 'array') { value = '[ ' + value.length + ' ]';
          } else if (type === 'string') {
            if (value.length > 79) value = value.slice(0, 79) + '…';
          } else if (type === 'object') {
            if (empty(value)) value = '{ }';
            else if (value.id) value = '{ id: ' + value.id + ' }';
            else value = '{ … }';
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
          } else if (is(value, 'string')) {
            if (value.length > 79) value = value.slice(0, 79) + '…';
            else if (value.length === 0) value = '\'\'';
            return pair[0] + ': ' + value;
          } else {
            return pair[0] + ': ' + value;
          }
        }).join(', ') + ' }';
      }
    }
  }
  
  function json(o, options) {
    var type = qp_typeof(o);
    if (type === 'string') {
      return JSON.parse(o || '{}');
    } else if (type === 'object' || type === 'array') {
      return JSON.stringify(o || {}, null, '  ');
    }
    return o;
  }
  
  function reduce(o, fn, init) {
    return is(o, 'array') ? o.reduce(fn, init) : undefined;
  }
  
  function arg(o) { return slice.call(o); }
  
  function to_array(o, copy) {
    if (is_array(o)) {
      return copy ? o.slice(0) : o;
    } else if (typeof o === 'function') {
      return [o];
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
  
  function csv() {
    return compact(arguments).join(',');
  }
  
  function zip(keys, values) {
    var zipped = {};
    if (is_array(keys) && is_array(values)) {
      for (var i = 0, l = Math.min(keys.length, values.length); i < l; i++) {
        zipped[keys[i]] = values[i];
      }
    }
    return zipped;
  }
  
  function unzip(o) {
    var unzipped = { keys: [], values: [] };
    each_own(o, function(v, k) {
      unzipped.values.push(v);
      unzipped.keys.push(k);
    });
    return unzipped;
  }
  
  function union() {
    return slice.call(arguments).reduce(function(output, input) {
      return to_array(output).concat(to_array(input));
    }, []);
  }
  
  function chunk(o, n) {
    var out = [];
    var l = o.length;
    var i = 0;
    var size;
    if (l % n === 0) {
      size = Math.floor(l / n);
      while (i < l) {
        out.push(o.slice(i, i += size));
      }
    } else {
      n--;
      size = Math.floor(l / n);
      if (l % size === 0) size--;
      while (i < size * n) {
        out.push(o.slice(i, i += size));
      }
      out.push(o.slice(size * n));
    }
    return out;
  }
  
  function segment(o, n) {
    var out = [];
    while (o.length) {
      out.push(o.splice(0, n));
    }
    return out;
  }
  
  function shuffle(set) {
    var i = set.length;
    while (i) {
      var rnd = Math.floor(Math.random() * i--);
      var tmp = set[i];
      set[i] = set[rnd];
      set[rnd] = tmp;
    }
    return set;
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
  
  function insert_at(o, index, value) {
    o.splice(index, 0, value);
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
  
  function load(o) {
    clear(o);
    each(rest(arguments), function(value) { push(o, value); });
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
  
  function hash(o, k) {
    var hash = {};
    if (is_array(o)) {
      each(o, function(item, index) {
        item.__idx = index;
        if (item.hasOwnProperty(k)) hash[item[k]] = item;
      });
    } else if (is_object(o)) {
      each_own(o, function(item, key, index) {
        item.__idx = index;
        if (item.hasOwnProperty(k)) hash[item[k]] = item;
      });
    }
    return hash;
  }
  
  var iso_date_re = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+/;
  var date_format = {
    MMMM: ['January','February','March','April','May','June','July','August','September','October','November','December'],
    MMM: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    dddd: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
    ddd: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  };
  
  // -271821-04-20T00:00:00.000Z
  // js_min_date = -8640000000000000
  // +275760-09-13T00:00:00.000Z
  // js_max_date = 8640000000000000
  
  // 0001-01-01T00:00:00+00:00
  var min_date = -62135596800000;
  // 9999-12-31T00:00:00+00:00
  var max_date = 253402214400000;
  
  function format_date(dt, format) {
    if (isNaN(+dt)) {
      return null;
    } else if (not_defined(format)) {
      return dt;
    } else if (format === 'YYYY') {
      return dt.getUTCFullYear();
    } else if (format === 'MMMM' || format === 'MMM') {
      return date_format[format][dt.getUTCMonth()];
    } else if (format === 'dddd' || format === 'ddd') {
      return date_format[format][dt.getUTCDay()];
    } else if (format === 'utc') {
      return dt.toUTCString();
    } else if (format === 'iso') {
      return dt.toISOString();
    } else if (format === 'int') {
      return dt.getTime();
    } else if (format === 'string') {
      return String(dt.getTime());
    } else if (format === 'time') {
      var hours = lpad(dt.getUTCHours().toString(), '0', 2);
      var minutes = lpad(dt.getUTCMinutes().toString(), '0', 2);
      var seconds = lpad(dt.getUTCSeconds().toString(), '0', 2);
      return [hours, minutes, seconds].join(':');
    } else {
      return dt;
    }
  }
  
  function iso(dt) {
    if (is(dt, 'string')) dt = new Date(dt);
    if (is(dt, 'number')) {
      if (dt === -Infinity) dt = new Date(min_date);
      else if (dt === Infinity) dt = new Date(max_date);
      else dt = new Date(dt);
    }
    if (is_not(dt, 'date')) dt = new Date(min_date);
    return dt.toISOString();
  }
  
  function now(format) {
    var _now = new Date();
    if (is(format, 'string')) {
      return format_date(_now, format);
    } else {
      _now.offset = function(offset, unit, format_offset) {
        if (unit === 'day' || unit === 'days') {
          offset = offset * 24 * 60 * 60 * 1000;
        } else if (unit === 'hour' || unit === 'hours') {
          offset = offset * 60 * 60 * 1000;
        }
        var dt = new Date(_now.getTime() + offset);
        return (format_offset ? format_date(dt, format_offset) : dt);
      };
      return _now;
    }
  }
  
  function start_of(dt, epoch, format) {
    if (epoch === 'month') {
      dt = new Date(dt);
      dt.setUTCDate(1);
    }
    return format_date(dt, format);
  }
  
  function end_of(dt, epoch, format) {
    if (epoch === 'month') {
      dt = new Date(dt);
      dt.setUTCMonth(dt.getUTCMonth() + 1);
      dt.setUTCDate(0);
    }
    return format_date(dt, format);
  }
  
  function date(dt, format) {
    return format_date(new Date(dt), format);
  }
  
  function bot(format) {
    return format_date(new Date(min_date), format);
  }
  
  function is_bot(dt) {
    return +dt === min_date;
  }
  
  function eot(format) {
    return format_date(new Date(max_date), format);
  }
  
  function is_eot(dt) {
    return +dt === max_date;
  }
  
  function empty_date(format) {
    return format_date(new Date(min_date), format);
  }
  
  function is_empty_date(dt) {
    return +dt === min_date;
  }
  
  function time_ago(dt) {
    function epoch(interval, epoch) {
      return interval + ' ' + epoch + (interval <= 1 ? '' : 's');
    }
  
    var interval;
    var seconds = Math.floor((new Date() - dt) / 1000);
  
    interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return epoch(interval, 'year');
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return epoch(interval, 'month');
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return epoch(interval, 'day');
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return epoch(interval, 'hour');
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return epoch(interval, 'minute');
  
    return epoch(Math.floor(seconds), 'second');
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
        } else if (format === 'day month, year') {
          return dt.getDate() + ' ' + date_format['MMM'][dt.getMonth()] + ', ' + dt.getFullYear();
        } else if (format === 'month day, year') {
          return date_format['MMM'][dt.getMonth()] + ' ' + dt.getDate() + ', ' + dt.getFullYear();
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
  
  function call(fn) {
    if (is(fn, 'function')) {
      var args = qp.rest(arguments);
      return fn.apply(null, args);
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
    if (type === 'object' && args[0].done) {
      invoke_next(args[0].done.bind(args[0].context || args[0].bind), args[1], args[2]);
    } else if (type === 'function') {
      invoke_next(args[0].bind(args[1]), args[2], args[3]);
    }
    return null;
  }
  
  function bind(o) {
    if (arguments.length === 1 || (arguments.length === 2 && is(arguments[1], 'object'))) {
      var scope = arguments[1] || o;
      each(o, function(v, k) { if (is(v, 'function')) o[k] = v.bind(scope); });
    } else {
      each(rest(arguments), function(v, k) {
        o[k] = v.bind(o);
      });
    }
    return o;
  }
  
  function chain() {
    var data = null;
    each(slice.call(arguments), function(fn) { data = fn(data); });
    return data;
  }
  
  function partial(fn) {
    var args = slice.call(arguments, 1);
    return function() {
      return fn.apply(this, args.concat(slice.call(arguments)));
    };
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
    var path = key.split('.');
    if (is(o, 'object')) {
      var item = o;
      for (var i = 0, l = path.length; i < l; i++) {
        item = item[path[i]];
        if (item === null || item === undefined) break;
        if (i == (l - 1)) value = item;
      }
    }
    return value;
  }
  
  function take(o, key, dfault) {
    var value = dfault;
    var path = key.split('.');
    if (is(o, 'object')) {
      var item = o;
      var last;
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
    var path = key.split('.');
    if (is(o, 'object')) {
      var item = o;
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
    var type = lower(to_string.call(o).slice(8, -1));
    if (ctor && type === 'object') {
      if (o.constructor) {
        type = lower(o.constructor.type || o.constructor.name) || 'object';
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
      return type === o_class || (type === 'object' && qp_typeof(o, true) === lower(o_class));
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
  
  function qp_options(_options, defaults) {
    if (is(_options, 'object') && is(defaults, 'object')) {
      each_own(defaults, function(v, k) {
        if (not_defined(_options[k])) {
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
    for (var i = 0, l = items.length; i < l; i++) {
      contains = o.indexOf(items[i]) !== -1;
      if (contains) break;
    }
    return contains;
  }
  
  function inlist(o) {
    return rest(arguments).indexOf(o) !== -1;
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
      for (var i = 0, l = o.length, last = o.length - 1; i < l; i++) {
        if (fn.call(scope, o[i], i, last, o) === false) {
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
    } else if (is_array(o) || o.length) {
      var out0 = [];
      for (var i = 0, l = o.length, last = o.length - 1; i < l; i++) {
        out0.push(fn.call(scope, o[i], i, last, o));
      }
      return out0;
    } else if (is(o, 'object')) {
      var out1 = [];
      each_own(o, function(v, k, i, o) { out1.push(fn.call(scope, v, k, i, o)); });
      return out1;
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
  
  function each_series(items, action, done) {
    items = [].concat(items);
    var results = [ ];
    var next = function() {
      if (items.length) {
        action(items.shift(), function(error, result) {
          results.push(result);
          if (error) return done(error, results); else next();
        });
      } else {
        done(null, results);
      }
    };
    next();
  }
  
  function series(data, actions, done) {
    var args = slice.call(arguments);
    done = args.pop();
    actions = args.pop();
    data = args.pop() || {};
  
    var results = { };
    actions = get_async_actions(actions);
    var next = function() {
      var action = actions.shift();
      if (action && action.fn) {
        action.fn(data, function(error, result) {
          results[action.name] = result;
          if (error) done(error, results); else next();
        });
      } else {
        done(null, results);
      }
    };
    next();
  }
  
  function parallel(data, actions, done) {
    var args = slice.call(arguments);
    done = args.pop();
    actions = args.pop();
    data = args.pop() || {};
  
    var results = { };
    actions = get_async_actions(actions);
    var action_count = actions.length;
    each(actions, function(action) {
      action.fn(data, function(error, result) {
        results[action.name] = result;
        if (error) {
          done(error, results);
        } else if (!--action_count) {
          done(null, results);
        }
      });
    });
  }
  
  function get_async_actions(o) {
    if (is(o, 'array')) {
      if (is(o[0], 'function')) {
        return qp.map(o, function(fn, index) { return { name: index, fn: fn }; });
      } else {
        return o;
      }
    } else if (is(o, 'object')) {
      return map(o, function(fn, name) { return { name: name, fn: fn }; });
    }
  }
  
  function pick(source, o) {
    var target = { };
    if (is(source, 'object')) {
      if (is(o, 'array')) {
        each(o, function(k) { if (source.hasOwnProperty(k)) target[k] = source[k]; });
      } else if (is(o, 'function')) {
        each_own(source, function(v, k) { if (o(v, k, i)) target[k] = v; });
      } else if (is(o, 'string')) {
        if (arguments.length === 2) {
          return pick(source, o.split(','));
        } else {
          return pick(source, rest(arguments));
        }
      }
    }
    return target;
  }
  
  function find_predicate(arg1, arg2) {
    var predicate;
    if (is(arg1, 'function')) {
      predicate = not_empty(arg2) ? arg1.bind(arg2) : arg1;
    } else if (is(arg1, 'object')) {
      var object_keys = Object.keys(arg1);
      predicate = function(item, index, items) {
        return eq(pick(item, object_keys), arg1);
      };
    } else if (is(arg1, 'string')) {
      var truthy = is(arg2, 'undefined');
      var path = arg1.indexOf('.') !== -1;
      predicate = function(item, index, items) {
        var value = path ? get(item, arg1) : item[arg1];
        return truthy ? !!value : value === arg2;
      };
    } else {
      predicate = function() { return true; };
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
          while (match_index.length) {
            items.splice(match_index.pop(), 1);
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
    items = to_array(items);
    return items.length > 0 && find(items, arg1, arg2, { index: true }) !== -1;
  }
  
  function all(items, arg1, arg2) {
    items = to_array(items);
    return items.length > 0 && find(items, arg1, arg2, { find_all: true }).length === items.length;
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
  
  function upsert(items) {
    if (is(items, 'array')) {
      var args = qp.arg(arguments);
      var arg1, arg2, item;
      if (args.length === 2 && is(args[1], 'object')) {
        item = args[1];
        arg1 = { id: item.id };
      } else if (args.length === 3) {
        arg1 = args[1];
        item = args[2];
      } else if (args.length === 4) {
        arg1 = args[1];
        arg2 = args[2];
        item = args[3];
      }
      if (is(item, 'object')) {
        var index = find(items, arg1, arg2, { index: true });
        if (index === -1) {
          items.push(item);
        } else {
          var target = items[index];
          each_own(item, function(v, k) {
            if (target.hasOwnProperty(k) && target[k] !== v) {
              target[k] = v;
            }
          });
        }
        return true;
      }
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
  
  function make(_exports, definition) {
    if (arguments.length === 1) {
      definition = _exports;
      _exports = false;
    }
    var name = definition.ns.split('/').pop().toLowerCase();
    /*jslint evil: true*/
    // var ctor = (new Function('return function ' + name + '(o){this.construct.call(this,o||{});}'))();
    var ctor = function(o) { this.construct.call(this, o || {}); };
    ctor.name = ctor.type = name;
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
          if (!inlist(k, 'ns', 'create', 'properties', 'mixins', 'inits', 'setups', 'type')) {
            ctor[k] = v;
          }
        });
      });
    }
  
    // each(definition.self, function(v, k) { ctor[k] = is(v, 'function') ? v.bind(ctor) : v; });
    each(definition.self, function(v, k) { ctor[k] = v; });
  
    each(definition, function(v, k) {
      if (inlist(k, 'ns', 'mixin', 'self')) {
        // nop
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
      each_own(options, function(v, k) {
        if (defined(v) && !is_function(this[k]) && this.hasOwnProperty(k)) this[k] = v;
      }, this);
      invoke(ctor.inits, this, options);
      invoke(ctor.setups, this);
    };
  
    return (_exports ? _exports(ctor.ns, ctor) : ctor);
  }
  
  function _module(_exports) {
    var args = slice.call(arguments, 1);
    var id;
    if (is(args[0], 'string')) id = args.shift();
    var _export = args.shift();
    for (var i = args.length, l = 0; i >= l; i--) {
      for (var key in args[i]) {
        if (args[i].hasOwnProperty(key)) _export[key] = args[i][key];
      }
    }
    
    if (_export.ns) {
      id = _export.ns;
    } else if (id) {
      _export.ns = id;
    }
  
    if (_export) {
      for (var k in _export) {
        if (typeof _export[k] === 'function' && _export.hasOwnProperty(k)) _export[k] = _export[k].bind(_export);
      }
      if (_export.init) _export.init();
      return _exports(id, _export);
    }
  }
  
  var sort = (function() {
    function _sort(items, sorters, options) {
      options = qp_options(options, { copy: false });
      items = to_array(items, options.copy);
      each(items, function(item, i) { item.__idx = i; });
      sorters = to_array(sorters);
      var sorters_length = sorters.length;
      return items.sort(function(a, b) {
        var result = 0;
        for (var i = 0; i < sorters_length; i++) {
          var sorter = sorters[i];
          if (is(sorter, 'function')) {
            result = sorter(a, b);
          } else if (is(sorter.key, 'function')) {
            result = sorter.fn(sorter.key(a), sorter.key(b));
          } else {
            result = sorter.fn(get(a, sorter.key), get(b, sorter.key));
          }
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
        var re = /(^([+\-]?(?:\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?)?$|^0x[\da-fA-F]+$|\d+)/g;
        // trim pre-post whitespace
        var sre = /^\s+|\s+$/g;
        // normalize all whitespace to single ' ' character
        var snre = /\s+/g;
        var dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/;
        var hre = /^0x[0-9a-f]+$/i;
        var ore = /^0/;
        var i = function(s) { return (case_insensitive && ('' + s).toLowerCase() || '' + s).replace(sre, ''); };
        // convert all to strings strip whitespace
        var x = i(a) || '';
        var y = i(b) || '';
        // chunk/tokenize
        var xN = x.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0');
        var yN = y.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0');
        // numeric, hex or date detection
        var xD = parseInt(x.match(hre), 16) || (xN.length !== 1 && Date.parse(x));
        var yD = parseInt(y.match(hre), 16) || xD && y.match(dre) && Date.parse(y) || null;
        var normChunk = function(s, l) {
          // normalize spaces; find floats not starting with '0', string or 0 if not defined (Clint Priest)
          if (typeof s === 'undefined') return 0;
          return (!s.match(ore) || l == 1) && parseFloat(s) || s.replace(snre, ' ').replace(sre, '') || 0;
        };
        var oFxNcL, oFyNcL;
  
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
    if (type === 'natural') {
      return { fn: sort.natural, key: key, name: type };
    } else {
      var direction = asc ? 'asc' : desc ? 'desc' : 'asc';
      return { fn: (sort[type] || sort)[direction], key: key, name: type + '_' + direction };
    }
  }
  
  function ungroup(item_list) {
    remove_all(item_list, { group: true });
    return item_list;
  }
  
  function group(item_list, group_list) {
    item_list = to_array(item_list);
    group_list = to_array(group_list);
    var reverse_group_list = copy(group_list).reverse();
    var group_id = -1000;
    var item_index = 0;
    var item = null;
    var last_item = null;
    while (item_index <= item_list.length) {
      item = item_list[item_index];
      if (item_index === 0) {
        each(group_list, function(group) { add_item(header(item, group)); });
      } else if (item_index < item_list.length) {
        var header_list = [];
        var footer_list = [];
        each(group_list, function(group, index) {
          if (header_list.length || item[group.group_key] !== last_item[group.group_key]) {
            footer_list.unshift(footer(last_item, group));
            header_list.push(header(item, group));
          }
        });
        each(footer_list, function(footer) { add_item(footer); });
        each(header_list, function(header) { add_item(header); });
      } else if (item_index === item_list.length) {
        each(reverse_group_list, function(group) { add_item(footer(last_item, group)); });
      }
      last_item = item;
      item_index++;
    }
  
    function header(item, group) { return group_item(item, group, { header: true }); }
    function footer(item, group) { return group_item(item, group, { footer: true }); }
    function add_item(item) { item_list.splice(item_index++, 0, item); }
  
    function group_item(item, group, group_item) {
      group_item.id = group_id--;
      group_item.group = true;
      group_item.key = item[group.group_key];
      if (group.name_key) group_item.name = get(item, group.name_key);
      if (group.data_key) group_item.data = get(item, group.data_key);
      return group_item;
    }
  
    return build_group_list(item_list);
  }
  
  function build_group_list(item_list) {
    var group = { group_list: [ ], item_list: [ ] };
    var stack = [];
    qp.each(item_list, function(item) {
      if (item.group && item.header) {
        var new_group = { header: item, key: item.key, group_list: [ ], item_list: [ ] };
        if (item.name) new_group.name = item.name;
        if (item.data) new_group.data = item.data;
        group.group_list.push(new_group);
        stack.push(group);
        group = new_group;
      } else if (item.group && item.footer) {
        group.footer = item;
        group = stack.pop();
      } else {
        group.item_list.push(item);
      }
    });
    return group.group_list;
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
  
  function round(n, decimals) {
    return Number(Math.round(n + 'e' + decimals) + 'e-' + decimals);
  }
  
  function random(min, max) {
    return Math.round(min + (Math.random() * (max - min)));
  }
  
  function random_pick(o) {
    if (is_array(o)) {
      return o[random(0, o.length - 1)];
    }
  }
  
  function random_bool() {
    return Math.random() > 0.5;
  }
  
  function in_range(n, min, max) {
    return ((n >= min) && (n <= max));
  }
  
  function interpolate(a, b, percent) {
    return a + (b - a) * (percent || 0.1);
  }
  
  function ease_in(a, b, percent) {
    return a + (b - a) * Math.pow(percent, 2);
  }
  
  function ease_out(a, b, percent) {
    return a + (b - a) * (1 - Math.pow(1 - percent, 2));
  }
  
  function ease_in_out(a, b, percent) {
    return a + (b - a) * ((-Math.cos(percent * Math.PI) / 2) + 0.5);
  }
  
  function lerp(n, dn, dt) {
    return n + (dn * dt);
  }
  
  function max_number(s, d) { return Number(repeat('9', s) + '.' + repeat('9', d)); }
  
  function truncate(n, decimals) {
    var pow = Math.pow(10, decimals);
    return ~~(n * pow) / pow;
  }
  
  function clamp(n, min, max) {
    return Math.min(Math.max(n, min), max);
  }
  
  var currency_definitions = [
    { id: 1,  code: 'USD', name: 'US Dollar',           unit: 'dollar', symbol: '$',  decimals: 2, html: '&#0024;' },
    { id: 2,  code: 'EUR', name: 'Euro',                unit: 'euro',   symbol: '€',  decimals: 2, html: '&#20AC;' },
    { id: 3,  code: 'JPY', name: 'Japanese Yen',        unit: 'yen',    symbol: '¥',  decimals: 0, html: '&#00A5;' },
    { id: 4,  code: 'GBP', name: 'Pound Sterling',      unit: 'pound',  symbol: '£',  decimals: 2, html: '&#00A3;' },
    { id: 5,  code: 'AUD', name: 'Australian Dollar',   unit: 'dollar', symbol: '$',  decimals: 2, html: '&#0024;' },
    { id: 6,  code: 'CAD', name: 'Canadian Dollar',     unit: 'dollar', symbol: '$',  decimals: 2, html: '&#0024;' },
    { id: 7,  code: 'CHF', name: 'Swiss Franc',         unit: 'franc',  symbol: 'Fr', decimals: 2, html: '&#0070;&#0114;' },
    { id: 8,  code: 'CNY', name: 'Chineese Yuan',       unit: 'yuan',   symbol: '¥',  decimals: 2, html: '&#00A5;' },
    { id: 9,  code: 'SEK', name: 'Swedish Krona',       unit: 'krona',  symbol: 'kr', decimals: 2, html: '&#0107;&#0114;' },
    { id: 10, code: 'NZD', name: 'New Zealand Dollar',  unit: 'dollar', symbol: '$',  decimals: 2, html: '&#0024;' },
    { id: 11, code: 'MXN', name: 'Mexican Peso',        unit: 'peso',   symbol: '$',  decimals: 2, html: '&#20B1;' },
    { id: 12, code: 'SGD', name: 'Singapore Dollar',    unit: 'dollar', symbol: '$',  decimals: 2, html: '&#0024;' },
    { id: 13, code: 'HKD', name: 'Hong Kong Dollar',    unit: 'dollar', symbol: '$',  decimals: 2, html: '&#0024;' },
    { id: 14, code: 'NOK', name: 'Norwegian Krone',     unit: 'krone',  symbol: 'kr', decimals: 2, html: '&#0107;&#0114;' },
    { id: 15, code: 'KRW', name: 'South Korean Won',    unit: 'won',    symbol: '₩',  decimals: 0, html: '&#20A9;' },
    { id: 16, code: 'TRY', name: 'Turkish Lira',        unit: 'lira',   symbol: '₺',  decimals: 2, html: '&#20BA;' },
    { id: 17, code: 'RUB', name: 'Russian Ruble',       unit: 'ruble',  symbol: '₽',  decimals: 2, html: '&#20BD;' },
    { id: 18, code: 'INR', name: 'Indian Rupee',        unit: 'rupee',  symbol: '₹',  decimals: 2, html: '&#20B9;' },
    { id: 19, code: 'BRL', name: 'Brazilian Real',      unit: 'real',   symbol: 'R$', decimals: 2, html: '&#0024;' },
    { id: 20, code: 'ZAR', name: 'South African Rand',  unit: 'rand',   symbol: 'R',  decimals: 2, html: '&#0082;' },
    { id: 21, code: 'THB', name: 'Thai Baht',           unit: 'baht',   symbol: '฿',  decimals: 2, html: '&#0E3F;' } 
  ];
  
  var currency_lookup = { };
  each(currency_definitions, function(currency) {
    currency.display = currency.code + ' - ' + currency.symbol + ' - ' + currency.name;
    currency.pow = Math.pow(10, currency.decimals);
    currency_lookup[currency.code] = currency;
  });
  
  function currency_list() {
    return clone(currency_definitions);
  }
  
  function currency(code) {
    return currency_lookup[code] ? currency_lookup[code] : null;
  }
  
  function bankers_round(v, d) {
    d = d || 0;
    var m = Math.pow(10, d);
    var n = +(d ? v * m : v).toFixed(8);
    var i = Math.floor(n);
    var f = n - i;
    var e = 1e-8;
    var r = (f > 0.5 - e && f < 0.5 + e) ? ((i % 2 == 0) ? i : i + 1) : Math.round(n);
    return d ? r / m : r;
  }
  
  function calculate_precision(number) {
    var match = String(number).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
    if (!match) { return 0; }
    return Math.max(0, (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0));
  }
  
  
  function decimal(number, precision) {
    if (number instanceof Decimal) {
      return number.clone();
    } else {
      return new Decimal(number, precision);
    }
  }
  
  function Decimal(number, precision) {
    this.input = number;
    this.precision = (typeof precision === 'number' ? precision : calculate_precision(number));
    this.pow = Math.pow(10, this.precision);
    this.int_value = bankers_round(number * this.pow);
    this.value = this.int_value / this.pow;
  }
  
  Decimal.prototype.toString = function() { return this.value; };
  
  Decimal.prototype.clone = function() {
    return new Decimal(this.input, this.precision);
  };
  
  
  function money(currency_code, value, locale) {
    if (currency_code instanceof Money) {
      return currency_code.clone();
    } else {
      return new Money(currency_code, value, locale);
    }
  }
  
  function Money(currency_code, value, o) {
    o = qp_options(o, { locale: navigator.language });
    this.input = value;
    this.locale = o.locale;
    if (is(currency_code, 'string')) {
      this.currency = currency(currency_code);
    } else if (is(currency_code, 'object')) {
      this.currency = currency_code;
    }
    if (this.currency && this.currency.code !== '') {
      if (typeof value === 'string') {
        var sign = value.indexOf('-') !== -1 ? '-' : '';
        value = value.replace(/[^0-9.]/g, '');
        var parts = value.split('.');
        value = sign + (parts[0] || '0') + (this.currency.decimals ? '.' + (parts[1] || '0') : '');
        value = Number(value);
        this.int_value = Math.round(value * this.currency.pow);
      } else {
        this.int_value = bankers_round(value, this.currency.decimals) * this.currency.pow;
      }
      this.precision = this.currency.decimals;
      this.value = this.int_value / this.currency.pow;
      this.display = this.value.toLocaleString(this.locale, { style: 'currency', currency: this.currency.code });
      this.entry = this.value.toLocaleString(this.locale, {
        style: 'decimal',
        minimumFractionDigits: this.currency.decimals,
        maximumFractionDigits: this.currency.decimals
      }).replace(/[^0-9.]/g, '');
    } else {
      this.currency = { code: '', decimals: 2, pow: 100 };
      this.precision = 0.00;
      this.int_value = this.value = 0.00;
      this.entry = this.display = '0.00';
    }
  }
  
  Money.prototype.toString = function() { return this.display; };
  
  Money.prototype.clone = function() {
    return new Money(this.currency, this.input, this.locale);
  };
  
  Money.prototype.add = function(value) {
    var money = value instanceof Money ? value : new Money(this.currency, value, this.locale);
    return new Money(this.currency, (this.int_value + money.int_value) / this.currency.pow, this.locale);
  };
  
  Money.prototype.subtract = function(value) {
    var money = value instanceof Money ? value : new Money(this.currency, value, this.locale);
    return new Money(this.currency, (this.int_value - money.int_value) / this.currency.pow, this.locale);
  };
  
  Money.prototype.divide = function(value) {
    var decimal = value instanceof Decimal ? value : new Decimal(value);
    return new Money(this.currency, bankers_round((this.value / decimal.value), this.precision), this.locale);
  };
  
  Money.prototype.multiply = function(value) {
    var decimal = value instanceof Decimal ? value : new Decimal(value);
    return new Money(this.currency, bankers_round(this.value * decimal.value, (this.precision + decimal.precision)), this.locale);
  };
  
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
    if (is_array(items)) {
      var args = rest(arguments, 2);
      for (var i = 0, l = items.length; i < l; i++) {
        args[0] = items[i];
        var result = fn.apply(scope, args);
        if (result !== undefined) push(out, result);
      }
    }
    return out;
  }
  
  var alpha_numeric_re = /^[a-z0-9]+$/i;
  var url_re = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm;
  
  function is_valid(s, re) {
    if (is(s, 'string')) {
      return re.test(s);
    }
    return false;
  }
  
  function is_alpha_numeric(s) {
    return alpha_numeric_re.test(s);
  }
  
  function is_url(s) {
    return url_re.test(s);
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
  
  function validate_type(key, type, name) {
    return {
      key: key,
      name: qp.title_case(name || key),
      validate: 'validate_type',
      type: type,
      fn: function(value, model) {
        if (qp.is_not(value, this.type)) {
          return { message: this.name + ' is not a ' + this.type };
        }
      }
    };
  }
  
  function validate_number(key, min, max, name) {
    return {
      key: key,
      name: qp.title_case(name || key),
      validate: 'validate_number',
      min_value: min,
      max_value: max,
      fn: function(value, model) {
        if (qp.is_not(value, 'number')) {
          return { message: this.name + ' is not a number' };
        } else if (value > this.max_value) {
          return { message: this.name + ' cannot be larger than ' + this.max_value };
        } else if (value < this.min_value) {
          return { message: this.name + ' cannot be less than ' + this.min_value };
        }
      }
    };
  }
  
  function validate_not_empty(key, name) {
    return {
      key: key,
      name: qp.title_case(name || key),
      validate: 'validate_not_empty',
      fn: function(value, model) {
        if (qp.empty(value)) {
          return { message: 'Please provide a value for ' + this.name };
        }
      }
    };
  }
  
  function validate_string(key, min_length, max_length, name) {
    return {
      key: key,
      name: qp.title_case(name || key),
      validate: 'validate_string',
      min_length: min_length,
      max_length: max_length,
      fn: function(value, model) {
        if (qp.is_not(value, 'string')) {
          return { message: this.name + ' is not a text value' };
        } else if (min_length === 1 && value.length === 0) {
          return { message: 'Please provide a value for ' + this.name };
        } else if (value.length < min_length) {
          return { message: this.name + ' must be longer than ' + this.min_length + ' characters' };
        } else if (value.length > max_length) {
          return { message: this.name + ' cannot be longer than ' + this.max_length + ' characters' };
        }
      }
    };
  }
  
  function filter_key() {
    var key = '';
    if (is(arguments[0], 'array')) {
      return filter_key.apply(null, arguments[0]);
    } else if (arguments.length > 1) {
      key = join(map(arg(arguments), function(o) { return filter_key(o); }).sort(sort.string), '|');
    } else {
      var filter = arguments[0];
      if (is(filter, 'object')) {
        key = join(map(keys(filter).sort(sort.string), function(k) {
          return k + '=' + filter[k];
        }), '&');
      }
    }
    return key;
  }
  
  function filter_display() {
    var key;
    if (is(arguments[0], 'array')) {
      return filter_display.apply(null, arguments[0]);
    } else if (arguments.length > 1) {
      key = map(arg(arguments), function(o) { return filter_display(o); });
      return join(key, ' || ');
    } else {
      var filter = arguments[0];
      if (is(filter, 'object')) {
        key = map(keys(filter), function(k) { return k + ' == ' + filter[k]; });
        if (key.length > 1) {
          return '(' + join(key, ' && ') + ')';
        } else {
          return key[0];
        }
      } else {
        return '';
      }
    }
  }
  
  function filter_predicate() {
    var filters = map(arguments, function(filter) { return { filter: filter, keys: keys(filter) }; });
    return function(item, index, items) {
      return any(filters, function(o) { return eq(pick(item, o.keys), o.filter); });
    };
  }
  
  function filter(o) {
    if (is(arguments[1], 'array')) {
      return filter.apply(null, [o].concat(arguments[1]));
    } else if (arguments.length === 2) {
      return find_all(o, arguments[1]);
    } else {
      return find_all(o, filter_predicate.apply(null, rest(arguments)));
    }
  }
  
  function watch(target, on_change) {
    each_own(target, function(value, key) {
      watch_property(target, key, on_change);
      if (is(value, 'object')) watch(value, on_change);
    });
    return target;
  }
  
  function unwatch(target) {
    each_own(target, function(value, key) {
      unwatch_property(target, key);
      if (is(value, 'object')) unwatch(value);
    });
    return target;
  }
  
  function watch_property(target, key, on_change) {
    var value = target[key];
    if (delete target[key]) {
      Object.defineProperty(target, key, {
        enumerable: true,
        configurable: true,
        get: function() { return value; },
        set: function(new_value) {
          var old_value = value;
          if (qp.is(new_value, 'object')) watch(new_value, on_change);
          value = new_value;
          on_change.call(target, key, new_value, old_value);
        }
      });
    }
  }
  
  function unwatch_property(target, key) {
    var value = target[key];
    delete target[key];
    target[key] = value;
  }
  
  function define_property(target, key, on_change) {
    var value = target[key];
    if (delete target[key]) {
      Object.defineProperty(target, key, {
        enumerable: true,
        configurable: true,
        get: function() { return value; },
        set: function(new_value) {
          var old_value = value;
          value = new_value;
          on_change.call(target, key, new_value, old_value);
        }
      });
    }
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
    } else if (options.files) {
      options.method = 'POST';
      options.headers['Content-Type'] = 'multipart/form-data';
      var data = options.data = new FormData();
      for (var i = 0, l = options.files.length; i < l; i++) {
        var file = options.files[i];
        data.append('file' + i, file, file.name);
      }
    }
    options.method = upper(options.method);
    request.open(options.method, options.url, true);
    set_request_headers(request, options.headers);
  
    if (options.upload_progress) {
      request.upload.onprogress = function(e) {
        if (e.lengthComputable) options.upload_progress.call(options.bind, e, (e.loaded / e.total) * 100);
      };
    }
    if (options.download_progress) {
      request.onprogress = function(e) {
        if (e.lengthComputable) options.download_progress.call(options.bind, e, (e.loaded / e.total) * 100);
      };
    }
    if (options.timeout) {
      request.timeout = options.timeout;
      request.ontimeout = function(e) {
        var error = new Error('Request Timed Out');
        error.timeout = true;
        if (options.on_timeout) options.on_timeout.call(options.bind, error);
        options.done.call(options.bind, error, {});
      };
    }
    request.onabort = function() {
      var error;
      if (request.user_cancelled) {
        error = new Error('Request Cancelled');
        error.cancelled = true;
      } else if (request.user_timeout) {
        error = new Error('Request Timeout');
        error.timeout = true;
      } else {
        error = new Error('Request Aborted');
      }
      error.abort = true;
      if (options.on_abort) options.on_abort.call(options.bind, error);
      options.done.call(options.bind, error, {});
    };
    request.onerror = function(error) {
      if (error.type === 'error' && error.target && error.target.status === 0) {
        error = new Error('Request Timed Out');
        error.timeout = true;
      }
      options.done.call(options.bind, error, {});
    };
  
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
        response.result = response.data;
      }
      if (request.status >= 200 && request.status < 400) {
        response.ok = true;
        options.done.call(options.bind, null, response);
      } else {
        options.done.call(options.bind, new Error(response.status), response);
      }
    };
    request.send(options.data);
    return request;
  }
  
  function set_request_headers(http_request, headers) {
    each_own(headers, function(header, key) {
      http_request.setRequestHeader(key, header);
    });
  }
  
  function get_response_headers(http_request) {
    var headers = { };
    http_request.getAllResponseHeaders().split('\r\n').forEach(function(header) {
      if (not_empty(clean_whitespace(header))) {
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
  
  function get_attributes(el, name) {
    if (el && el.attributes) {
      var attributes = slice.call(el.attributes);
      if (is(name, 'string')) {
        return select(attributes, function(attribute) {
          if (match(attribute.name, name)) return attr_object(attribute);
        });
      } else {
        return map(attributes, attr_object);
      }
    } else {
      return [];
    }
  }
  
  function attr_object(attribute) {
    if (attribute) return { name: attribute.nodeName, value: attribute.nodeValue };
  }
  
  function set_attributes(el, attributes) {
    el = element(el);
    if (el && is(attributes, 'array')) {
      each(attributes, partial(set_attribute, el));
    }
  }
  
  function get_attribute(el, name) {
    if (el && el.attributes) {
      return attr_object(qp.find(el.attributes, function(attribute) {
        return match(attribute.nodeName, name);
      }));
    }
  }
  
  function set_attribute(el, attribute) {
    el = element(el);
    if (el && attribute) {
      el.setAttribute(attribute.name, attribute.value);
    }
  }
  
  function remove_attribute(el, attribute) {
    el = element(el);
    if (el && attribute) {
      el.removeAttribute(attribute.name || attribute);
    }
  }
  
  function has_attribute(el, attribute) {
    el = element(el);
    if (el && attribute) {
      el.hasAttribute(attribute.name || attribute);
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
    } else if (arg_count === 1 && (arg0 === window || arg0 === document)) {
      return arg0;
    } else if (defined(arg0.length)) {
      return arg_count === 1 ? element(arg0[0]) : element(arg0[0], arg1);
    }
    return null;
  }
  
  function on(el, event_name, handler, scope) {
    if (scope) handler = handler.bind(scope);
    el = element(el);
    el.addEventListener(event_name, handler, false);
  }
  
  function off(el, event_name, handler) {
    el = element(el);
    el.removeEventListener(event_name, handler);
  }
  
  function nodefault(e) {
    e.preventDefault();
    e.stopPropagation();
  }
  
  function show(el, v) {
    el = element(el);
    if (v === 'auto') {
      var name = qp.lower(el.nodeName);
      if (qp.in(name, 'span', 'a', 'button', 'img', 'textarea', 'select')) v = 'inline';
      else if (qp.in(name, 'input')) v = 'inline-block';
      else v = 'block';
    }
    el.style.display = v || 'block';
  }
  
  function hide(el, v) {
    el = element(el);
    el.style.display = v || 'none';
  }
  
  function visible(el) {
    el = element(el);
    if (el) return el.style.display !== 'none' && el.style.display !== '';
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
    var tmp = document.implementation.createHTMLDocument('');
    tmp.body.innerHTML = slice.call(arguments).join('');
    return tmp.body.children[0];
  }
  
  function swap(a, b) {
    if (is(b, 'string')) b = html(b);
    a = element(a);
    a.parentNode.replaceChild(b, a);
    return b;
  }
  
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
      return (el.matches || el.matchesSelector || el.msMatchesSelector).call(el, selector);
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
  

  var qp = {
    hex_to_rgb: hex_to_rgb,
    validate_color_hex: validate_color_hex,
    brighten_hex: brighten_hex,
    darken_hex: darken_hex,
    base64_decode: base64_decode,
    noop: noop,
    noop_callback: noop_callback,
    escape_re: escape_re,
    is_empty: is_empty,
    is_value: is_value,
    is_boolean: is_boolean,
    is_number: is_number,
    is_function: is_function,
    is_string: is_string,
    is_array: is_array,
    is_array_like: is_array_like,
    defined: defined,
    undefined: not_defined,
    random: random,
    iif: iif,
    dfault: dfault,
    boolean: boolean,
    number: number,
    no: empty,
    not: not,
    is_object: is_object,
    is_null: is_null,
    not_null: not_null,
    empty: empty,
    not_empty: not_empty,
    empty_or_whitespace: empty_or_whitespace,
    upper: upper,
    lower: lower,
    trim: trim,
    items: items,
    ltrim: ltrim,
    rtrim: rtrim,
    split: split,
    join: join,
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
    to_title_case: to_title_case,
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
    json: json,
    eol: eol,
    sum: sum,
    min: min,
    max: max,
    avg: avg,
    round: round,
    random: random,
    random_pick: random_pick,
    random_bool: random_bool,
    in_range: in_range,
    max_number: max_number,
    truncate: truncate,
    clamp: clamp,
    interpolate: interpolate,
    ease_in: ease_in,
    ease_out: ease_out,
    ease_in_out: ease_in_out,
    lerp: lerp,
    currency: currency,
    currency_list: currency_list,
    Money: Money,
    money: money,
    Decimal: Decimal,
    decimal: decimal,
    map: map,
    reduce: reduce,
    arg: arg,
    to_array: to_array,
    csv: csv,
    flatten: flatten,
    compact: compact,
    insert_at: insert_at,
    zip: zip,
    unzip: unzip,
    now: now,
    date: date,
    date_time: date_time,
    empty_date: empty_date,
    is_empty_date: is_empty_date,
    min_date: bot,
    bot: bot,
    is_min_date: is_bot,
    is_bot: is_bot,
    max_date: eot,
    eot: eot,
    is_max_date: is_eot,
    is_eot: is_eot,
    file_date: file_date,
    get_fn_name: get_fn_name,
    timer: timer,
    time_ago: time_ago,
    start_of: start_of,
    end_of: end_of,
    iso: iso,
    combine: combine,
    done: done,
    bind: bind,
    chain: chain,
    partial: partial,
    invoke: invoke,
    invoke_after: invoke_after,
    invoke_delay: invoke_delay,
    invoke_next: invoke_next,
    invoke_when: invoke_when,
    debounce: debounce,
    throttle: throttle,
    patch: patch,
    call: call,
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
    override: override,
    make: make,
    module: _module,
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
    sort: sort,
    get_comparer: get_comparer,
    group: group,
    ungroup: ungroup,
    options: qp_options,
    id: qp_id,
    uuid: uuid,
    get: get,
    take: take,
    has: has,
    set: set,
    each_series: each_series,
    series: series,
    parallel: parallel,
    pick: pick,
    union: union,
    chunk: chunk,
    segment: segment,
    shuffle: shuffle,
    unique: unique,
    clear: clear,
    push: push,
    load: load,
    contains: contains,
    inlist: inlist,
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
    hash: hash,
    select: select,
    is_valid: is_valid,
    is_alpha_numeric: is_alpha_numeric,
    is_length: is_length,
    is_url: is_url,
    validate_type: validate_type,
    validate_number: validate_number,
    validate_not_empty: validate_not_empty,
    validate_string: validate_string,
    filter_key: filter_key,
    filter_display: filter_display,
    filter_predicate: filter_predicate,
    filter: filter,
    define_property: define_property,
    watch: watch,
    unwatch: unwatch,
    watch_property: watch_property,
    unwatch_property: unwatch_property,
    debug: debug,
    get_attributes: get_attributes,
    set_attributes: set_attributes,
    get_attribute: get_attribute,
    set_attribute: set_attribute,
    has_attribute: has_attribute,
    remove_attribute: remove_attribute,
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
    has_class: has_class,
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

  global.debug = function() {
    console.log.apply(console, ["%cDEBUG:", "color:black;background-color:yellow;"].concat(slice.call(arguments)));
  }

  global.global = global;

  define(module, function(exports, require) {
  
    var qp = require('qp-utility');
  
    qp.make(exports, {
  
      ns: 'qp-utility/websocket',
  
      websocket: null,
  
      url: '',
      auto: true,
      secure: false,
      protocols: null,
      json: false,
  
      retry_id: 0,
      retry_interval: 5000,
      retry_count: 0,
      retry_max: Infinity,
  
      on_error: false,
      on_close: false,
      on_open: false,
      on_data: false,
      on_reconnect: false,
      on_reconnect_failed: false,
  
      init: function(options) {
        if (this.protocols) this.json = qp.contains(this.protocols, 'json-message');
        if (this.auto) this.open();
      },
  
      open: function() {
        if (!this.websocket) this.connect();
      },
  
      connect: function() {
        if (this.websocket) this.websocket.close();
        this.websocket = new WebSocket((this.secure ? 'wss://' : 'ws://') + this.url, this.protocols);
        this.websocket.addEventListener('error', this.error_handler.bind(this));
        this.websocket.addEventListener('close', this.close_handler.bind(this));
        this.websocket.addEventListener('open', function(e) {
          this.retry_count = 0;
          clearTimeout(this.rety_id);
          log('CONNECT', this.url);
          if (this.on_open) this.on_open(this, e);
          if (this.on_data) {
            this.websocket.addEventListener('message', function(e) {
              var data = e.data;
              if (this.json) data = JSON.parse(data);
              log('MSG_IN', qp.stringify(data, true));
              if (this.on_data) this.on_data(data, this, e);
            }.bind(this));
          }
        }.bind(this));
      },
  
      reconnect: function() {
        if (this.retry_count++ < this.retry_max) {
          this.retry_id = setTimeout(function() {
            log('RECONNECT', this.url);
            if (this.on_reconnect) this.on_reconnect(this);
            this.connect();
          }.bind(this), this.retry_interval);
        } else if (this.on_reconnect_failed) {
          this.on_reconnect_failed(this);
        }
      },
  
      retry: function() {
        this.retry_count = 0;
        this.reconnect();
      },
  
      error_handler: function(e) {
        if (this.on_error) this.on_error(this, e);
        this.close();
        if (this.auto && e && (e.code === 'ECONNREFUSED' || e.code === 'ERR_CONNECTION_REFUSED')) this.reconnect();
      },
  
      close_handler: function(e) {
        if (this.auto && e && (e.code === 1005 || e.code === 1006)) this.reconnect();
        if (this.on_close) this.on_close(this, e);
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
        o = o || {};
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
        o = o || {};
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
        var key = this.get_key(options.key);
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
  

})(window);