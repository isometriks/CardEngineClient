import React, { Component } from 'react';

class GameBid extends Component {
    constructor(props) {
      super(props);

        this.state = {}
    }

    canPlaceBid () {
        const { playerApi, matchApi } = this.props;
        const { position } = playerApi.get();
        const { currentBidSeat } = matchApi.get();

        return position === currentBidSeat;
    }

    renderBidOptions () {
        const { gameApi, playerApi, matchApi } = this.props;
        const bids = [4, 3, 2, 0];

        const player = playerApi.get();

        const {
            currentBid,
            currentBidSeat,
            highBidSeat
        } = matchApi.get();

        if (this.canPlaceBid()) {
            return (
                bids.map(bid => {
                    const isBidEnabled = (currentBid === null || bid > currentBid || bid === 0);
                    const wrapperClass = isBidEnabled
                        ? "popup-container bid-wrapper" : "popup-container bid-wrapper disabled";
                    const bidLabel = (bid === 0) ? "pass" : `Bid ${bid}`;

                    return (
                        <div key={bid} className="bid-wrapper">
                            <button 
                              disabled={ isBidEnabled ? "" : "disabled" }
                              onClick={() => { gameApi.placeBid(bid) }}>
                                { bidLabel }
                            </button>
                        </div>
                    )
                })
            )
        } 

        return (
            <div>Other player is bidding...</div>
        )
    }

    renderBidInfo () {
        const { matchApi } = this.props;
        const { seats, currentBid, highBidSeat } = matchApi.get();
        const bidLabel = currentBid ? currentBid : "none";

        const leadingBidder = currentBid 
            ? seats[highBidSeat].displayName : "nobody";

        return (
            <div className="bidding-info">
                <div className="bidding-info-player">
                    <div>Leading Bidder:</div>
                    <div>{ leadingBidder } </div>
                </div>
                <div className="bidding-info-current">
                    <div>Current Bid:</div>
                    <div>{ bidLabel }</div>
                </div>
            </div>
        )
    }

    render () {
        const { matchApi, showRoundEnd } = this.props;
        const { gameState } = matchApi.get();

        const showBidding = (
            gameState === "round.bid" &&
            !showRoundEnd
        )

        const bidClass = showBidding
            ? "bidding-wrapper" : "bidding-wrapper hidden";

        return (
            <div className={bidClass}>
                <div className="header-label">Place Bids</div>

                <div className="bidding-area">
                    { this.renderBidOptions() }
                </div>

                { this.renderBidInfo() }
            </div>
        )
    }
}

export default GameBid

