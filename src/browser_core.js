function eol() {
  return '\n';
}

function get_locale() {
  return navigator.language;
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
