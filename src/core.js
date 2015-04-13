var array_slice = Array.prototype.slice;
var object_to_string = Object.prototype.toString;
var is_array = Array.isArray;

function noop() { }

function is_number(o) { return o - parseFloat(o) >= 0; }

function is_function(o) { return typeof o === 'function'; }

function escape_re(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

function random(min, max) { return Math.floor(Math.random() * (max - min)) + min; }

function is_empty(o) { return typeof o === 'undefined' || o === null || (o.length && o.length === 0); }

function not_empty(o) { return !is_empty(o); }
