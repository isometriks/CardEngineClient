import React, { Component } from 'react';


class LoginPage extends Component {
    constructor(props) {
      super(props);

      this.state = {
        user: {}
      };
    }

    setUser (user) {
        localStorage.setItem("user", JSON.stringify(user));

        this.setState({
            user: user
        });
    }

    testLogin () {
        console.log("testing login");
        
        const userObj = {
            username: "jeef",
            isGreat: "totes"
        };

        this.setUser(userObj);
        this.props.history.push("/home");
    }

    render () {
        const { user } = this.state;

        return (
            <div class="login-wrapper">
                <h2>Login to CardEngine</h2>

                <h3>User: {user.username}</h3>

                <div class="form-item login-label-wrapper">
                    <span class="login-label"></span>
                </div>

                <div class="form-item login-user">
                    Username: <input type="text" name="username" value="jeef"></input>
                </div>

                <div class="form-item login-password">
                    Password: <input type="password" name="password" value="hello1"></input>
                </div>

                <div class="form-item login-submit">
                    <button 
                      type="button"
                      onClick={() => { this.testLogin() }}>Login</button>
                </div>

                <div class="form-item show-register-submit">
                    <button type="button">Register</button>
                </div>

                <div class="form-item hack">
                    <button type="button">Register + Login</button>
                </div>
            </div>
        )
    }
}

export default LoginPage
