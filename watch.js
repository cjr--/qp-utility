require('qp-define');

define(module, function(exports, require) {

  var path = require('path');
  var cp = require('child_process');
  var watch = require('node-watch');
  var log = require('qp-library/log');
  var exit = require('qp-library/exit');
  var term = require('qp-library/term');

  term.set_title('build @ qp-utility');
  term.keypress((key) => {
    if (key === 'b') build();
    else if (key === 'esc') exit_process();
  });
  log.clear();
  log(log.blue_white(' qp-utility '));

  var watcher = watch([
    path.join(process.cwd(), 'src')
  ]);

  watcher.on('change', file => {
    if (/\.(js|css)$/.test(file)) build();
  });

  function build() {
    cp.execFile('node', ['build'], (ex, out, err) => log(out));
  }

  function exit_process() {
    watcher.close();
    process.exit(0);
  }

});
