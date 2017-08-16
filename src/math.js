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

function max_number(s, d) { return Number(repeat('9', s) + '.' + repeat('9', d)); }

function truncate(n, decimals) {
  var pow = Math.pow(10, decimals);
  return ~~(n * pow) / pow;
}

function clamp(n, min, max) {
  return Math.min(Math.max(n, min), max);
}
