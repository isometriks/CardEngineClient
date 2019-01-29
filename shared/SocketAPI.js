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
    console.log("connecting to ws api", this.handlers);
    const self = this;

    let ws =  new WebSocket(config.wsHost);

    this.handlerList.forEach(which => {
      ws[`on${which}`] = self.handlers[which];
    });

    this.ws = ws;
  }

  isConnected () {
    return !!this.ws;
  }

  setHandler (which, handler) {
    this.handlers[which] = handler;
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
