require('qp-define');

define(module, function(exports, require) {

  var path = require('path');
  var cp = require('child_process');
  var watch = require('node-watch');
  var log = require('qp-library/log');
  var exit = require('qp-library/exit');
  var term = require('qp-library/term');

  term.set_title('build @ qp-utility');
  log.clear();
  log(log.blue_white(' qp-utility '));

  var watcher = watch([
    path.join(process.cwd(), 'src')
  ]);

  watcher.on('change', file => {
    if (/\.(js|css)$/.test(file)) {
      cp.execFile('node', ['build'], (error, stdout, stderr) => {
        console.log(stdout);
      });
    }
  });


});
