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
            <div onClick={() => { gameApi.playCard(card) }}>
                { card.suitColor } - { card.name } - {card.suitName }
            </div>
        )
    }
}

export default GameCard

