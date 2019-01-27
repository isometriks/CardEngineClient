import React, { Component } from 'react';

import api from '../shared/api';
import LobbyService from '../services/LobbyService';

class LobbyPage extends Component {
    constructor(props) {
      super(props);

      this.state = {
        user: JSON.parse(localStorage.getItem('user')),
        tables: []
      };
    }

    componentDidMount () {
        api.tables()
            .then(res => {
                const { data } = res;

                console.log("Tables: ", data);

                this.setState({
                    tables: data
                });
            });
    }

    logout () {
        localStorage.removeItem("user");
        this.setState({
            user: {}
        });

        this.props.history.push("/");
    }

    render () {
        const { user, tables } = this.state;

        return (
            <div className="home-wrapper">
                <h2>Home</h2>
                <h3>User: {user.username}</h3>
                <button onClick={() => { this.logout() }}>logout</button>

                <h3>Games:</h3>
                <ul>
                    {tables.map((table) => {
                        return (
                            <li key={table.tableId}>
                                <span>
                                    {table.gameName} - ({table.playerCount} / {table.maxSeatCount})
                                </span> <button>join</button>
                            </li>
                        )
                    })}
                </ul>

                <LobbyService />
            </div>
        )
    }
}

export default LobbyPage
