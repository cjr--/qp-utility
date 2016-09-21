function has_key(o, k) {
  return Object.keys(o).indexOf(k) !== -1;
}

function delete_key(o, k, d) {
  if (not_defined(o)) {
    return d;
  } else if (not_defined(k) || not_defined(o[k])) {
    return d;
  } else {
    var v = o[k];
    delete o[k];
    return v;
  }
}

function qp_delete(o, k) {
  if (not_defined(o)) {
    o = { };
  } else if (not_defined(k) || not_defined(o[k])) {
  } else {
    delete o[k];
  }
  return o;
}
