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
  if (qp.is(options, 'string') && options === 'json') {
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

function json(o, options) {
  var type = qp_typeof(o);
  if (type === 'string') {
    return JSON.parse(o || '{}');
  } else if (type === 'object' || type === 'array') {
    return JSON.stringify(o || {}, null, '  ');
  }
  return o;
}
