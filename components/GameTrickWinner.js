import React, { Component } from 'react';

class GameTrickWinner extends Component {
    constructor(props) {
      super(props);

        this.state = {}
    }

    renderTrickWinner () {
        const { trickResult, matchApi } = this.props;
        const { userId } = trickResult;
        const { seats } = matchApi.get();

        if (!seats) {
            return <div/>;
        }

        console.log("seats: ", seats, "result: ", trickResult);

        const winner = seats.find(seat => {
            return seat.userId === userId;
        });

        if (!winner) {
            return <div/>;
        }

        return <div>Winner: { winner.displayName }</div>;
    }

    hideSelf () {
        const { gameApi } = this.props;

        gameApi.sendEvent("closeTrickWindow");
    }

    render () {
        const { showTrickEnd, matchApi } = this.props;
        const { gameState } = matchApi.get();

        const bidClass = showTrickEnd
            ? "popup-container trick-wrapper" : "popup-container trick-wrapper hidden";

        return (
            <div className={bidClass} onClick={() => { this.hideSelf() }}>
                <div className="header-label">Trick Ended</div>

                <div className="trick-area">
                    { this.renderTrickWinner() }
                </div>
            </div>
        )
    }
}

export default GameTrickWinner

