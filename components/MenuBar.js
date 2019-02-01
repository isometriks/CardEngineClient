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

        const menuState = menuOpen ? "drop-down" : "drop-down hidden";
        const connectionStatus = wsApi.isConnected() ? "ws connected" : "ws not connected";

        return (
            <div className="menu-bar">
                <div className="connection-status">
                    <div className="connection-status-label">
                        { connectionStatus }
                    </div>
                </div>
                
                <div className="hamburger-menu">
                    <div
                      onClick={() => { this.toggle() }} 
                      className="hamburger-menu-label">Menu</div>
                </div>

                <div className={menuState}>
                    <ul>
                        <li>Profile</li>
                        <li>High Scores</li>
                        <li>Logout</li>
                    </ul>
                </div>

                
            </div>
        )
    }
}

export default MenuBar

