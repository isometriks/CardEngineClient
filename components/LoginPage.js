import React, { Component } from 'react';

import api from '../shared/api';

function RegisterLabel (props) {
    const {
        registerSuccess,
        registerError,
        registerErrorText
    } = props;

    if (registerSuccess) {
        return <span className="register-label">Succesfully Registered!</span>;
    }

    if (registerError) {
        return <span className="error-text">{ registerErrorText }</span>;   
    }
    
    return <span />;
}

class LoginPage extends Component {
    constructor(props) {
      super(props);

      this.state = {
        user: {},
        loginUsername: "",
        showingRegistration: false,
        loginError: false,
        loginErrorText: "",
        registerError: false,
        registerErrorText: "",
        registerSuccess: false
      };

      const existingUser = localStorage.getItem("user");

      if (existingUser) {
        console.log("found existing user");
        this.props.history.push("/lobby");
      }
    }

    setUser (user) {
        localStorage.setItem("user", JSON.stringify(user));
        this.setState({
            user: user
        });
    }

    setError (which, text) {
        this.setState({
            [`${which}ErrorText`]: text
        });

        this.setState({
            [`${which}Error`]: true
        });
    }

    getInputValue (field) {
        const el = document.querySelector(`input[name=${field}`);

        return el ? el.value : null;
    }

    testLogin () {
        const self = this;
        const userObj = {
            username: self.getInputValue("username"),
            password: self.getInputValue("password")
        };

        api.login(userObj)
            .then(res => {
                //
                // succesfully logged in
                //

                this.setUser(userObj);
                this.props.history.push("/lobby");
            }).catch(error => {
                if (error.response) {
                    const { data, status, headers } = error.response;

                    if (status === 422) {
                        self.setError("login", "Enter username / password");
                        return;
                    } else if (status === 401) {
                        self.setError("login", "Incorrect username / password");
                        return;
                    }  

                    self.setError("login", "Error logging in. Try again later.");
                }
            });
    }

    registerUser () {
        const self = this;
        const registerObj = {
            username: self.getInputValue("username"),
            password: self.getInputValue("password"),
            fullName: self.getInputValue("fullname")
        };

        api.register(registerObj)
            .then(res => {
                //
                // succesfully registered
                //

                self.setState({
                    registerSuccess: true,
                    loginUsername: registerObj.username
                });
            }).catch(error => {
                const { data, status, headers } = error.response;

                self.setError("register", data);
            });
    }

    handleLoginKeyPress (event) {
        const { charCode } = event;

        if (charCode === 13) {
            this.testLogin();
        } else {
            if (this.state.loginError) {
                this.setState({
                    loginError: false
                });
            }
        }
    }

    renderLogin () {
        const { 
            loginUsername, 
            loginError, 
            loginErrorText,
            showingRegistration
        } = this.state;

        return (
            <div className="login-wrapper" onKeyPress={(event) => this.handleLoginKeyPress(event)}>
                <div className="ui card">
                    <div className="content">
                        <div className="header">
                            Login to CardEngine
                        </div>

                        <form className="ui form">
                            <h3 className="error-text">{ loginError ? loginErrorText : "" }</h3>

                            <div className="form-item login-label-wrapper">
                                <span className="login-label"></span>
                            </div>

                            <div className="ui field">
                                <label>Username</label>
                                <input type="text" name="username" defaultValue={ loginUsername } />
                            </div>

                            <div className="ui field">
                                <label>Password</label>
                                <input type="password" name="password" />
                            </div>
                        </form>
                    </div>

                    <div className="extra content">
                        <div className="ui small fluid buttons">

                            <button
                                className="ui button primary"
                                type="button"
                                onClick={() => { this.testLogin() }}>Login</button>

                            <button
                                className="ui button secondary"
                                onClick={() => { this.setState({ showingRegistration: true}) }}
                                type="button">Register</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    renderRegistration () {
        const {
            registerError,
            registerErrorText,
            registerSuccess
        } = this.state;

        const controls = registerSuccess ? <div className="controls-wrapper"/> : (
            <div className="field controls-wrapper">
                <div className="field">
                    <label>Username</label>
                    <input type="text" name="username" defaultValue="jeef"/>
                </div>

                <div className="field">
                    <label>Password</label>
                    <input type="password" name="password" defaultValue="ezez"/>
                </div>

                <div className="field">
                    <label>Full Name</label>
                    <input type="text" name="fullname" defaultValue="Jeef"/>
                </div>
            </div>
        );

        const buttons = (
            <button
                className="ui primary button"
                onClick={() => { this.registerUser() }}
                type="button">Register</button>

        );

        return (
            <div className="register-wrapper">
                <div className="ui card">
                    <div className="content">
                        <div className="header">
                            User Registration
                        </div>

                        <form className="ui form">
                            <div className="form-item register-label-wrapper">
                                <RegisterLabel
                                    registerSuccess={registerSuccess}
                                    registerError={registerError}
                                    registerErrorText={registerErrorText} />
                            </div>

                            { controls }
                        </form>
                    </div>

                    <div className="content extra">
                        <div className="ui small fluid buttons">
                            { buttons }
                            <button
                                className="ui button secondary"
                                onClick={() => { this.setState({ showingRegistration: false }) }}
                                type="button">Back</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    render () {
        const { 
            user, 
            loginError, 
            loginErrorText,
            showingRegistration
        } = this.state;

        return showingRegistration ? 
            this.renderRegistration() : this.renderLogin();
    }
}

export default LoginPage
