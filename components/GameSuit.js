import React, { Component } from 'react';

class GameSuit extends Component {
    constructor(props) {
      super(props);

        this.state = {}
    }

    canPickSuit () {
        const { playerApi, matchApi } = this.props;
        const { position } = playerApi.get();
        const { currentBidSeat } = matchApi.get();

        return position === currentBidSeat;
    }

    renderSuitOptions () {
        const { gameApi, playerApi, matchApi } = this.props;
        const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];

        const player = playerApi.get();

        const {
            currentBid,
            currentBidSeat,
            highBidSeat
        } = matchApi.get();

        if (this.canPickSuit()) {
            return (
                suits.map(suit => {
                    return (
                        <div key={suit} className="choice-wrapper">
                            <button 
                              onClick={() => { gameApi.pickSuit(suit) }}>
                                { suit }
                            </button>
                        </div>
                    )
                })
            )
        } 

        return (
            <div>Winning bidder choosing trump suit.</div>
        )
    }

    render () {
        const { matchApi } = this.props;
        const { gameState } = matchApi.get();

        const showBidding = (gameState === "round.pregame");

        const bidClass = showBidding
            ? "popup-container suit-wrapper" : "popup-container suit-wrapper hidden";

        return (
            <div className={bidClass}>
                <div className="header-label">Choose Trump Suit</div>

                <div className="suit-area">
                    { this.renderSuitOptions() }
                </div>
            </div>
        )
    }
}

export default GameSuit

