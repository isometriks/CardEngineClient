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
            currentTable: {},
            currentMatch: {},
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
            'message': this.handleSocketMessage.bind(self)
        }

        Object.keys(handlerMap).forEach(key => {
            wsApi.setHandler(key, handlerMap[key]);
        });
    }

    handleSocketConnect (e) {
        const { shouldSeatPlayer } = this.state;
        
        if (shouldSeatPlayer) {
            const { matchId } = this.state.currentMatch;

            console.log("sending game.join to table");
            this.props.wsApi.send("game.join", { matchId: matchId });

            this.setState({
                shouldSeatPlayer: false
            });
        }

        this.setState({
            connected: true
        });
    }

    handleSocketMessage (e) {
        const { key, cmd, message } = SocketAPI.parseMessage(e);
        console.log("Got lobby message: ", key, cmd, message);

        switch (key) {
            case "table":
                this.handleTableMessage(cmd, message);
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
                    this.moveToGame();

                    return;
                }

                this.setState({
                    currentMatch: message
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
            currentTable: table
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
                currentTable: table,
                currentMatch: data,
                hasCurrentTable: true,
                shouldSeatPlayer: true,
                inMatch: true
            });

            this.connectSocket();
        }).catch(error => {
            console.log("join err: ", error);
        });
    }

    leaveMatch (table) {
        const { currentTable } = this.state;
        console.log("table: ", currentTable);

        api.leaveMatch({
            gameName: currentTable.gameName,
            tableId: currentTable.tableId
        }).then(res => {
            this.setState({
                currentTable: {},
                currentMatch: {},
                hasCurrentTable: false,
                inMatch: false
            });

            this.listTables();
        }).catch(error => {
            console.log("leave err: ", error);
        });
    }

    abandonMatch () {
        const { currentTable } = this.state;

        api.abandonMatch({
            gameName: currentTable.gameName,
            tableId: currentTable.tableId
        }).then(res => {
            console.log("abandon res: ", res);

            this.setState({
                currentTable: {},
                currentMatch: {},
                hasCurrentTable: false,
                inMatch: false
            });

            this.listTables();
        }).catch(error => {
            console.log("abandon err: ", error);
        });
    }

    readyMatch () {
        const { matchId } = this.state.currentMatch;

        console.log("Readying match: ", matchId);
        this.props.wsApi.send("game.ready", { matchId: matchId });
    }

    moveToGame () {
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
            currentTable,
            currentMatch
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

                <div>
                    <button 
                      onClick={() => { this.leaveMatch() }}
                    >leave match</button>
                </div>

                { currentTable && currentTable.gameStarted ? (
                    <div>
                        <button 
                        onClick={() => { this.abandonMatch() }}
                        >abandon match</button>
                    </div>
                ) : "" }
            </div>
        )

        const seats = currentMatch.seats ? currentMatch.seats.map(seat => {
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
                    Match name: { currentTable.gameName } - { currentTable.tableId }
                </div>
                <div>
                    Match Started? { currentTable.gameStarted ? "yes" : "no" }
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
