function series() {
  var data = arguments[2] ? arguments[0] : null;
  var actions = arguments[2] ? arguments[1] : arguments[0];
  var done = arguments[2] ? arguments[2] : arguments[1];
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
  var data = arguments[2] ? arguments[0] : null;
  var actions = arguments[2] ? arguments[1] : arguments[0];
  var done = arguments[2] ? arguments[2] : arguments[1];
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
