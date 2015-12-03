var is_array = Array.isArray;
var array_slice = Array.prototype.slice;
var array_concat = Array.prototype.concat;
var object_to_string = Object.prototype.toString;

function noop() { }

function noop_callback(data, done) { qp.invoke_next(done, null, data); }

function is_number(o) { return o - parseFloat(o) >= 0; }

function is_function(o) { return typeof o === 'function'; }

function is_not_function(o) { return !is_function(o); }

function is_defined(o) { return !is_undefined(o); }

function is_undefined(o) { return typeof o === 'undefined'; }

function escape_re(o) { return o.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); }

function random(min, max) { return Math.floor(Math.random() * (max - min)) + min; }

function is_empty(o) { return typeof o === 'undefined' || o === null || (o.length && o.length === 0); }

function not_empty(o) { return !is_empty(o); }

function dfault(value, dfault_value) { return is_undefined(value) ? dfault_value : value; }
