import React, { Component } from 'react';
import api from '../shared/api';
import SocketAPI from '../shared/SocketAPI';

class LobbyPage extends Component {
    constructor(props) {
      super(props);
        console.log("props: ", props);

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
            tables: []
        };

        this.setupWebSocket();
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

    componentDidMount () {
        this.runTableCheck();
    }

    runTableCheck () {
        api.tableCheck()
            .then(res => {
                const { data } = res;
                console.log("Table Check: ", data);

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

    renderTableList () {
        const { tables } = this.state;

        return (
            <div className="table-list">
                <h3>Games:</h3>
                <ul>
                    {tables.map((table) => {
                        return (
                            <li key={table.tableId}>
                                <span>
                                    {table.gameName} - ({table.playerCount} / {table.maxSeatCount})
                                </span> 
                                <button onClick={() => { this.joinMatch(table) }}>join</button>
                            </li>
                        )
                    })}
                </ul>
            </div>
        )
    }

    renderCurrentMatch () {
        const { 
            inMatch,
            canReconnect,
            table,
            match
        } = this.state;

        const controls = (
            <div className="match-controls">
                { inMatch ? (
                    <div>
                        <button 
                            onClick={() => { this.readyMatch() }}
                        >ready</button>
                    </div>
                ) : "" }

                { canReconnect ? (
                    <div>
                        <button 
                            onClick={() => { this.joinMatch(table) }}
                        >rejoin match</button>
                    </div>
                ) : "" }

                <div>
                    <button 
                      onClick={() => { this.leaveMatch() }}
                    >leave match</button>
                </div>

                { table && table.gameStarted ? (
                    <div>
                        <button 
                        onClick={() => { this.abandonMatch() }}
                        >abandon match</button>
                    </div>
                ) : "" }
            </div>
        )

        const seats = match.seats ? match.seats.map(seat => {
            return (
                <li key={ seat.position }>
                    <ul>
                        <li>Seat: { seat.displayName }</li>
                        <li>Is Seated? { seat.isSeated ? "yes" : "no" }</li>
                        <li>Ready? { seat.isReady ? "yes" : "no" }</li>
                    </ul>
                </li>
            )
        }) : (<li>Nobody seated.</li>);

        return (
            <div>
                <h3>Current match:</h3>

                <div>
                    Match name: { table.gameName } - { table.tableId }
                </div>
                <div>
                    Match Started? { table.gameStarted ? "yes" : "no" }
                </div>

                <div className="match-seats">
                    <ol>{ seats }</ol>
                </div>

                { controls }
            </div>
        )
    }

    renderLobby () {
        return this.state.hasCurrentTable ? this.renderCurrentMatch() : this.renderTableList();
    }

    render () {
        const { user, tables, inMatch, finishedLoading } = this.state;

        return (
            <div className="home-wrapper">
                <h2>Home</h2>
                <h3>User: {user.username}</h3>
                <button onClick={() => { this.logout() }}>logout</button>

                { finishedLoading ? this.renderLobby() : <div>Loading...</div> }
            </div>
        )
    }
}

export default LobbyPage
