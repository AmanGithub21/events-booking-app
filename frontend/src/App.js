import "./App.css";
import React, { Component } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

import AuthPage from "./pages/Auth";
import BookingsPage from "./pages/Bookings";
import EventsPage from "./pages/Events";
import MainNavigation from "./components/Navigation/MainNavigation";
import AuthContext from "./components/context/auth-context";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = { userId: null, token: null };
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }
    login(userId, token, tokenExpiration) {
        this.setState({ token: token, userId: userId });
    }
    logout() {
        this.setState({ token: null, userId: null });
    }
    render() {
        return (
            <BrowserRouter>
                <AuthContext.Provider
                    value={{
                        userId: this.state.userId,
                        token: this.state.token,
                        login: this.login,
                        logout: this.logout,
                    }}
                >
                    <MainNavigation />
                    <main className="main-content">
                        <Switch>
                            {this.state.token && (
                                <Route
                                    path="/auth"
                                    render={() => <Redirect to="/events" />}
                                    exact
                                />
                            )}
                            {this.state.token && (
                                <Route
                                    path="/"
                                    render={() => <Redirect to="/events" />}
                                    exact
                                />
                            )}
                            {!this.state.token && (
                                <Route
                                    path="/auth"
                                    component={AuthPage}
                                    exact
                                />
                            )}
                            <Route
                                path="/events"
                                component={EventsPage}
                                exact
                            />
                            {this.state.token && (
                                <Route
                                    path="/bookings"
                                    component={BookingsPage}
                                    exact
                                />
                            )}
                            {!this.state.token && (
                                <Route
                                    render={() => <Redirect to="/auth" />}
                                    exact
                                />
                            )}
                        </Switch>
                    </main>
                </AuthContext.Provider>
            </BrowserRouter>
        );
    }
}

export default App;
