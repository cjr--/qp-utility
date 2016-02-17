function get_data(original) {
  var non_transferable = 'NON_TRANSFERABLE';
  function _get_data(o) {
    var data = non_transferable;
    var value;
    var type_o = qp_typeof(o);
    if (type_o == 'array') {
      data = [];
      for (var i = 0, l = o.length; i < l; i++) {
        value = _get_data(o[i]);
        if (value === non_transferable) value = undefined;
        data[i] = value;
      }
    } else if (type_o == 'date' || (o && o.toISOString)) {
      data = o.toISOString();
    } else if (type_o == 'object') {
      data = {};
      for (var key in o) {
        if (o.hasOwnProperty(key)) {
          value = _get_data(o[key]);
          if (value !== non_transferable) data[key] = value;
        }
      }
    } else if (type_o == 'number' || type_o == 'string' || type_o == 'boolean') {
      data = o;
    }
    return data;
  }
  return _get_data(original);
}

function set_data(original) {
  function _set_data(o) {
    var type_o = qp_typeof(o);
    if (type_o == 'array') {
      for (var i = 0, l = o.length; i < l; i++) {
        o[i] = _set_data(o[i]);
      }
    } else if (type_o == 'date' || (o && o.toISOString)) {
       return o.toISOString();
    } else if (type_o == 'object') {
      for (var key in o) {
        if (o.hasOwnProperty(key)) o[key] = _set_data(o[key]);
      }
    } else if (type_o == 'string') {
      if (iso_date_re.test(o)) {
        if (moment) {
          return moment(o);
        } else {
          return new Date(o);
        }
      }
    }
    return o;
  }
  return _set_data(original);
}
