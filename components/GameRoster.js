import React, { Component } from 'react';

class GameRoster extends Component {
    constructor(props) {
      super(props);

        this.state = {};
    }

    renderSeats () {
        const { matchApi } = this.props;
        const { 
            gameState,
            highBidSeat,
            currentBid,
            dealerSeat, 
            seats 
        } = matchApi.get();

        if (!seats) {
            return;
        }

        const hasBidder = (gameState !== "round.bid");

        return seats.map(seat => {
            const dealerIcon = (seat.position === dealerSeat) ? (
                <i className="ui icon user" />
            ) : (
                <i className="ui icon user outline" />
            );

            const bidIcon = (hasBidder && (seat.position === highBidSeat)) ? (
                <div className="ui teal left pointing label roster-seat-bid-icon">
                    <div className="bid-number">{currentBid}</div>
                </div>
            ) : "";

            const seatScore = seat.score || 0;

            return (
                <div key={seat.position} className="item roster-seat active">
                    <span>
                        { dealerIcon }
                        {seat.displayName}
                    </span>

                    { bidIcon }

                    <div className="roster-seat-score">
                        <div className="score-label">{seatScore}</div>
                    </div>
                </div>
            )
        })
    }

    render () {
        return (
            <div className="game-roster-wrapper ui vertical menu">
                { this.renderSeats() }
            </div>
        )
    }
}

export default GameRoster

