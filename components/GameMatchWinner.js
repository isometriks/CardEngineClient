import React, { Component } from 'react';

class GameMatchWinner extends Component {
    constructor(props) {
      super(props);

        this.state = {}
    }

    renderMatchResults () {
        return (
            <div>Match results here</div>
        )
    }

    hideSelf () {
        const { gameApi } = this.props;

        gameApi.sendEvent("closeMatchWindow");
    }

    render () {
        const { showMatchEnd, matchApi } = this.props;
        const { gameState } = matchApi.get();

        const bidClass = showMatchEnd
            ? "popup-container match-wrapper" : "popup-container match-wrapper hidden";

        return (
            <div className={bidClass} onClick={() => { this.hideSelf() }}>
                <div className="header-label">Match Ended</div>

                <div className="match-area">
                    { this.renderMatchResults() }
                </div>
            </div>
        )
    }
}

export default GameMatchWinner

