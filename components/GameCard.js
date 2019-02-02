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
            suitColor
        } = card;

        const cardClass = `game-card ${suitColor}`;

        return (
            <div 
              className={ cardClass }
              onClick={() => {if (!isDisplay) { gameApi.playCard(card) }}}>
                <div className="game-card-content">
                    <div className="card-symbol">{ this.suitAscii(suitName) }</div>
                    <div>{ name }</div>
                </div>
            </div>
        )
    }
}

export default GameCard

