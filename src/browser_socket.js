define(module, function(exports, require) {

  var qp = require('qp-utility');

  qp.make(exports, {

    ns: 'qp-utility/websocket',

    websocket: null,

    url: '',
    auto: true,
    secure: false,
    protocols: null,
    json: false,

    retry_id: 0,
    retry_interval: 5000,
    retry_count: 0,
    retry_max: Infinity,

    on_error: false,
    on_close: false,
    on_open: false,
    on_data: false,
    on_reconnect: false,
    on_reconnect_failed: false,

    init: function(options) {
      if (this.protocols) this.json = qp.contains(this.protocols, 'json-message');
      if (this.auto) this.open();
    },

    open: function() {
      if (!this.websocket) this.connect();
    },

    connect: function() {
      if (this.websocket) this.websocket.close();
      this.websocket = new WebSocket((this.secure ? 'wss://' : 'ws://') + this.url, this.protocols);
      this.websocket.addEventListener('error', this.error_handler.bind(this));
      this.websocket.addEventListener('close', this.close_handler.bind(this));
      this.websocket.addEventListener('open', function(e) {
        this.retry_count = 0;
        clearTimeout(this.rety_id);
        log('CONNECT', this.url);
        if (this.on_open) this.on_open(this, e);
        if (this.on_data) {
          this.websocket.addEventListener('message', function(e) {
            var data = e.data;
            if (this.json) data = JSON.parse(data);
            log('MSG_IN', qp.stringify(data, true));
            if (this.on_data) this.on_data(data, this, e);
          }.bind(this));
        }
      }.bind(this));
    },

    reconnect: function() {
      if (this.retry_count++ < this.retry_max) {
        this.retry_id = setTimeout(function() {
          log('RECONNECT', this.url);
          if (this.on_reconnect) this.on_reconnect(this);
          this.connect();
        }.bind(this), this.retry_interval);
      } else if (this.on_reconnect_failed) {
        this.on_reconnect_failed(this);
      }
    },

    retry: function() {
      this.retry_count = 0;
      this.reconnect();
    },

    error_handler: function(e) {
      if (this.on_error) this.on_error(this, e);
      this.close();
      if (this.auto && e && (e.code === 'ECONNREFUSED' || e.code === 'ERR_CONNECTION_REFUSED')) this.reconnect();
    },

    close_handler: function(e) {
      if (this.auto && e && (e.code === 1005 || e.code === 1006)) this.reconnect();
      if (this.on_close) this.on_close(this, e);
    },

    send: function(data) {
      if (this.is_state('OPEN')) {
        log('MSG_OUT', qp.stringify(data, true));
        if (this.json) data = JSON.stringify(data);
        this.websocket.send(data);
      }
    },

    close: function() {
      if (this.is_state('OPEN')) {
        this.websocket.close();
        this.websocket = null;
      }
    },

    is_state: function(state) {
      return this.websocket && this.websocket.readyState === this.websocket[state];
    }

  });

});
