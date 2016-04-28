function http_request(options) {
  options.done = options.done || noop;
  if (options.bind) options.done.bind(options.bind);
  options.headers = options.headers || {};
  options.method = options.method.toUpperCase() || 'GET';
  options.data = options.data || null;

  var response = { ok: false };
  var request = new XMLHttpRequest();

  if (options.json) {
    options.method = 'POST';
    var json = JSON.stringify(options.json, null, '  ');
    if (json.length) options.data = json;
    options.headers['Content-Type'] = 'application/json';
  } else if (options.text) {
    options.method = 'POST';
    options.data = options.text;
    options.headers['Content-Type'] = 'text/plain';
  } else if (options.html) {
    options.method = 'GET';
    options.headers['Content-Type'] = 'text/html';
    options.data = options.html;
  }
  request.open(options.method, options.url, true);
  set_request_headers(request, options.headers);
  request.onload = function() {
    if (options.timeout_id) { clearTimeout(options.timeout_id); }
    response.status = request.status;
    response.data = response.text = request.responseText;
    response.headers = get_response_headers(request);
    if (response.headers['content-type'] === 'application/json') { 
      response.data = JSON.parse(response.text);
    }
    if (request.status >= 200 && request.status < 400) {
      response.ok = true;
      options.done(null, response);
    } else {
      options.done(response, null);
    }
  };
  request.onerror = function(e) {
    options.done(e, null);
  };
  if (options.timeout) {
    options.timeout_id = setTimeout(function() {
      response.timeout = true;
      request.abort();
    }, options.timeout);
  }
  request.send(options.data);
}

function set_request_headers(http_request, headers) {
  for (var key in headers) {
    http_request.setRequestHeader(key, headers[key]);
  }
}

function get_response_headers(http_request) {
  var headers = { };
  http_request.getAllResponseHeaders().split('\r\n').forEach(function(header) {
    var h = header.split(':');
    if (h.length > 1) headers[h[0].toLowerCase()] = h.slice(1).join(':').trim();
  });
  return headers;
}
