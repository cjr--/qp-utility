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
