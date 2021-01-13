function http_request(options) {
  options.url = url.parse(options.url);
  options.done = options.done || noop;
  if (options.bind) options.done.bind(options.bind);
  options.headers = options.headers || {};
  options.method = options.method || 'GET';
  options.data = options.data || null;

  var response = { ok: false };
  var request = {
    method: options.method || 'GET',
    hostname: options.url.hostname,
    port: options.url.port,
    path: options.url.path,
    headers: options.headers || {},
    data: options.data || null
  };
  if (options.json) {
    request.method = 'POST';
    var json = JSON.stringify(options.json, null, '  ');
    if (json.length) request.data = json;
    request.headers['Content-Type'] = 'application/json; charset=utf-8';
  } else if (options.text) {
    request.method = 'POST';
    request.data = options.text;
    request.headers['Content-Type'] = 'text/plain; charset=utf-8';
  } else if (options.html) {
    request.method = 'GET';
    request.headers['Content-Type'] = 'text/html; charset=utf-8';
    request.data = options.html;
  } else {
    request.method = request.method.toUpperCase();
  }

  request.headers['Content-Length'] = Buffer.byteLength(request.data || '');
  request.headers['User-Agent'] = `nodejs/${process.version} (${process.arch} ${process.platform} v8/${process.versions.v8})`;

  var http_request = http.request(request, function(http_response) {
    http_response.setEncoding('utf8');
    response.headers = http_response.headers;
    response.status = http_response.statusCode;
    response.content_type = response.headers['content-type'];
    response.json = /^application\/json/.test(response.content_type);
    response.text = '';
    http_response.on('data', (chunk) => response.text += chunk);
    http_response.on('end', () => {
      if (response.json) {
        try {
          response.data = JSON.parse(trim(response.text));
          response.result = response.data;
        } catch (error) {
          return options.done(error, response);
        }
      }
      if (response.status >= 200 && response.status < 400) {
        response.ok = true;
        options.done(null, response);
      } else {
        response.ok = false;
        options.done({ status: response.status }, response);
      }
    });
  });
  http_request.on('error', (error) => options.done(error, {}));
  if (request.method === 'POST' && request.data) {
    http_request.write(request.data);
  }
  http_request.end();
}
