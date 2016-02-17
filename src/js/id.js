var _id = Math.round(+(new Date()) * 0.001);

function id() { return _id++; }

function uuid() {
  var d = new Date().getTime();
  var _uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r&0x7|0x8)).toString(16);
  });
  return _uuid;
}
