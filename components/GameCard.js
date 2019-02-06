import React, { Component } from 'react';

class GameCard extends Component {
    constructor(props) {
      super(props);

        this.state = {
            isDisplay: this.props.isDisplay || false
        };
    }

    suitAscii (suit) {
        const symbols = {
            "Diamonds": "♦",
            "Hearts": "♥",
            "Spades": "♠",
            "Clubs": "♣"
        };

        return symbols[suit];
    }

    render () {
        const { isDisplay } = this.state;
        const { card, gameApi } = this.props;
        const { 
            name,
            suitName,
            suitColor,
            inPlay
        } = card;

        const playClass = inPlay && !isDisplay ? 'in-play' : '';
        const cardClass = `game-card ${suitColor} ${ playClass }`;

        return (
            <div 
              className={ cardClass + " ui card"}
              onClick={() => {
                if (!isDisplay && !inPlay) {
                    gameApi.playCard(card)
                }
              }}>
                <div className="game-card-content">
                    <div className="card-symbol">{ this.suitAscii(suitName) }</div>
                    <div className="card-value">{ name }</div>
                </div>
            </div>
        )
    }
}

export default GameCard

