import React, { Component } from "react";

import "./Auth.css";
import AuthContext from "../components/context/auth-context";

class AuthPage extends Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = { isLogin: true };
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();
        this.switchIsLogin = this.switchIsLogin.bind(this);
    }
    switchIsLogin() {
        this.setState((pervState) => ({
            isLogin: !pervState.isLogin,
        }));
    }
    submitHandler = async (event) => {
        event.preventDefault();
        const email = this.emailEl.current.value;
        const password = this.passwordEl.current.value;
        if (email.trim().length === 0 || password.trim().length === 0) return;
        var requestBody;
        if (!this.state.isLogin) {
            requestBody = {
                query: `
                    mutation {
                        createUser(userInput: { email:"${email}", password:"${password}"}) {
                            _id
                            email
                        }
                    }
                `,
            };
        } else {
            requestBody = {
                query: `
                    query {
                        login(email: "${email}", password: "${password}") {
                            userId
                            token
                            tokenExpiration
                        }
                    }
                `,
            };
        }

        const res = await fetch(
            "https://eventsbookingapp.herokuapp.com/graphql",
            {
                method: "POST",
                body: JSON.stringify(requestBody),
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        if (res) {
            if (res.status !== 200 && res.status !== 201)
                throw new Error("Failed Login or Signup!");
            const resData = await res.json();
            if (resData) {
                console.log("submit signup data", resData);
                // const { userId, token, tokenExpiration } = resData.data.login;
                // this.context.login(userId, token, tokenExpiration);
            } else {
                // this.context.login()
            }
        }
    };

    render() {
        return (
            <form className="auth-form" onSubmit={this.submitHandler}>
                <h1>{this.state.isLogin ? "Login" : "Signup"}</h1>
                {/* I know I did this but it felt eashy. hehe. */}
                <div className="form-control">
                    <label htmlFor="email">E-mail</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        ref={this.emailEl}
                        defaultValue="a@a.a"
                    />
                </div>
                <div className="form-control">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        ref={this.passwordEl}
                        defaultValue="aaa"
                    />
                </div>
                <div className="form-actions">
                    <button type="submit">Submit</button>
                    <button type="button" onClick={this.switchIsLogin}>
                        {this.state.isLogin ? "Signup" : "Login"}
                    </button>
                </div>
            </form>
        );
    }
}

export default AuthPage;
