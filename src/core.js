var array_slice = Array.prototype.slice;
var object_to_string = Object.prototype.toString;

function to_array(o) {
  if (Array.isArray(o)) {
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

function escape_re(s) {
  return s.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
}
