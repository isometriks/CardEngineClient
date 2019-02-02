import React, { Component } from 'react';

import GameCard from './GameCard';

class GamePlayArea extends Component {
    constructor(props) {
      super(props);

        this.state = {}
    }

    renderPlayCards () {
        const { matchApi } = this.props;
        const {
            cardsInPlay
        } = matchApi.get();

        if (!cardsInPlay) {
            return <div className="play-area-cards" />;
        }

        return cardsInPlay.map((card, index) => {
            return (
                <GameCard 
                  key={index} 
                  isDisplay={true}
                  card={card} />
            )
        })
    }

    render () {
        return (
            <div className="play-area">
                { this.renderPlayCards() }
            </div>
        )
    }
}

export default GamePlayArea

