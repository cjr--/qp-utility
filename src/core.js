var is_array = Array.isArray;
var slice = Array.prototype.slice;
var concat = Array.prototype.concat;
var to_string = Object.prototype.toString;
var for_each = Array.prototype.forEach;
var class_re = /^\.([\w\-]+)$/;

function noop(o) { return o; }

function noop_callback(data, done) { invoke_next(done, null, data); }

function is_number(o) { return o - parseFloat(o) >= 0; }

function is_string(o) { return typeof o === 'string'; }

function is_function(o) { return typeof o === 'function'; }

function defined(o) { return !not_defined(o); }

function not_defined(o) { return typeof o === 'undefined'; }

function escape_re(o) { return o.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); }

function random(min, max) { return Math.floor(Math.random() * (max - min)) + min; }

function empty(o) {
  return typeof o === 'undefined' || o === null ||
    (is_array(o) && o.length === 0) ||
    (is_string(o) && o.length === 0) ||
    (is_number(o) && o === 0);
}

function not_empty(o) { return !empty(o); }

function dfault(value, dfault_value) { return not_defined(value) ? dfault_value : value; }
