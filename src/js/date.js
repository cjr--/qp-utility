var month_long = ['January','February','March','April','May','June','July','August','September','October','November','December'];
var month_short = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var day_long = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
var day_short = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
var iso_date_re = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+/;

function now(format) {
  var _now = new Date();
  if (format) {
    if (format === 'utc') {
      return _now.toUTCString();
    } else if (format === 'iso') {
      return _now.toISOString();
    } else if (format === 'int') {
      return _now.getTime();
    } else if (format === 'string') {
      return String(_now.getTime());
    } else if (format === 'time') {
      var hours = lpad(_now.getUTCHours().toString(), '0', 2);
      var minutes = lpad(_now.getUTCMinutes().toString(), '0', 2);
      var seconds = lpad(_now.getUTCSeconds().toString(), '0', 2);
      return [hours, minutes, seconds].join(':');
    }
  }
  _now.offset = function(offset, unit) {
    if (unit === 'day' || unit === 'days') {
      offset = offset * 24 * 60 * 60 * 1000;
    } else if (unit === 'hour' || unit === 'hours') {
      offset = offset * 60 * 60 * 1000;
    }
    return new Date(_now.getTime() + offset);
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

function date_time(dt) {
  dt = (typeof dt === 'string' ? new Date(dt) : dt);
  return {
    format: function(format) {
      if (format === 'utc') {
        return dt.toUTCString();
      } else if (format === 'month day, year') {
        return month_short[dt.getMonth()] + ' ' + dt.getDate() + ', ' + dt.getFullYear();
      }
      return dt;
    }
  };
}

function timer() {
  var start = new Date();
  var lap = start;
  return {
    elapsed: function() {
      return ((new Date() - start) / 1000).toFixed(2);
    },
    lap: function() {
      var last_lap = lap;
      lap = new Date();
      return ((lap - last_lap) / 1000).toFixed(2);
    }
  };
}
