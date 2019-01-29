import React, { Component } from 'react';

import { Switch, Route, Redirect } from 'react-router-dom'

import axios from 'axios'
import SocketAPI from '../shared/SocketAPI'

import LoginPage from './LoginPage'
import LobbyPage from './LobbyPage'
import GamePage from './GamePage'

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    localStorage.getItem('user')
      ? <Component {...props} {...rest} />
      : <Redirect to='/' />
  )} />
)

class CardApp extends Component {
    constructor(props) {
      super(props);

      this.state = {
        'wsApi': new SocketAPI()
      };

      this.setup();
    }

    setup () {
      axios.interceptors.response.use(function (response) {
        // Do something with response data
        return response;
      }, function (error) {
        // Do something with response error
        const { status } = error.response;
        console.log("axios error: ", status);

        if (status === 403) {
          window.location.href = "/";

          return;
        }

        return Promise.reject(error);
      });
    }

    render () {
      const { wsApi } = this.state;

        return (
            <div>
                <Switch>
                    <Route exact path='/' component={LoginPage}/>
                    <PrivateRoute path='/home' component={LobbyPage} wsApi={wsApi} />
                    <PrivateRoute path='/game' component={GamePage} wsApi={wsApi} />
                </Switch>
            </div>
        )
    }
}

export default CardApp
