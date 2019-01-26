import React, { Component } from 'react';

class HomePage extends Component {
    constructor(props) {
      super(props);

      this.state = {
        user: JSON.parse(localStorage.getItem('user'))
      };
    }

    render () {
        const { user } = this.state;

        return (
            <div className="home-wrapper">
                <h2>Home</h2>

                <h3>User: {user.username}</h3>
            </div>
        )
    }
}

export default HomePage
