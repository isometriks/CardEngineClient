import React, { Component } from 'react';

import GameRoster from './GameRoster';
import GameSuit from './GameSuit';
import GameBid from './GameBid';
import GameMatchWinner from './GameMatchWinner';
import GameRoundWinner from './GameRoundWinner';
import GameTrickWinner from './GameTrickWinner';
import GamePlayArea from './GamePlayArea';
import GameCard from './GameCard';

class GameBoard extends Component {
    constructor(props) {
      super(props);

        this.state = {
            isMatchOver: false,
            showTrickEnd: false,
            showRoundEnd: false,
            showMatchEnd: false,
            trickResult: {},
            roundResult: {},
            matchResult: {}
        }

        const match = this.props.matchApi.get();
        const player = this.props.playerApi.get();

        this.props.gameApi.listen(this.gameEventHandler.bind(this));
    }

    gameEventHandler (e, data) {
        switch (e) {
            case "matchAbandoned":
                console.log("match was abandoned.");
                
                this.setState({
                    isMatchOver: true
                });
            break;

            case "trickEnd":
                console.log("got signal trick ended.", e, data);
                this.setState({
                    showTrickEnd: true,
                    trickResult: data
                });
            break;

            case "roundEnd":
                console.log("round ended: ", e, data);
                this.setState({
                    showRoundEnd: true,
                    roundResult: data
                });
            break;

            case "tableUpdate":
            case "closeTrickWindow":
                const { showTrickEnd } = this.state;

                if (showTrickEnd) {
                    this.setState({
                        showTrickEnd: false
                    });
                }
            break;

            case "closeRoundWindow":
                const { showRoundEnd } = this.state;

                if (showRoundEnd) {
                    this.setState({
                        showRoundEnd: false
                    });
                }
            break;

            case "matchEnd":
                console.log("match finished.");

                this.setState({
                    showMatchEnd: true,
                    matchResult: data,
                    isMatchOver: true
                })
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
        const { cards } = playerApi.get();

        const suitRanks = {
            "Diamonds": 4,
            "Hearts": 3,
            "Spades": 2,
            "Clubs": 1
        };

        // sort em the way i like em

        cards.sort((a, b) => {
            return (a.suitColor === "red") ? 1 : -1;
        });

        cards.sort((a, b) => {
            if (a.suitName === b.suitName) {
                return a.value - b.value;
            }

            return suitRanks[a.suitName] - suitRanks[b.suitName];
        });

        cards.reverse();

        return cards.map((card, index) => {
            return <div className="ui column">
                <GameCard key={index} gameApi={gameApi} card={card} />
            </div>;
        });
    }

    renderPlayerSeat () {
        const seat = this.getPlayerSeat();

        if (!seat) {
            return <div className="player-seat" />;
        }

        return this.renderCards(seat);
    }

    renderPlayerBuffer () {
        const { matchApi , playerApi } = this.props;
        const { 
            gameState,
            trumpSuit,
            playSeat
        } = matchApi.get();
        const { position } = playerApi.get();

        const suitSymbols = {
            "Diamonds": "♦",
            "Hearts": "♥",
            "Spades": "♠",
            "Clubs": "♣"
        };

        const isPlayersTurn = (
                gameState === "round.play" &&
                playSeat === position
        );

        const trumpIcon = trumpSuit ? (
            <div className="trump-icon">
                <div className={trumpSuit}>{ suitSymbols[trumpSuit] }</div>
            </div>
        ) : "";

        const turnIcon = isPlayersTurn ? (
            <div className="turn-icon">
                <div className="turn-label">Your Turn</div>
            </div>
        ) : "";

        return (
            <div className="buffer-wrapper">
                { trumpIcon }
                { turnIcon }
            </div>
        )
    }

    render () {
        const { 
            isMatchOver, 
            showTrickEnd, 
            trickResult,
            showRoundEnd,
            roundResult,
            showMatchEnd,
            matchResult
        } = this.state;
        const { matchApi, gameApi, playerApi } = this.props;
        
        const match = matchApi.get();
        const { gameState } = match;

        const boardClass = isMatchOver ? "board-wrapper disabled" : "board-wrapper";

        return (
            <div className={boardClass}>
                <div className="board-area">
                    <GameRoster
                      playerApi={playerApi}
                      matchApi={matchApi} />

                    <GameBid
                      showRoundEnd={showRoundEnd}
                      playerApi={playerApi}
                      matchApi={matchApi} 
                      gameApi={gameApi} />

                    <GameSuit
                      playerApi={playerApi}
                      matchApi={matchApi} 
                      gameApi={gameApi} />

                    <GameTrickWinner
                      showTrickEnd={showTrickEnd}
                      trickResult={trickResult}
                      playerApi={playerApi}
                      matchApi={matchApi} 
                      gameApi={gameApi} />

                    <GameRoundWinner
                      showRoundEnd={showRoundEnd}
                      roundResult={roundResult}
                      playerApi={playerApi}
                      matchApi={matchApi} 
                      gameApi={gameApi} />

                    <GameMatchWinner
                      showMatchEnd={showMatchEnd}
                      matchResult={matchResult}
                      playerApi={playerApi}
                      matchApi={matchApi} 
                      gameApi={gameApi} />

                    <GamePlayArea
                      playerApi={playerApi}
                      matchApi={matchApi} 
                      gameApi={gameApi} />
                </div>

                <div className="player-area-buffer">
                    { this.renderPlayerBuffer() }
                </div>

                <div className="player-area ui segment">
                    <div className="ui grid six columns">
                        { this.renderPlayerSeat() }
                    </div>
                </div>
            </div>
        )
    }
}

export default GameBoard

