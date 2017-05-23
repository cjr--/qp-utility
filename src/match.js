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
