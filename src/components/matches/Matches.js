import React, { Component } from "react";
import LiveMatches from "./LiveMatches";

import { connect } from "react-redux";
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import { firestoreConnect } from "react-redux-firebase";

class Matches extends Component {
  render() {
    const { matches, auth } = this.props;
    if (!auth.uid) {
      return <Redirect to="/signIn" />;
    }
    return (
      <div className="dashboard container">
        <div className="row">
          <div className="col">
            <h1>Matches</h1>
            <LiveMatches matches={matches} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  console.log(state);
  return {
    matches: state.firestore.ordered.matches,
    auth: state.firebase.auth
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect([{ collection: "matches", orderBy: ["createdAt", "desc"] }])
)(Matches);
