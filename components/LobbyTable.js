import React, { Component } from 'react';

class LobbyTable extends Component {
    constructor(props) {
      super(props);
    }

    renderControls () {
        const { 
            table,
            inMatch,
            canReconnect,
            lobbyApi
        } = this.props;

        const readyButton = inMatch ? (
            <div className="match-controls-item">
                <button onClick={() => { lobbyApi("readyMatch") }}>
                    ready
                </button>
            </div>
        ) : "";

        const joinButton = canReconnect ? (
            <div className="match-controls-item">
                <button onClick={() => { lobbyApi("joinMatch", table) }}>
                    rejoin match
                </button>
            </div>
        ) : "";

        const abandonButton = table && table.gameStarted ? (
            <div className="match-controls-item">
                <button onClick={() => { lobbyApi("abandonMatch") }}>
                    abandon match
                </button>
            </div>
        ) : "";

        return (
            <div className="match-controls">
                { readyButton }
                { joinButton }

                <div className="match-controls-item">
                    <button onClick={() => { lobbyApi("leaveMatch") }}>
                        leave match
                    </button>
                </div>

                { abandonButton }
            </div>
        )
    }

    renderSeats () {
        const { 
            match
        } = this.props;

        return match.seats ? match.seats.map(seat => {
            const seatClass = seat.isReady ? "seat-row ready" : "seat-row";

            return (
                <li key={ seat.position } className={seatClass}>
                    <div className="seat-row-status">
                        { seat.isReady ? "ready" : "not ready" }
                    </div>
                    
                    <div className="seat-row-name">
                        { seat.displayName }
                    </div>
                </li>
            )
        }) : (<li>Nobody seated.</li>);
    }

    render () {
        return (
            <div className="lobby-table-wrapper">
                <div className="match-seats">
                    <ol>{ this.renderSeats() }</ol>
                </div>

                { this.renderControls() }
            </div>
        )
    }
}

export default LobbyTable
