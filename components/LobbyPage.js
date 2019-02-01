import React, { Component } from 'react';
import api from '../shared/api';
import SocketAPI from '../shared/SocketAPI';

import MenuBar from './MenuBar';

import LobbyTable from './LobbyTable';
import LobbyTableList from './LobbyTableList';

class LobbyPage extends Component {
    constructor(props) {
      super(props);
        const self = this;

        this.state = {
            user: JSON.parse(localStorage.getItem('user')),
            finishedLoading: false,
            atTable: false,
            hasCurrentTable: false,
            connected: false,
            shouldSeatPlayer: false,
            canReconnect: false,
            table: {},
            match: {},
            tables: [],

            lobbyApi: (method, data) => {
                return this[method](data);
            }
        };

        this.setupWebSocket();
    }

    componentDidMount () {
        this.runTableCheck();
    }

    connectSocket () {
        this.props.wsApi.connect();
    }

    setupWebSocket () {
        console.log("setting up ws in lobby.", this.props);
        const { wsApi } = this.props;
        const self = this;

        const handlerMap = {
            'open': this.handleSocketConnect.bind(self),
            'close': this.handleSocketClose.bind(self),
            'message': this.handleSocketMessage.bind(self)
        }

        Object.keys(handlerMap).forEach(key => {
            wsApi.setHandler(key, handlerMap[key]);
        });
    }

    handleSocketConnect (e) {
        const { shouldSeatPlayer, canReconnect } = this.state;
        
        if (shouldSeatPlayer) {
            const { matchId } = this.state.match;
            const gameCmd = canReconnect ? "game.reconnect" : "game.join";

            console.log(`sending ${gameCmd} to table`);
            this.props.wsApi.send(gameCmd, { matchId: matchId });

            this.setState({
                shouldSeatPlayer: false
            });
        }

        this.setState({
            connected: true
        });
    }

    handleSocketClose (e) {
        console.log("ws close: ", e);
        const { code } = e;

        if (code === 1008) {
            console.log("Unauthorized ws in lobby.");
        }
    }

    handleSocketMessage (e) {
        const { key, cmd, message } = SocketAPI.parseMessage(e);
        console.log("Got lobby message: ", key, cmd, message);

        switch (key) {
            case "table":
                this.handleTableMessage(cmd, message);
            break;


            case "player":
                this.handlePlayerMessage(cmd, message);
            break;
        }
    }

    handlePlayerMessage (cmd, message) {
        console.log("Player ws msg: ", cmd, message);

        switch (cmd) {
            case "update":
                console.log("got player update: ", message);

                this.setState({
                    player: message
                });

                this.props.playerApi.set(message);
            break;
        }
    }

    handleTableMessage (cmd, message) {
        console.log("Table ws msg: ", cmd, message);

        switch (cmd) {
            case "update":
                const { gameStarted } = message;

                if (gameStarted) {
                    console.log("Table sent update that game started?");
                    this.moveToGame(message);

                    return;
                }

                this.setState({
                    match: message
                });
            break;
        }
    }

    runTableCheck () {
        api.tableCheck()
            .then(res => {
                const { data } = res;

                if (data) {
                    const { gameStarted } = data;

                    if (gameStarted) {
                        this.setState({
                            canReconnect: true
                        });
                    }

                    this.setCurrentTable(data);
                    this.joinMatch(data);
                } else {
                    this.listTables();
                }
            });
    }

    listTables () {
        this.setState({
            tables: []
        });

        api.tables()
            .then(res => {
                const { data } = res;

                this.setState({
                    finishedLoading: true,
                    tables: data
                });
            });
    }

    logout () {
        localStorage.removeItem("user");
        this.setState({
            user: {}
        });

        this.props.history.push("/");
    }

    sitAtTable () {
        console.log("joining table: ", table);
    }

    setCurrentTable (table) {
        this.setState({
            finishedLoading: true,
            hasCurrentTable: true,
            table: table
        });
    }

    joinMatch (table) {
        api.joinMatch({
            gameName: table.gameName,
            tableId: table.tableId
        }).then(res => {
            const { data } = res;

            console.log("join match worked: ", data);

            this.setState({
                table: table,
                match: data,
                hasCurrentTable: true,
                shouldSeatPlayer: true,
                inMatch: true
            });

            this.connectSocket();
        }).catch(error => {
            console.log("join err: ", error);
        });
    }

    leaveMatch () {
        const { table } = this.state;
        console.log("table: ", table);

        api.leaveMatch({
            gameName: table.gameName,
            tableId: table.tableId
        }).then(res => {
            this.setState({
                table: {},
                match: {},
                hasCurrentTable: false,
                inMatch: false
            });

            this.listTables();
        }).catch(error => {
            console.log("leave err: ", error);
        });
    }

    abandonMatch () {
        const { table } = this.state;

        api.abandonMatch({
            gameName: table.gameName,
            tableId: table.tableId
        }).then(res => {
            console.log("abandon res: ", res);

            this.setState({
                table: {},
                match: {},
                hasCurrentTable: false,
                inMatch: false
            });

            this.listTables();
        }).catch(error => {
            console.log("abandon err: ", error);
        });
    }

    readyMatch () {
        const { matchId } = this.state.match;

        console.log("Readying match: ", matchId);
        this.props.wsApi.send("game.ready", { matchId: matchId });
    }

    moveToGame (match) {
        console.log("============================================");
        this.props.matchApi.set(match);
        this.props.history.push("/game");
    }

    renderLobby () {
        const { 
            inMatch,
            canReconnect,
            tables,
            table,
            match,
            lobbyApi
        } = this.state;

        if (this.state.hasCurrentTable) {
            return (
                <LobbyTable
                  lobbyApi={lobbyApi}
                  table={table} 
                  match={match}
                  inMatch={inMatch}
                  canReconnect={canReconnect} />
            )
        } else {
            return (
                <LobbyTableList tables={tables} lobbyApi={lobbyApi} />
            )
        }
    }

    render () {
        const { 
            user, 
            tables, 
            inMatch, 
            finishedLoading
        } = this.state;

        const { wsApi } = this.props;

        return (
            <div className="home-wrapper">
                <MenuBar user={user} wsApi={wsApi} />
                
                <div className="lobby-wrapper">
                    { finishedLoading ? 
                        this.renderLobby() : <div>Loading...</div> }
                </div>
            </div>
        )
    }
}

export default LobbyPage
