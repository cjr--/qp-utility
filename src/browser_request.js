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
  request.open(options.method, options.url, true);
  set_request_headers(request, options.headers);

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
  if (options.timeout) {
    request.timeout = options.timeout;
    request.ontimeout = function(e) {
      var error = new Error('Request Timed Out');
      error.timeout = true;
      if (options.on_timeout) options.on_timeout.call(options.bind, error);
      options.done.call(options.bind, error, {});
    };
  }
  request.onabort = function() {
    var error;
    if (request.user_cancelled) {
      error = new Error('Request Cancelled');
      error.cancelled = true;
    } else if (request.user_timeout) {
      error = new Error('Request Timeout');
      error.timeout = true;
    } else {
      error = new Error('Request Aborted');
    }
    error.abort = true;
    if (options.on_abort) options.on_abort.call(options.bind, error);
    options.done.call(options.bind, error, {});
  };
  request.onerror = function(error) {
    if (error.type === 'error' && error.target && error.target.status === 0) {
      error = new Error('Request Timed Out');
      error.timeout = true;
    }
    options.done.call(options.bind, error, {});
  };

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
      response.result = response.data;
    }
    if (request.status >= 200 && request.status < 400) {
      response.ok = true;
      options.done.call(options.bind, null, response);
    } else {
      options.done.call(options.bind, new Error(response.status), response);
    }
  };
  request.send(options.data);
  return request;
}

function set_request_headers(http_request, headers) {
  each_own(headers, function(header, key) {
    http_request.setRequestHeader(key, header);
  });
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
