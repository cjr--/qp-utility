var identity = 101;

function id(use_date) {
  if (use_date) {
    return String(new Date().getTime() + identity++);
  } else {
    return String(identity++);
  }
}

function uuid() {
  var d = new Date().getTime();
  var _uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r&0x7|0x8)).toString(16);
  });
  return _uuid;
}
