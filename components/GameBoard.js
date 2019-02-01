import React, { Component } from 'react';

import GameCard from './GameCard';

class GameBoard extends Component {
    constructor(props) {
      super(props);

        this.state = {
            isMatchOver: false
        }

        const match = this.props.matchApi.get();
        const player = this.props.playerApi.get();

        this.props.gameApi.listen(this.gameEventHandler.bind(this));
    }

    gameEventHandler (e) {
        switch (e) {
            case "matchAbandoned":
                console.log("match was abandoned.");
                
                this.setState({
                    isMatchOver: true
                });
            break;
        }
    }

    getPlayerSeat () {
        const { playerApi, matchApi } = this.props;
        const { userId } = playerApi.get();            
        const { seats } = matchApi.get();

        if (!seats) {
            return null;
        }

        return seats.find(seat => { 
            return seat.userId === userId;
        });
    }

    renderCards (seat) {
        const { playerApi, gameApi } = this.props;
        const player = playerApi.get();
        const { cards } = player;

        return cards.map((card, index) => {
            return <GameCard key={index} gameApi={gameApi} card={card} />;
        });
    }

    renderPlayerSeat () {
        const seat = this.getPlayerSeat();

        if (!seat) {
            return <div className="player-seat" />;
        }

        return this.renderCards(seat);
    }

    render () {
        const { isMatchOver } = this.state;
        const boardClass = isMatchOver ? "board-wrapper disabled" : "board-wrapper";

        const match = this.props.matchApi.get();
        const { gameState } = match;

        return (
            <div className={boardClass}>
                <div className="board-area">
                    Game Board
                </div>

                <div className="player-area-buffer" />
                
                <div className="player-area">
                    { this.renderPlayerSeat() }
                </div>
            </div>
        )
    }
}

export default GameBoard

