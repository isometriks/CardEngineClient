import React, { Component } from 'react';

import api from '../shared/api';
import SocketAPI from '../shared/SocketAPI';

import MenuBar from './MenuBar';
import GameBoard from './GameBoard';

class GamePage extends Component {
    constructor(props) {
      super(props);

      this.state = {
        user: JSON.parse(localStorage.getItem('user')),
        connected: this.props.wsApi.isConnected(),
        shouldTryRejoin: false,
        isMatchOver: false,
        gameListener: null,
        gameApi: {
            listen: (cb) => {
                this.state.gameListener = cb;
            },
            playCard: (card) => {
                console.log("playing card: ", card); 
                const { wsApi, matchApi } = this.props;
                const { matchId } = matchApi.get();
                const { value, suitName } = card;

                wsApi.send("card.play", {
                    matchId: matchId,
                    card: value,
                    suit: suitName
                });
            },
            placeBid: (bid) => {
                const { wsApi, matchApi } = this.props;
                const { matchId } = matchApi.get();

                console.log("placing bid: ", bid);
                wsApi.send("bid.place", {
                    matchId: matchId,
                    bid: bid
                });
            },
            pickSuit: (suit) => {
                const { wsApi, matchApi } = this.props;
                const { matchId } = matchApi.get();

                console.log("picked suit: ", suit);
                wsApi.send("bid.trump", {
                    matchId: matchId,
                    suit: suit
                });
            },
            sendEvent: (e, data) => {
                const { gameListener } = this.state;

                if (!gameListener) {
                    console.error("Must setup game listener before sending events.");
                    return;
                }

                console.log("sending event: ", e, data);
                gameListener(e, data);
            }
        }
      };
    }

    componentDidMount () {
        const match = this.props.matchApi.get();
        const { empty } = match;

        if (empty) {
            console.log("no match set, moving to lobby.");
            this.props.history.push("/lobby");
        }

        this.setupWebSocket();
    }

    connectSocket () {
        this.props.wsApi.connect();
    }

    setupWebSocket () {
        const { wsApi } = this.props;
        const self = this;

        const handlerMap = {
            'open': this.handleSocketConnect.bind(self),
            'close': this.handleSocketClose.bind(self),
            'message': this.handleSocketMessage.bind(self),
            'error': this.handleSocketError.bind(self)
        }

        Object.keys(handlerMap).forEach(key => {
            wsApi.setHandler(key, handlerMap[key]);
        });
    }

    handleSocketConnect (e) {
        this.setState({
            connected: true
        });
    }

    handleSocketClose (e) {
        const { code } = e;

        // 3403 happens when socket is refused
        if (code === 3403) {

            this.setGameAbandoned(e);
            return;  
        }

        this.setState({
            connected: false
        });
    }

    handleSocketMessage (e) {
        const { key, cmd, message } = SocketAPI.parseMessage(e);
        console.log("game.ws message: ", key, cmd, message);

        switch (key) {
            case "table":
                this.handleTableMessage(cmd, message);
            break;

            case "player":
                this.handlePlayerMessage(cmd, message);
            break;
        }
    }

    handleSocketError (e) {
        console.log("game.ws error: ", e);
    }

    handlePlayerMessage (cmd, message) {
        console.log("Game.Player ws msg: ", cmd, message);

        switch (cmd) {
            case "update":
                console.log("got player update: ", message);

                this.props.playerApi.set(message);
            break;
        }
    }

    handleTableMessage (cmd, message) {
        const { gameApi } = this.state;
        console.log("Game.Table ws msg: ", cmd, message);

        switch (cmd) {
            case "update":
                const { gameStarted } = message;

                this.props.matchApi.set(message);
                gameApi.sendEvent("tableUpdate");
            break;

            case "endEvent":
                this.handleEndEvent(message);
            break;
        }
    }

    handleEndEvent (e) {
        const { eventType, results } = e;

        switch (eventType) {
            case "matchAbandoned":
                this.setGameAbandoned();
            break;
            case "trickEnd":
                this.setTrickEnded(results);
            break;
            case "roundEnd":
                this.setRoundEnded(results);
            break;
            case "matchEnd":
                this.setMatchEnded(results);
            break;
        }
    }

    setMatchEnded (results) {
        const { gameApi } = this.state;

        gameApi.sendEvent("matchEnd", results);
    }

    setRoundEnded (results) {
        const { gameApi } = this.state;

        gameApi.sendEvent("roundEnd", results);
    }

    setTrickEnded (results) {
        const { gameApi } = this.state;

        gameApi.sendEvent("trickEnd", results);
    }

    setGameAbandoned () {
        const { gameApi } = this.state;

        this.setState({
            isMatchOver: true
        });

        gameApi.sendEvent("matchAbandoned");
    }

    logout () {
        localStorage.removeItem("user");
        this.setState({
            user: {}
        });
        this.props.history.push("/");
    }

    abandonMatch () {
        const match = this.props.matchApi.get();
        const { matchId } = match;

        console.log("abandon match...", match);

        if (this.state.connected) {
            this.props.wsApi.send("game.abandon", { matchId: matchId });
        }
    }

    backToLobby () {
        this.props.history.push("/lobby");
    }

    renderControls (){
        return (
            <div className="game-controls">
                <div className="control-item">
                    <button 
                      disabled={this.state.isMatchOver}
                      onClick={() => { this.abandonMatch() }}
                    >abandon match</button>
                </div>

                <div className="control-item">
                    <button
                      disabled={!this.state.isMatchOver}
                      onClick={() => { this.backToLobby() }}
                    >back to lobby</button>
                </div>
            </div>
        )
    }

    render () {
        const { 
            user,
            isMatchOver,
            connected,
            gameApi
        } = this.state;

        const {
            matchApi,
            playerApi,
            wsApi
        } = this.props;

        const boardStatusClass = isMatchOver ? "disabled" : "";

        return (
            <div className="game-wrapper">
                <MenuBar user={user} wsApi={wsApi} />

                <div className="game-content">
                    <GameBoard
                      matchApi={matchApi}
                      playerApi={playerApi}
                      gameApi={gameApi} />
                    
                    { this.renderControls() }
                </div>
            </div>
        )
    }
}

export default GamePage
