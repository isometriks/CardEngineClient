import React, { Component } from 'react';

import { Switch, Route, Redirect } from 'react-router-dom'

import LoginPage from './LoginPage'
import HomePage from './HomePage'

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    localStorage.getItem('user')
      ? <Component {...props} />
      : <Redirect to='/' />
  )} />
)

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
