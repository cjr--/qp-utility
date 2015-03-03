var to_array = Array.prototype.slice;
var to_string = Object.prototype.toString;

function escape_re(s) {
  return s.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
}
