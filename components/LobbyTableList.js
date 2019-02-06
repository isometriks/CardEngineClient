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
                <div className="ui vertical fluid menu">
                    <div className="item">
                        <h4>Game Lobbies</h4>
                    </div>

                    {tables.map((table) => {
                        return (
                            <a className="item" key={table.tableId} onClick={() => { lobbyApi("joinMatch", table) }}>
                                {table.gameName}

                                <div className="ui teal left pointing label table-info">
                                    {table.playerCount} / {table.maxSeatCount}
                                </div>
                            </a>
                        )
                    })}
                </div>
            </div>
        )
    }
}

export default LobbyTableList
