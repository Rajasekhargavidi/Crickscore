import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Home from "./components/landing/Home";

import SignIn from "./components/auth/Signin";
import SignUp from "./components/auth/SignUp";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Navbar />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/signin" component={SignIn} />
            <Route path="/signup" component={SignUp} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
