var to_array = Array.prototype.slice;
var to_string = Object.prototype.toString;

function escape_re(s) {
  return s.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
}

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

var qp = {
  escape_re: escape_re,
  trim: trim,
  ltrim: ltrim,
  rtrim: rtrim
};

module.exports = qp;