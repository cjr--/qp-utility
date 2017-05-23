/* eslint indent: 0 */

var fs = require('fs');
var uglify = require('uglify-js');
var path = require('path');
var definition = require('./definition');

var browser = definition('browser');
var node = definition('node');

write_file('index.js', make_node_file(node));
write_file('qp-utility.js', make_browser_file(browser));
write_file('qp-utility.min.js', make_min_file('qp-utility.js'));

function make_node_file(node) {
  return [
    '(function(global, undefined) {',
      '',
      indent(join_files(node.files.js, 'js')),
      '',
      indent(node.fns),
      '',
      '  if (global.define) global.define.make = make;',
      '  module.exports = qp;',
      '',
      '  global.debug = function() {',
      '    console.log.apply(console, ["\x1b[43m\x1b[30m:DEBUG:\x1b[0m\x1b[0m"].concat(slice.call(arguments)));',
      '  }',
      '',
    '})(global);'
  ].join('\n');
}

function make_browser_file(browser) {
  return [
    '(function(global, undefined) {',
      '',
      indent(join_files(browser.files.js, 'js')),
      '',
      indent(browser.fns),
      '',
      '  if (global.define) {',
      '    global.define.make = make;',
      '    global.module.require.cache["qp-utility"] = qp;',
      '  } else {',
      '    global.qp = qp;',
      '  }',
      '',
      '  global.debug = function() {',
      '    console.log.apply(console, ["%cDEBUG:", "color:black;background-color:yellow;"].concat(slice.call(arguments)));',
      '  }',
      '',
      '  global.global = global;',
      '',
      indent(join_files(browser.files.type_definitions, 'js')),
      '',
    '})(window);'
  ].join('\n');
}

function make_min_file(filename) {
  return uglify.minify(
    fs.readFileSync(path.join(__dirname, 'dist', filename), 'utf8'),
    { compress: { dead_code: false, unused: false } }
  ).code;
}

function join_files(files, ext) {
  return files.map(function(file) {
    return read_file(file + '.' + ext);
  }).join('\n');
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
