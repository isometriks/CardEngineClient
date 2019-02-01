import React, { Component } from 'react';

class GameCard extends Component {
    constructor(props) {
      super(props);

        this.state = {
            gameApi: this.props.gameApi,
            card: this.props.card
        }
    }

    render () {
        const { card, gameApi } = this.state;

        return (
            <div 
              className="game-card" 
              onClick={() => { gameApi.playCard(card) }}>
                <div>{ card.suitColor }</div>
                <div>{ card.name }</div>
                <div>{card.suitName }</div>
            </div>
        )
    }
}

export default GameCard

