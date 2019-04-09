import React, { Component } from "react";
import LiveMatches from "../matches/LiveMatches";

import { connect } from "react-redux";
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import { firestoreConnect } from "react-redux-firebase";

class Home extends Component {
  render() {
    const { matches, auth } = this.props;
    return (
      <div className="dashboard container">
        <div className="row">
          <div className="col">
            <h1 className="mt-3">
              Matches{" "}
              <a
                className="btn btn-primary btn-sm float-right"
                href="/newMatch"
              >
                New Match
              </a>
            </h1>
            <LiveMatches matches={matches} auth={auth} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    matches: state.firestore.ordered.matches,
    auth: state.firebase.auth
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect([{ collection: "matches", orderBy: ["createdAt", "desc"] }])
)(Home);
