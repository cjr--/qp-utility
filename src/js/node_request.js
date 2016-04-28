function http_request(options) {
  options.done = options.done || noop;
  if (options.bind) options.done.bind(options.bind);
  options.headers = options.headers || {};
  options.method = options.method || 'GET';
  options.data = options.data || null;

  var response = { ok: false };
  var request = {
    method: options.method || 'GET',
    headers: options.headers || {},
    data: options.data || null
  };
  if (options.json) {
    request.method = 'POST';
    var json = JSON.stringify(options.json, null, '  ');
    if (json.length) request.data = json;
    request.headers['Content-Type'] = 'application/json';
  } else if (options.text) {
    request.method = 'POST';
    request.data = options.text;
    request.headers['Content-Type'] = 'text/plain';
  } else if (options.html) {
    request.method = 'GET';
    request.headers['Content-Type'] = 'text/html';
    request.data = options.html;
  } else {
    request.method = request.method.toUpperCase();
  }
  var http_request = http.request(request, function(http_response) {
    http_response.setEncoding('utf8');
    response.headers = http_response.headers;
    response.status = http_response.statusCode;
    if (response.status >= 200 && response.status < 400) {
      response.ok = true;
      response.text = null;
      http_response.on('data', function(data) { response.text += data; });
      http_response.on('end', function() {
        if (response.headers['content-type'] === 'application/json') {
          try {
            response.data = JSON.parse(response.text);
          } catch (e) {
            return options.done(e);
          }
        }
        options.done(null, response);
      });
    } else {
      options.done({
        status: response.status
      }, null);
    }
  });
  http_request.on('error', options.done);
  if (options.method === 'POST' && options.data) {
    http_request.write(options.data);
  }
  http_request.end();
}
