import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./components/landing/Home";
import NewMatch from "./components/matches/CreateMatch";
import Matches from "./components/matches/Matches";
import AddPlayers from "./components/matches/AddPlayers";
import Console from "./components/scorecard/Console";
import FullScorecard from "./components/scorecard/FullScorecard";
import SignIn from "./components/auth/Signin";
import SignUp from "./components/auth/SignUp";
import Tournament from './components/landing/Tournament'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Navbar />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/" component={Tournament} />
            <Route path="/signin" component={SignIn} />
            <Route path="/signup" component={SignUp} />
            <Route path="/newMatch" component={NewMatch} />
            <Route path="/matches" component={Matches} />
            <Route path="/addPlayers" component={AddPlayers} />
            <Route path="/match/:matchId/scorecard" component={FullScorecard} />
            <Route path="/match/:matchId/score" component={Console} />
          </Switch>
          <Footer />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
