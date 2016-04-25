var fs = require('fs');
var uglify = require('uglify-js');
var CleanCSS = require('clean-css');
var path = require('path');
var definition = require('./definition');

var browser = definition('browser');
var node = definition('node');

console.log('');
write_file('index.js', make_node_file(node));
write_file('qp-utility.js', make_browser_file(browser));
write_file('qp-utility.min.js', make_min_file('qp-utility.js'));
write_file('qp-utility.css', join_files(browser.files.css, 'css'));
write_file('qp-utility.min.css', make_min_file('qp-utility.css'));
console.log('');

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
    '})(window);'
  ].join('\n');
}

function make_min_file(filename) {
  var ext = path.extname(filename);
  if (ext === '.js') {
    var min = uglify.minify(path.join('dist', filename), { compress: { dead_code: false, unused: false } });
    return min.code;
  } else if (ext === '.css') {
    var css = fs.readFileSync(path.join(__dirname, 'dist', filename), 'utf8');
    return new CleanCSS().minify(css).styles;
  }
  return '';
}

function join_files(files, ext) {
  return files.map(function(file) {
    return read_file(file + '.' + ext, ext);
  }).join('\n');
}

function read_file(file, type) {
  return fs.readFileSync(path.join(__dirname, 'src', type, file), 'utf8');
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
