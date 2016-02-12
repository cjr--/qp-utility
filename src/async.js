function series() {
  var args = slice.call(arguments);
  var data = args[2] ? args[0] : null;
  var actions = args[2] ? args[1] : args[0];
  var done = args[2] ? args[2] : args[1];
  var results = {};
  function next() {
    var action = actions.shift();
    if (action) {
      action[1](data, function(error, result) {
        results[action[0]] = result;
        if (error) {
          done(error, results);
        } else {
          next();
        }
      });
    } else {
      done(null, results);
    }
  }
  next();
}

function parallel() {
  var args = slice.call(arguments);
  var data = args[2] ? args[0] : null;
  var actions = args[2] ? args[1] : args[0];
  var done = args[2] ? args[2] : args[1];
  var errors = null;
  var results = {};
  var remaining = size(actions) - 1;
  each(actions, function(action, key) {
    action(data, function(error, result) {
      if (error) {
        errors = errors || {};
        errors[key] = error;
      }
      results[key] = result;
      remaining--;
      if (!remaining) {
        done(errors, results);
      }
    });
  });
}
