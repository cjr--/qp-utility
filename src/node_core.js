var http = require('http');
var os = require('os');
var url = require('url');

function eol() {
  return os.EOL;
}

function get_locale() {
  return replace_all(before(process.env.LANG || process.env.LANGUAGE, '.'), '_', '-') || 'en-GB';
}
