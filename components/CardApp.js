import React, { Component } from 'react';

import { Switch, Route } from 'react-router-dom'

import PrivateRoute from './PrivateRoute'
import LoginPage from './LoginPage'
import HomePage from './HomePage'

class CardApp extends Component {
    constructor(props) {
      super(props);
    }

    render () {
        return (
            <div>
                <Switch>
                    <Route exact path='/' component={LoginPage}/>
                    <PrivateRoute path='/home' component={HomePage}/>
                </Switch>
            </div>
        )
    }
}

export default CardApp
