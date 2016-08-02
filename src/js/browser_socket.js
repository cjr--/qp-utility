define(module, function(exports, require, make) {

  var qp = require('qp-utility');

  make({

    ns: 'qp-utility/websocket',

    websocket: null,
    secure: false,
    auto: true,

    url: '',
    protocols: null,
    on_error: false,
    on_close: false,
    on_open: false,
    message: false,
    json: false,

    init: function(options) {
      if (this.auto) this.open();
    },

    open: function() {
      if (!this.websocket) {
        var websocket = this.websocket = new WebSocket((this.secure ? 'wss://' : 'ws://') + this.url, this.protocols);
        if (this.on_error) websocket.addEventListener('error', this.on_error.bind(this));
        if (this.on_close) websocket.addEventListener('close', this.on_close.bind(this));
        if (this.protocols) {
          this.json = qp.contains(this.protocols, 'json-message');
        }
        websocket.addEventListener('open', function(e) {
          if (this.on_open) this.on_open(e);
          if (this.message) {
            websocket.addEventListener('message', function(e) {
              var data = e.data;
              if (this.json) data = JSON.parse(data);
              log('MSG_IN', qp.stringify(data, true));
              if (this.message) this.message(data, e);
            }.bind(this));
          }
        }.bind(this));
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
