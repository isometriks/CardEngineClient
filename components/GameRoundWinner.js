import React, { Component } from 'react';

class GameRoundWinner extends Component {
    constructor(props) {
      super(props);

        this.state = {}
    }

    renderPointCards (pointCards) {
        console.log("point cards: ", pointCards);

        const suitSymbols = {
            "Diamonds": "♦",
            "Hearts": "♥",
            "Spades": "♠",
            "Clubs": "♣"
        };

        return (
            <ul> 
                {  pointCards.map((pointCard, index) => {
                    const { card } = pointCard;
                    const suitSymbol = suitSymbols[card.suitName];

                    if (pointCard.type === "game") {
                        return (
                            <li key={index}>
                                { pointCard.type } - { card.total}
                            </li>
                        )
                    }

                    return (
                        <li key={index}>
                            <span>{ pointCard.type } - </span>
                            <span className={card.suitName}>{ suitSymbol }</span>
                            <span>{ card.label }</span>
                        </li>
                    )
                }) }
            </ul>
        )
    }

    renderRoundWinner () {
        const { roundResult, matchApi } = this.props;
        const { seats } = matchApi.get();

        if (!seats) {
            return <div/>;
        }

        return Object.keys(roundResult).map(seatPosition => {
            const seat = seats[seatPosition];
            const { total, pointCards } = roundResult[seatPosition];

            return (
                <div className="round-result" key={seatPosition}> 
                  <div className="round-result-label">{ seat.displayName }</div>
                  <div>round points: { total }</div>
                  <div className="round-result-cards">point cards: { this.renderPointCards(pointCards ) }</div>
                </div>
            )
        })
    }

    hideSelf () {
        const { gameApi } = this.props;

        gameApi.sendEvent("closeRoundWindow");
    }

    render () {
        const { showRoundEnd, matchApi } = this.props;
        const { gameState } = matchApi.get();

        const bidClass = showRoundEnd
            ? "popup-container round-wrapper" : "popup-container round-wrapper hidden";

        return (
            <div className={bidClass} onClick={() => { this.hideSelf() }}>
                <div className="header-label">Round Ended</div>

                <div className="round-area">
                    { this.renderRoundWinner() }
                </div>
            </div>
        )
    }
}

export default GameRoundWinner

