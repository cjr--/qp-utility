var fs = require('fs');
var uglify = require('uglify-js');
var CleanCSS = require('clean-css');
var path = require('path');
var definition = require('./definition');

var browser_def = definition('browser');

console.log('');
write_file('index.js', make_file(definition('node')));
write_file('qp-utility.js', make_file(browser_def));
write_file('qp-utility.min.js', make_min_file('qp-utility.js'));
write_file('qp-utility.css', join_files(browser_def.files.css, 'css'));
write_file('qp-utility.min.css', make_min_file('qp-utility.css'));
console.log('');

function make_file(def) {
  return [
    '(function(global, undefined) {',
      '',
      indent(join_files(def.files.js, 'js')),
      '',
      indent(def.fns),
      '',
      '  if (global.define) global.define.make = make;',
      '  if (module && module.exports) {',
      '    module.exports = qp;',
      '  } else {',
      '    global.qp = qp;',
      '  }',
      '',
    '})(typeof global === "object" ? global : window);'
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
