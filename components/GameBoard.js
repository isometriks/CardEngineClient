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

        console.log("game board construct: ", match, player);

        this.props.gameApi.listen(this.gameEventHandler.bind(this));
    }

    gameEventHandler (e) {
        console.log("got game event: ", e);

        switch (e) {
            case "matchAbandoned":
                this.setState({
                    isMatchOver: true
                });
            break;
        }
    }

    renderCards (seat) {
        const { playerApi, gameApi } = this.props;
        const player = playerApi.get();

        console.log("rendering cards: ", player, seat);

        if (player.userId !== seat.userId) {
            return <div className="player-cards">Private Cards...</div>;    
        }   

        const { cards } = player;
        return (
            <div className="player-cards">
                { cards.map((card, index) => {
                    return <GameCard key={index} gameApi={gameApi} card={card} />;
                }) }
            </div>
        )
    }

    renderSeats () {
        const self = this;
        const match = this.props.matchApi.get();
        const { seats } = match;

        if (!seats) {
            return <div className="seat-wrapper" />;
        }

        console.log("rendering seats: ", this.state);

        return (
            <div className="seat-wrapper">
                {seats.map(seat => {
                    return (
                        <div key={ seat.userId } className="player-seat">
                            Name: { seat.displayName } <br />
                            Position: { seat.postion } <br />

                            Cards: { self.renderCards(seat) }
                        </div>
                    )
                    
                })}
            </div>
        )
    }

    render () {
        const { isMatchOver } = this.state;
        const boardClass = isMatchOver ? "board-wrapper disabled" : "board-wrapper";

        return (
            <div className={boardClass}>
                Game Board

                { this.renderSeats() }
            </div>
        )
    }
}

export default GameBoard

