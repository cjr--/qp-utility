function http_request(options, done) {
  options.done = options.done || done || noop;
  options.headers = options.headers || {};
  options.method = options.method || 'GET';
  options.data = options.data || null;

  var response = { ok: false };
  var construct_response = function(req, res) {
    res.status = req.status;
    res.data = res.text = req.responseText;
    req.getAllResponseHeaders().split('\r\n').forEach(function(header) {
      var h = header.split(':');
      if (h.length > 1) {
        res.headers = res.headers || {};
        res.headers[h[0].toLowerCase()] = h.slice(1).join(':').trim();
      }
    });
    res.json = res.headers['content-type'] === 'application/json';
    if (res.json) { res.data = JSON.parse(res.text); }
  };
  var request = new XMLHttpRequest();
  if (options.json) {
    options.method = 'POST';
    var json = JSON.stringify(options.json, null, '  ');
    if (json.length) {
      options.data = json;
    }
    options.headers['Content-Type'] = 'application/json';
  } else if (options.text) {
    options.method = 'POST';
    options.data = options.text;
    options.headers['Content-Type'] = 'text/plain';
  } else if (options.html) {
    options.method = 'GET';
    options.headers['Content-Type'] = 'text/html';
  }
  request.open(options.method.toUpperCase(), options.url, true);
  for (var name in options.headers) {
    request.setRequestHeader(name, options.headers[name]);
  }
  request.onload = function() {
    if (options.timeout_id) { clearTimeout(options.timeout_id); }
    construct_response(request, response);
    if (request.status >= 200 && request.status < 400) {
      response.ok = true;
      options.done.call(options.bind, null, response);
    } else {
      options.done.call(options.bind, response, null);
    }
  };
  request.onerror = function() {
    construct_response(request, response);
    options.done.call(options.bind, response, null);
  };
  if (options.timeout) {
    options.timeout_id = setTimeout(function() {
      response.timeout = true;
      request.abort();
    }, options.timeout);
  }
  request.send(options.data);
}
