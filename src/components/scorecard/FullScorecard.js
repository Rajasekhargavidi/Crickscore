import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import { firestoreConnect } from "react-redux-firebase";
import moment from "moment";

class FullScorecard extends Component {
  componentWillMount() {
    console.log(this.props.match.params.matchId);
  }
  componentDidMount() {
    console.log(this.props.match.params.matchId);
  }

  render() {
    const { auth, currentMatch } = this.props;
    if (!auth.uid) {
      return <Redirect to="/signIn" />;
    }
    if (currentMatch) {
      return (
        <div className="container match-details">
          <div className="card">
            <div className="card-content">
              <span className="card-title">{currentMatch.id}</span>
              <p>Match Content</p>
            </div>
            <div className="card-content">
              <div>Posted By something</div>
              <div>Time</div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="container center">
          <p>Loading Project...</p>
        </div>
      );
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  const id = ownProps.match.params.matchId;
  const matches = state.firestore.data.matches;
  const match = matches ? matches[id] : null;
  console.log(matches);
  console.log(id);
  console.log(match);
  return {
    auth: state.firebase.auth,
    currentMatch: match
  };
};
export default compose(
  connect(mapStateToProps),
  firestoreConnect(props => [
    { collection: "matches", doc: props.match.params.matchId }
  ])
)(FullScorecard);
