import React, { Component } from 'react';

import axios from 'axios';

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

        axios.post("http://192.168.99.100:8081/login", userObj)
            .then(res => {
                this.setUser(userObj);
                this.props.history.push("/home");
            }).catch(error => {
                if (error.response) {
                    const { data, status, headers } = error.response;

                    if (status === 422) {
                        self.setError("login", "Enter username / password");
                        return;
                    }
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

        axios.post("http://192.168.99.100:8081/register", registerObj)
            .then(res => {
                self.setState({
                    loginUsername: registerObj.username
                });

                self.setState({
                    registerSuccess: true
                });
            }).catch(error => {
                const { data, status, headers } = error.response;

                self.setError("register", data);
            });
    }

    renderLogin () {
        const { 
            loginUsername, 
            loginError, 
            loginErrorText,
            showingRegistration
        } = this.state;

        return (
            <div className="login-wrapper">
                <h2>Login to CardEngine</h2>
                <h3 className="error-text">{ loginError ? loginErrorText : "" }</h3>

                <div className="form-item login-label-wrapper">
                    <span className="login-label"></span>
                </div>
                <div className="form-item login-user">
                    Username: <input type="text" name="username" defaultValue={ loginUsername } />
                </div>
                <div className="form-item login-password">
                    Password: <input type="password" name="password" />
                </div>
                <div className="form-item login-submit">
                    <button 
                      type="button"
                      onClick={() => { this.testLogin() }}>Login</button>
                </div>
                <div className="form-item show-register-submit">
                    <button 
                      onClick={() => { this.setState({ showingRegistration: true}) }} 
                      type="button">Register</button>
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
            <div className="controls-wrapper">
                <div className="form-item register-user">
                    Username: <input type="text" name="username" defaultValue="jeef"/>
                </div>
                <div className="form-item register-password">
                    Password: <input type="password" name="password" defaultValue="ezpz"/>
                </div>
                <div className="form-item register-fullname">
                    Full name: <input type="text" name="fullname" defaultValue="Jeef"/>
                </div>
                <div className="form-item register-submit">
                    <button 
                      onClick={() => { this.registerUser() }}
                      type="button">Register</button>
                </div>
            </div>
        );

        return (
            <div className="register-wrapper">
                <h2>User Registration</h2>

                <div className="form-item register-label-wrapper">
                    <RegisterLabel 
                      registerSuccess={registerSuccess}
                      registerError={registerError}
                      registerErrorText={registerErrorText} />
                </div>

                { controls }

                <div className="form-item back-submit">
                    <button 
                      onClick={() => { this.setState({ showingRegistration: false }) }}
                      type="button">Back</button>
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
