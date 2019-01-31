import config from '../shared/config'

class SocketAPI {
  constructor () {
    this.ws = null;

    this.handlerList = [
      'open',
      'close',
      'message',
      'error'
    ];

    this.handlers = this.handlerList.reduce((acc, which) => {
      acc[which] = (e) => { console.log("ws debug: ", which, e); return e; };

      return acc;
    }, {});
  }

  static parseMessage (e) {
    const { data } = e;
    const message = JSON.parse(data);

    const parts = message.key.split(".");

    return {
      key: parts[0],
      cmd: parts[1],
      message: message.data
    };
  }

  connect () {
    const self = this;

    let ws =  new WebSocket(config.wsHost);

    this.handlerList.forEach(which => {
      ws[`on${which}`] = self.handlers[which];
    });

    this.ws = ws;
  }

  isConnected () {
    if (!this.ws) {
      return false;
    }

    return this.ws.readyState > 0;
  }

  setHandler (which, handler) {
    const { ws } = this;
    
    this.handlers[which] = handler;

    if (ws) {
      ws[`on${which}`] = this.handlers[which];
    }
  }

  send (key, data) {
    var message = {
        key: key,
        data: data
    };

    var payload = JSON.stringify(message);

    this.ws.send(payload);
  }
}

export default SocketAPI
