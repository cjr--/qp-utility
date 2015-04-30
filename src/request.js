function http_request(options) {
  options.done = options.done || noop;
  options.headers = options.headers || {};
  options.method = options.method || 'GET';
  options.data = options.data || null;

  var response = { ok: false };
  var construct_response = function(req, res) {
    res.status = req.status;
    if (options.json) { res.data = JSON.parse(req.responseText); }
    else if (options.html) { res.data = req.responseText; }
    else { res.data = req.responseText; }
  };
  var request = new XMLHttpRequest();
  if (options.json) {
    options.method = 'POST';
    var json = JSON.stringify(options.json);
    if (json.length) {
      options.data = json;
    }
    options.headers['content-type'] = 'application/json';
  } else if (options.html) {
    options.method = 'GET';
    options.headers['content-type'] = 'text/html';
  }
  for (var name in options.headers) {
    request.setRequestHeader(name.toLowerCase(), options.headers[name]);
  }
  request.open(options.method.toUpperCase(), options.url, true);
  request.onload = function() {
    if (options.timeout_id) { clearTimeout(options.timeout_id); }
    construct_response(request, response);
    if (request.status >= 200 && request.status < 400) {
      response.ok = true;
      request.getAllResponseHeaders().split('\r\n').forEach(function(header) {
        var h = header.split(':');
        if (h.length > 1) {
          response.headers = response.headers || {};
          response.headers[h[0].toLowerCase()] = h.slice(1).join(':').trim();
        }
      });
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
