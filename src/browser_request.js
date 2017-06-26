function http_request(options) {
  options.done = options.done || noop;
  options.headers = options.headers || {};
  options.method = options.method || 'GET';
  options.data = options.data || null;

  var response = { ok: false };
  var request = new XMLHttpRequest();
  if (options.with_credentials) request.withCredentials = true;

  if (options.json) {
    options.method = 'POST';
    var json = JSON.stringify(options.json, null, '  ');
    if (json.length) options.data = json;
    options.headers['Content-Type'] = 'application/json';
  } else if (options.text) {
    options.data = options.text;
    options.headers['Content-Type'] = 'text/plain';
  } else if (options.html) {
    options.headers['Content-Type'] = 'text/html';
    options.data = options.html;
  } else if (options.files) {
    options.method = 'POST';
    options.headers['Content-Type'] = 'multipart/form-data';
    var data = options.data = new FormData();
    for (var i = 0, l = options.files.length; i < l; i++) {
      var file = options.files[i];
      data.append('file' + i, file, file.name);
    }
  }
  options.method = upper(options.method);
  if (options.upload_progress) {
    request.upload.onprogress = function(e) {
      if (e.lengthComputable) options.upload_progress.call(options.bind, e, (e.loaded / e.total) * 100);
    };
  }
  if (options.download_progress) {
    request.onprogress = function(e) {
      if (e.lengthComputable) options.download_progress.call(options.bind, e, (e.loaded / e.total) * 100);
    };
  }
  request.open(options.method, options.url, true);
  set_request_headers(request, options.headers);
  request.onload = function() {
    if (options.timeout_id) { clearTimeout(options.timeout_id); }
    response.status = request.status;
    response.state = request.readyState;
    response.data = response.text = request.responseText;
    response.headers = get_response_headers(request);
    response.header = function(key, value) {
      var header = response.headers[key];
      if (arguments.length === 1) {
        return header[0];
      } else {
        return header && contains(header, value);
      }
    };
    if (response.header('content-type', 'application/json')) {
      response.data = JSON.parse(response.text);
    }
    if (request.status >= 200 && request.status < 400) {
      response.ok = true;
      options.done.call(options.bind, null, response);
    } else {
      options.done.call(options.bind, new Error(response.status), response);
    }
  };
  request.onerror = function(e) {
    options.done.call(options.bind, e, null);
  };
  if (options.timeout) {
    options.timeout_id = setTimeout(function() {
      response.timeout = true;
      request.abort();
    }, options.timeout);
  }
  request.send(options.data);
  return request;
}

function set_request_headers(http_request, headers) {
  for (var key in headers) {
    http_request.setRequestHeader(key, headers[key]);
  }
}

function get_response_headers(http_request) {
  var headers = { };
  http_request.getAllResponseHeaders().split('\r\n').forEach(function(header) {
    if (not_empty(clean_whitespace(header))) {
      var h = lower(header).split(': ');
      var v = h[1].split('; ');
      if (v.length === 1) {
        headers[h[0]] = [h[1]];
      } else {
        headers[h[0]] = v;
      }
    }
  });
  return headers;
}