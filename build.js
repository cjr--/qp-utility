var fs = require('fs');
var uglify = require('uglify-js');
var path = require('path');
var files = [
  'core', 'string', 'array', 'collection', 'date', 'function', 'iteration', 'assign', 'typeof',
  'clone', 'copy', 'equals', 'extend', 'merge', 'ns', 'options', 'override', 'pick',
  'async', 'find', 'id', 'make', 'sort',
  'qp'
];

var file = files.map(function(_file) {
  return read_file(_file + '.js');
}).join('\n');

write_file('index.js', make_node_file(file));
write_file('qp-utility.js', make_browser_file(file));
write_file('qp-utility.min.js', make_min_file('qp-utility.js'));

function make_browser_file(file) {
  return [
    '(function(global) {',
      indent(file),
      indent('global.qp = qp;'),
      '',
    '})(this);'
  ].join('\n');
}

function make_node_file(file) {
  return [
    file,
    'module.exports = qp;'
  ].join('\n');
}

function make_min_file(filename) {
  var min = uglify.minify(path.join('dist', filename), { compress: { dead_code: false, unused: false } });
  return min.code;
}

function read_file(file) {
  return fs.readFileSync(path.join(__dirname, 'src', file), 'utf8');
}

function write_file(file, data) {
  return fs.writeFileSync(path.join(__dirname, 'dist', file), data);
}

function indent(txt) {
  return txt.split(/\n/).map(function(line) {
    return '  ' + line;
  }).join('\n');
}
