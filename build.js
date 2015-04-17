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

console.log('');
write_file('index.js', make_node_file(file));
write_file('qp-utility.js', make_browser_file(file));
write_file('qp-utility.min.js', make_min_file('qp-utility.js'));
console.log('');

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
  var filename = path.join(__dirname, 'dist', file);
  fs.writeFileSync(filename, data);
  var stat = fs.statSync(filename);
  console.log(rpad(file, 20), Math.round(stat.size / 1000), ' kb');
}

function indent(txt) {
  return txt.split(/\n/).map(function(line) {
    return '  ' + line;
  }).join('\n');
}

function rpad(s, width) {
  while (s.length < width) {
    s = s + ' ';
  }
  return s;
}
