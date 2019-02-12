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
import AddPlayer from "./components/scorecard/AddPlayer";
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
            <Route path="/newMatch" component={NewMatch} />
            <Route path="/matches" component={Matches} />
            <Route path="/addPlayers" component={AddPlayers} />
            <Route path="/match/:matchId/scorecard" component={FullScorecard} />
            <Route path="/match/:matchId/score" component={Console} />
            <Route path="/match/:matchId/addPlayer" component={AddPlayer} />
          </Switch>
          <Footer />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
