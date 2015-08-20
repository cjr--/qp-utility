var fs = require('fs');
var uglify = require('uglify-js');
var path = require('path');

var common_files = [
  'core', 'string', 'array', 'collection', 'date', 'function', 'iteration', 'assign', 'typeof',
  'clone', 'copy', 'equals', 'extend', 'merge', 'ns', 'options', 'override', 'pick',
  'async', 'find', 'id', 'make', 'sort', 'math'
];

var node_files = [ 'node' ];
var browser_files = [ 'request', 'browser', 'dom', 'animate', 'selector' ];

console.log('');
write_file('index.js', make_file(common_files.concat(node_files)));
write_file('qp-utility.js', make_file(common_files.concat(browser_files)));
write_file('qp-utility.min.js', make_min_file('qp-utility.js'));
console.log('');

function make_file(files) {
  var file = files.map(function(_file) {
    return read_file(_file + '.js');
  }).join('\n');

  return [
    '(function(global) {',
      indent(file),
      '',
      '  if (global.define) global.define.make = qp.make;',
      '  if (global.module && global.module.exports) {',
      '    global.module.exports = qp;',
      '  } else {',
      '    global.qp = qp;',
      '    console.clear();',
      '  }',
      '',
    '})(this);'
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
