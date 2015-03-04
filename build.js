var fs = require('fs');
var uglify = require('uglify-js');
var path = require('path');

var data = {
  core: read_file('core.js'),
  string: read_file('string.js'),
  qp: read_file('qp.js')
};

write_file('index.js', make_node_file(data));
write_file('qp-utility.js', make_browser_file(data));
write_file('qp-utility.min.js', uglify.minify(path.join(__dirname, 'dist', 'qp-utility.js')).code);

function make_browser_file(data) {
  return [
    '(function(global) {',
      indent(data.core),
      indent(data.string),
      indent(data.qp),
      indent('global.qp = qp;'),
    '})(this);'
  ].join('\n');
}

function make_node_file(data) {
  return [
    data.core,
    data.string,
    data.qp,
    'module.exports = qp;'
  ].join('\n');
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
