import React, { Component } from 'react';

class LobbyTableList extends Component {
    constructor(props) {
      super(props);

        this.state = {
            tables: this.props.tables
        }
    }

    render () {
        const { tables } = this.state;
        const { lobbyApi } = this.props;

        return (
            <div className="table-list">
                <h3>Game Lobbies:</h3>

                <ul>
                    {tables.map((table) => {
                        return (
                            <li className="table-list-row" key={table.tableId}>
                                <div className="table-list-text">
                                    <div className="slot-wrapper">
                                        <div className="table-name">{table.gameName}</div>
                                        <div className="table-info">
                                            ({table.playerCount} / {table.maxSeatCount})
                                        </div>
                                    </div>
                                </div> 

                                <div className="table-list-control">
                                    <button                                 
                                      onClick={() => { lobbyApi("joinMatch", table) }}>Join Game</button>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>
        )
    }
}

export default LobbyTableList
