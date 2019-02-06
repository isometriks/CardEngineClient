import React, { Component } from 'react';

class MenuBar extends Component {
    constructor(props) {
      super(props);

        this.state = {
            user: this.props.user,
            menuOpen: false
        }
    }

    toggle () {
        this.setState({
            menuOpen: !this.state.menuOpen
        })
    }

    render () {
        const { username } = this.state.user;
        const { menuOpen } = this.state;
        const { wsApi } = this.props;
        const connectionStatus = wsApi.isConnected() ? "ws connected" : "ws not connected";

        return (
            <div className="ui inverted menu menu-bar">
                <div className="ui item">
                    { username }
                </div>
                <div className="ui simple dropdown item hamburger-menu">
                    Menu

                    <i className="dropdown icon"></i>
                    <div className="menu">
                        <a className="item">Profile</a>
                        <a className="item">High Scores</a>
                        <a className="item">Logout</a>
                    </div>
                </div>

                <div className="ui inverted right menu">
                    <div className="item connection-status">
                        { connectionStatus }
                    </div>
                </div>
            </div>
        )
    }
}

export default MenuBar

