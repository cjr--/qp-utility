(function(global) {
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
  
  function trim(s, chars) {
    chars = escape_re(chars || ' ');
    if (s === undefined || s === null) {
      return '';
    } else {
      return String(s).replace(new RegExp('^' + chars + '+|' + chars + '+$', 'g'), '');
    }
  }
  
  function ltrim(s, chars) {
    chars = escape_re(chars || ' ');
    if (s === undefined || s === null) {
      return '';
    } else {
      return String(s).replace(new RegExp('^' + chars + '+'), '');
    }
  }
  
  function rtrim(s, chars) {
    chars = escape_re(chars || ' ');
    if (s === undefined || s === null) {
      return '';
    } else {
      return String(s).replace(new RegExp(chars + '+$'), '');
    }
  }
  
  var qp = {
    escape_re: escape_re,
    trim: trim,
    ltrim: ltrim,
    rtrim: rtrim
  };
  
  global.qp = qp;
})(this);