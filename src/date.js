function now(format) {
  var _now = new Date();
  if (format) {
    if (format === 'utc') {
      return _now.toUTCString();
    } else if (format === 'int') {
      return _now.valueOf();
    }
  }
  now.offset = function(offset, unit) {
    if (unit === 'day' || unit === 'days') {
      offset = offset * 24 * 60 * 60 * 1000;
    } else if (unit === 'hour' || unit === 'hours') {
      offset = offset * 60 * 60 * 1000;
    }
    return new Date(now.getTime() + offset);
  };
  return _now;
}

function date(dt) {
  return new Date(dt);
}

function file_date() {
  var dt = now();
  var year = dt.getUTCFullYear().toString();
  var month = lpad(dt.getUTCMonth().toString(), '0', 2);
  var day = lpad(dt.getUTCDate().toString(), '0', 2);
  return [year, month, day].join('');
}
