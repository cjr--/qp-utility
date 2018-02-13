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

    retry_interval: 2000,
    retry_count: 0,
    retry_max: Infinity,

    on_error: false,
    on_close: false,
    on_open: false,
    on_data: false,

    init: function(options) {
      if (this.protocols) this.json = qp.contains(this.protocols, 'json-message');
      if (this.auto) this.open();
    },

    open: function() {
      if (!this.websocket) this.connect();
    },

    connect: function() {
      this.websocket = new WebSocket((this.secure ? 'wss://' : 'ws://') + this.url, this.protocols);
      this.websocket.addEventListener('error', this.error_handler);
      this.websocket.addEventListener('close', this.close_handler);
      this.websocket.addEventListener('open', function(e) {
        this.retry_count = 0;
        if (this.on_open) this.on_open(e);
        if (this.on_data) {
          this.websocket.addEventListener('message', function(e) {
            var data = e.data;
            if (this.json) data = JSON.parse(data);
            log('MSG_IN', qp.stringify(data, true));
            if (this.on_data) this.on_data(data, e);
          }.bind(this));
        }
      }.bind(this));
    },

    reconnect: function(e) {
      if (this.retry_count++ < this.retry_max) {
        setTimeout(function() {
          if (this.on_reconnect) this.on_reconnect(e);
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
      if (this.auto && e && e.code === 'ECONNREFUSED') {
        this.reconnect();
      } else if (this.on_error) {
        this.on_error.call(this, e);
      }
    },

    close_handler: function(e) {
      if (this.auto && e.code === 1005) {
        this.reconnect();
      } else if (this.on_close) {
        this.on_close(this);
      }
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
