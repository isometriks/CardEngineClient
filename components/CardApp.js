import React, { Component } from 'react';

import { Switch, Route, Redirect } from 'react-router-dom'

import axios from 'axios'
import SocketAPI from '../shared/SocketAPI'

import '../styles/main.scss'

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

      const makeStateApi = (prop) => {
        return {
          set: this.sharedSetter(prop),
          get: this.sharedGetter(prop)
        }
      };

      this.state = {
        'wsApi': new SocketAPI(),
        'match': { empty: true },
        'player': {},

        'matchApi': makeStateApi('match'),
        'playerApi': makeStateApi('player')
      };

      this.setup();
    }

    sharedGetter (prop) {
      return () => {
        return this.state[prop];
      }
    }

    sharedSetter (prop) {
      return (val) => {
        this.setState({
          [prop]: val
        });
      }
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
          localStorage.removeItem("user");
          window.location.href = "/";

          return;
        }

        return Promise.reject(error);
      });
    }

    render () {
      const { wsApi, matchApi, playerApi } = this.state;

        return (
            <div>
                <Switch>
                    <Route exact path='/' component={LoginPage}/>
                    
                    <PrivateRoute 
                      path='/lobby' 
                      component={LobbyPage} 
                      wsApi={wsApi} 
                      matchApi={matchApi} 
                      playerApi={playerApi} />
                    
                    <PrivateRoute 
                      path='/game' 
                      component={GamePage} 
                      wsApi={wsApi} 
                      matchApi={matchApi} 
                      playerApi={playerApi} />
                </Switch>
            </div>
        )
    }
}

export default CardApp
