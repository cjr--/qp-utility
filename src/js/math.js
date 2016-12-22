function sum(o, key) {
  if (is_array(o)) {
    if (key) {
      return o.reduce(function(sum, item) {
        return sum + Number(get(item, key));
      }, 0);
    } else {
      return o.reduce(function(sum, item) {
        return sum + Number(item);
      }, 0);
    }
  }
  return 0;
}

function min_max(o, k, op) {
  if (is_array(o)) {
    if (k) {
      o = o.map(function(item) { return item[k]; });
    }
    return Math[op].apply(Math, o);
  }
  return 0;
}

function avg(o, k) { return sum(o, k) / (o.length || 1); }
function max(o, k) { return min_max(o, k, 'max'); }
function min(o, k) { return min_max(o, k, 'min'); }

function round(n, decimals) {
  return Number(Math.round(n + 'e' + decimals) + 'e-' + decimals);
}

function truncate(n, decimals) {
  var pow = Math.pow(10, decimals);
  return ~~(n * pow) / pow;
}

function clamp(n, min, max) {
  return Math.min(Math.max(n, min), max);
}

function round_currency(v, decimals) {
  var d = decimals || 0;
  var m = Math.pow(10, d);
  var n = +(d ? v * m : v).toFixed(8);
  var i = Math.floor(n);
  var f = n - i;
  var e = 1e-8;
  var r = (f > 0.5 - e && f < 0.5 + e) ? ((i % 2 == 0) ? i : i + 1) : Math.round(n);
  return d ? r / m : r;
}
