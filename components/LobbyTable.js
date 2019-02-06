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
            <button className="ui primary button" onClick={() => { lobbyApi("readyMatch") }}>
                Ready
            </button>
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
                <div className="ui small fluid buttons">
                    { readyButton }
                    { joinButton }
                    <button className="ui button red" onClick={() => { lobbyApi("leaveMatch") }}>
                        Leave
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
                <div key={ seat.position } className={seatClass + " item"}>
                    <div className={"ui left pointing label " + (seat.isReady ? "blue" : "red")}>
                        { seat.isReady ? "Ready" : "Waiting" }
                    </div>
                    
                    <div className="seat-row-name">
                        { seat.displayName }
                    </div>
                </div>
            )
        }) : (<li>Nobody seated.</li>);
    }

    render () {
        return (
            <div className="lobby-table-wrapper ui fluid card">
                <div className="content">
                    <div className="match-seats">
                        <div className="ui fluid vertical menu">
                            { this.renderSeats() }
                        </div>
                    </div>
                </div>

                <div className="content extra">
                    { this.renderControls() }
                </div>
            </div>
        )
    }
}

export default LobbyTable
