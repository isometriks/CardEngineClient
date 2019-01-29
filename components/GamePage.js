import React, { Component } from 'react';

import api from '../shared/api';

class GamePage extends Component {
    constructor(props) {
      super(props);

      this.state = {
        user: JSON.parse(localStorage.getItem('user'))
      };

      this.setupWebSocket();
    }

    connectSocket () {
        this.props.wsApi.connect();
    }

    setupWebSocket () {
        console.log("setting up ws in game.", this.props);
        const { wsApi } = this.props;
        const self = this;

        const handlerMap = {
            'open': this.handleSocketConnect.bind(self),
            'message': this.handleSocketMessage.bind(self)
        }

        Object.keys(handlerMap).forEach(key => {
            wsApi.setHandler(key, handlerMap[key]);
        });

        if (!this.props.wsApi.isConnected()) {
            console.log("connecting ws...");
            this.connectSocket();
        }
    }

    handleSocketConnect (e) {
        console.log("game socket con: ", e);
    }

    handleSocketMessage (e) {
        console.log("game socket msg: ", e);
    }

    componentDidMount () {

    }

    logout () {
        localStorage.removeItem("user");
        this.setState({
            user: {}
        });

        this.props.history.push("/");
    }

    render () {
        return (
            <div className="game-wrapper">
                <h2>Game Lobby</h2>
            </div>
        )
    }
}

export default GamePage
