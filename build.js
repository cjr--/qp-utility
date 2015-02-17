var fs = require('fs');
var path = require('path');

write_file('library.js', {
  library: read_file('browser/library.js'),
  define: read_file('define.js')
});

write_file('node-library.js', {
  library: read_file('node/library.js'),
  define: read_file('define.js')
});

function read_file(file) {
  return fs.readFileSync(path.join(__dirname, 'src', file), 'utf8');
}

function write_file(file, data) {
  var txt = [
    '(function(global) {',
    '  "use strict";',
    '',
    '  var slice = Array.prototype.slice;',
    '',
    indent(data.library),
    '',
    indent(data.define),
    '',
    '  global.library = library;',
    '',
    '})(this);'
  ].join('\n');
  fs.writeFileSync(path.join(__dirname, 'dist', file), txt);
}

function indent(txt) {
  return txt.split(/\n/).map(function(line) {
    return '  ' + line;
  }).join('\n');
}
