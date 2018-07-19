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

function dfault(value, dfault) { return not_defined(value) ? dfault : value; }

function boolean(value, dfault) { return is_boolean(value) ? value : dfault; }

function number(value, dfault) { return is_number(value) ? value : dfault; }
