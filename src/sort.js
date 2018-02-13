var sort = (function() {
  function _sort(items, sorters, options) {
    items = to_array(items);
    each(items, function(item, i) { item.__idx = i; });
    sorters = to_array(sorters);
    var sorters_length = sorters.length;
    return items.sort(function(a, b) {
      var result = 0;
      for (var i = 0; i < sorters_length; i++) {
        var sorter = sorters[i];
        if (is(sorter.key, 'function')) {
          result = sorter.fn(sorter.key(a), sorter.key(b));
        } else {
          result = sorter.fn(get(a, sorter.key), get(b, sorter.key));
        }
        if (result !== 0) break;
      }
      return result === 0 ? (a.__idx > b.__idx ? 1 : -1) : result;
    });
  }

  function natural_sort(case_insensitive) {
    /*
     * Natural Sort algorithm for Javascript - Version 0.8 - Released under MIT license
     * Author: Jim Palmer (based on chunking idea from Dave Koelle)
     * https://github.com/overset/javascript-natural-sort
     */
    return function(a, b) {
      var re = /(^([+\-]?(?:\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?)?$|^0x[\da-fA-F]+$|\d+)/g;
      // trim pre-post whitespace
      var sre = /^\s+|\s+$/g;
      // normalize all whitespace to single ' ' character
      var snre = /\s+/g;
      var dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/;
      var hre = /^0x[0-9a-f]+$/i;
      var ore = /^0/;
      var i = function(s) { return (case_insensitive && ('' + s).toLowerCase() || '' + s).replace(sre, ''); };
      // convert all to strings strip whitespace
      var x = i(a) || '';
      var y = i(b) || '';
      // chunk/tokenize
      var xN = x.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0');
      var yN = y.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0');
      // numeric, hex or date detection
      var xD = parseInt(x.match(hre), 16) || (xN.length !== 1 && Date.parse(x));
      var yD = parseInt(y.match(hre), 16) || xD && y.match(dre) && Date.parse(y) || null;
      var normChunk = function(s, l) {
        // normalize spaces; find floats not starting with '0', string or 0 if not defined (Clint Priest)
        if (typeof s === 'undefined') return 0;
        return (!s.match(ore) || l == 1) && parseFloat(s) || s.replace(snre, ' ').replace(sre, '') || 0;
      };
      var oFxNcL, oFyNcL;

      // first try and sort Hex codes or Dates
      if (yD) {
        if (xD < yD) { return -1; }
        else if (xD > yD) { return 1; }
      }
      // natural sorting through split numeric strings and default strings
      for (var cLoc=0, xNl = xN.length, yNl = yN.length, numS=Math.max(xNl, yNl); cLoc < numS; cLoc++) {
        oFxNcL = normChunk(xN[cLoc], xNl);
        oFyNcL = normChunk(yN[cLoc], yNl);
        // handle numeric vs string comparison - number < string - (Kyle Adams)
        if (isNaN(oFxNcL) !== isNaN(oFyNcL)) { return (isNaN(oFxNcL)) ? 1 : -1; }
        // rely on string comparison if different types - i.e. '02' < 2 != '02' < '2'
        else if (typeof oFxNcL !== typeof oFyNcL) {
          oFxNcL += '';
          oFyNcL += '';
        }
        if (oFxNcL < oFyNcL) { return -1; }
        if (oFxNcL > oFyNcL) { return 1; }
      }
      return 0;
    };
  }

  _sort.asc =  function(a, b) { return (a < b) ? -1 : (a > b) ? 1 : 0; };
  _sort.desc = function(a, b) { return (a > b) ? -1 : (a < b) ? 1 : 0; };
  _sort.number = {
    asc:  function(a, b) { return a - b; },
    desc: function(a, b) { return b - a; }
  };
  _sort.string = {
    asc:  function(a, b) { return a.localeCompare(b); },
    desc: function(a, b) { return b.localeCompare(a); }
  };
  _sort.moment = {
    asc: function(a, b) { return (a < b) ? -1 : (a > b) ? 1 : 0; },
    desc: function(a, b) { return (a > b) ? -1 : (a < b) ? 1 : 0; }
  };
  _sort.date = {
    asc:  function(a, b) { return a.getTime() - b.getTime(); },
    desc: function(a, b) { return b.getTime() - a.getTime(); }
  };
  _sort.empty = {
    last: function(a, b) { return (!!a) ? -1 : (!!b) ? 1 : 0; },
    first: function(a, b) { return (!!a) ? 1 : (!!b) ? -1 : 0; }
  };
  _sort.natural = natural_sort();

  return _sort;
})();

function get_comparer(type, asc, desc, key) {
  type = type || '';
  var fn = (sort[type] || sort)[asc ? 'asc' : desc ? 'desc' : 'asc'];
  return { fn: fn, key: key };
}
