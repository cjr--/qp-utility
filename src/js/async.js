function each_series(items, action, done) {
  var results = [ ];
  var next = function() {
    if (items.length) {
      action(items.shift(), function(error, result) {
        results.push(result);
        if (error) return done(error, results); else next();
      });
    } else {
      done(null, results);
    }
  };
  next();
}

function series(data, actions, done) {
  var args = slice.call(arguments);
  done = args.pop();
  actions = args.pop();
  data = args.pop() || {};

  var results = { };
  actions = get_async_actions(actions);
  var next = function() {
    var action = actions.shift();
    if (action) {
      action.fn(null, function(error, result) {
        results[action.name] = result;
        if (error) done(error, results); else next();
      });
    } else {
      done(null, results);
    }
  };
  next();
}

function parallel(data, actions, done) {
  var args = slice.call(arguments);
  done = args.pop();
  actions = args.pop();
  data = args.pop() || {};

  var results = { };
  actions = get_async_actions(actions);
  var action_count = actions.length;
  each(actions, function(action) {
    action.fn(data, function(error, result) {
      results[action.name] = result;
      if (error) {
        done(error, results);
      } else if (!--action_count) {
        done(null, results);
      }
    });
  });
}

function get_async_actions(o) {
  if (is(o, 'array')) {
    if (is(o[0], 'function')) {
      return qp.map(o, function(fn, index) { return { name: index, fn: fn }; });
    } else {
      return o;
    }
  } else if (is(o, 'object')) {
    return map(o, function(fn, name) { return { name: name, fn: fn }; });
  }
}
