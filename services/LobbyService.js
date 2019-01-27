import React, { Component } from 'react';

class LobbyPage extends Component {
    constructor(props) {
      super(props);

      this.state = {
        isConnected: false,
        ws: null
      };
    }

    componentDidMount () {
        console.log("Lobby service mounted.");
    }

    render () {
        return <div />;
    }
}

export default LobbyPage
