var iso_date_re = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+/;
var date_format = {
  MMMM: ['January','February','March','April','May','June','July','August','September','October','November','December'],
  MMM: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
  dddd: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
  ddd: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
};

// -271821-04-20T00:00:00.000Z
// js_min_date = -8640000000000000
// +275760-09-13T00:00:00.000Z
// js_max_date = 8640000000000000

// 0001-01-01T00:00:00+00:00
var min_date = -62135596800000;
// 9999-12-31T00:00:00+00:00
var max_date = 253402214400000;

function format_date(dt, format) {
  if (isNaN(+dt)) {
    return null;
  } else if (not_defined(format)) {
    return dt;
  } else if (format === 'YYYY') {
    return dt.getUTCFullYear();
  } else if (format === 'MMMM' || format === 'MMM') {
    return date_format[format][dt.getUTCMonth()];
  } else if (format === 'dddd' || format === 'ddd') {
    return date_format[format][dt.getUTCDay()];
  } else if (format === 'utc') {
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

function iso(dt) {
  if (is(dt, 'string')) dt = new Date(dt);
  if (is(dt, 'number')) {
    if (dt === -Infinity) dt = new Date(min_date);
    else if (dt === Infinity) dt = new Date(max_date);
    else dt = new Date(dt);
  }
  if (is_not(dt, 'date')) dt = new Date(min_date);
  return dt.toISOString();
}

function now(format) {
  var _now = new Date();
  if (is(format, 'string')) {
    return format_date(_now, format);
  } else {
    _now.offset = function(offset, unit, format_offset) {
      if (unit === 'day' || unit === 'days') {
        offset = offset * 24 * 60 * 60 * 1000;
      } else if (unit === 'hour' || unit === 'hours') {
        offset = offset * 60 * 60 * 1000;
      }
      var dt = new Date(_now.getTime() + offset);
      return (format_offset ? format_date(dt, format_offset) : dt);
    };
    return _now;
  }
}

function start_of(dt, epoch, format) {
  if (epoch === 'month') {
    dt = new Date(dt);
    dt.setUTCDate(1);
  }
  return format_date(dt, format);
}

function end_of(dt, epoch, format) {
  if (epoch === 'month') {
    dt = new Date(dt);
    dt.setUTCMonth(dt.getUTCMonth() + 1);
    dt.setUTCDate(0);
  }
  return format_date(dt, format);
}

function date(dt, format) {
  return format_date(new Date(dt), format);
}

function bot(format) {
  return format_date(new Date(min_date), format);
}

function is_bot(dt) {
  return +dt === min_date;
}

function eot(format) {
  return format_date(new Date(max_date), format);
}

function is_eot(dt) {
  return +dt === max_date;
}

function empty_date(format) {
  return format_date(new Date(min_date), format);
}

function is_empty_date(dt) {
  return +dt === min_date;
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
      } else if (format === 'day month, year') {
        return dt.getDate() + ' ' + date_format['MMM'][dt.getMonth()] + ', ' + dt.getFullYear();
      } else if (format === 'month day, year') {
        return date_format['MMM'][dt.getMonth()] + ' ' + dt.getDate() + ', ' + dt.getFullYear();
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
