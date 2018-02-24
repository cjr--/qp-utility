var month_long = ['January','February','March','April','May','June','July','August','September','October','November','December'];
var month_short = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var day_long = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
var day_short = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
var iso_date_re = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+/;

// 0001-01-01T00:00:00+00:00
var beginning_of_time = -62135596800000;
// 9999-12-31T00:00:00+00:00
var end_of_time = 253402214400000;

function format_date(dt, format) {
  if (format === 'utc') {
    return dt.toUTCString();
  } else if (format === 'iso') {
    return dt.toISOString();
  } else if (format === 'int') {
    return dt.getTime();
  } else if (format === 'string') {
    return String(dt.getTime());
  } else if (format === 'time') {
    var hours = lpad(dt.getUTCHours().toString(), '0', 2);
    var minutes = lpad(dt.getUTCMinutes().toString(), '0', 2);
    var seconds = lpad(dt.getUTCSeconds().toString(), '0', 2);
    return [hours, minutes, seconds].join(':');
  } else {
    return dt;
  }
}

function now(format) {
  var _now = new Date();
  if (format) {
    return format_date(_now, format);
  } else {
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
}

function date(dt, format) {
  return format_date(new Date(dt), format);
}

function bot(format) {
  return format_date(new Date(beginning_of_time), format);
}

function is_bot(dt) {
  return +dt === beginning_of_time;
}

function eot(format) {
  return format_date(new Date(end_of_time), format);
}

function is_eot(dt) {
  return +dt === end_of_time;
}

function empty_date(format) {
  return format_date(new Date(beginning_of_time), format);
}

function is_empty_date(dt) {
  return +dt === beginning_of_time;
}

function time_ago(dt) {
  function epoch(interval, epoch) {
    return interval + ' ' + epoch + (interval <= 1 ? '' : 's');
  }

  var interval;
  var seconds = Math.floor((new Date() - dt) / 1000);

  interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return epoch(interval, 'year');
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return epoch(interval, 'month');
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return epoch(interval, 'day');
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return epoch(interval, 'hour');
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return epoch(interval, 'minute');

  return epoch(Math.floor(seconds), 'second');
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
