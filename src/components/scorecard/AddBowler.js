import React, { Component } from "react";
import moment from "moment";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import {
  getTeamPlayers,
  addBowler,
  overStart,
  overComplete,
  updateScore
} from "../../store/actions/matches";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import "react-bootstrap-typeahead/css/Typeahead-bs4.css";
import { has, startCase, toLower, find } from "lodash";

class AddBowler extends Component {
  state = {
    bowler: {
      id: "",
      name: "",
      teamName: "",
      teamId: "",
      onStrike: true,
      bowlingOrder: 1,
      balls: 0,
      wickets: 0,
      wides: 0,
      noBalls: 0,
      runs: 0,
      dots: 0,
      byes: 0,
      fours: 0,
      sixes: 0,
      eco: 0
    }
  };
  handleSubmit = e => {
    e.preventDefault();
    const {
      currentMatch,
      firstInningsBowling,
      secondInningsBowling,
      firstInningsScore,
      secondInningsScore
    } = this.props;
    const { bowler } = this.state;
    console.log(firstInningsBowling);
    console.log(bowler);
    var alreadyExists = find(firstInningsBowling, { id: bowler.id });
    console.log(alreadyExists);
    if (alreadyExists === undefined) {
      this.props.addBowler({
        ...bowler,
        bowlingOrder: firstInningsBowling.length + 1
      });
    } else {
      let scoreCollection = "secondInningsScore";
      console.log(secondInningsScore);
      console.log(firstInningsScore);
      let score = secondInningsScore.length && secondInningsScore[0];
      if (currentMatch[0].currentInnings === "FIRST_INNINGS") {
        scoreCollection = "firstInningsScore";
        score = firstInningsScore.length && firstInningsScore[0];
      }
      console.log(score);
      this.props.updateScore(
        { ...score, newBowler: alreadyExists },
        scoreCollection
      );
    }
    return this.props.history.push(`/match/${currentMatch[0].id}/score`);
  };

  componentWillMount() {
    this.props.overComplete();
  }

  componentDidUpdate(previousProps, previousState) {
    const { currentMatch, overCompleted, bowlingTeam } = this.props;
    console.log(overCompleted);
    console.log(previousProps.overCompleted);
    if (previousProps.bowlingTeam !== bowlingTeam) {
      console.log(currentMatch);
      if (currentMatch) {
        if (currentMatch[0].currentInnings === "FIRST_INNINGS") {
          this.props.getTeamPlayers(currentMatch[0].firstBowlingId, "bowling");
        }
        if (currentMatch[0].currentInnings === "SECOND_INNINGS") {
          this.props.getTeamPlayers(currentMatch[0].secondBowlingId, "bowling");
        }
      }
    }
  }
  render() {
    const { auth, bowlingSquad, currentMatch } = this.props;
    if (!auth.uid) {
      return <Redirect to="/signIn" />;
    }
    if (currentMatch) {
      let bowlingTeam, bowlingTeamId;
      if (
        (currentMatch[0].batting === "teamOne" &&
          currentMatch[0].currentInnings === "FIRST_INNINGS") ||
        (currentMatch[0].batting === "teamTwo" &&
          currentMatch[0].currentInnings === "SECOND_INNINGS")
      ) {
        bowlingTeam = currentMatch[0].teamTwo;
        bowlingTeamId = currentMatch[0].teamTwoId;
      }
      if (
        (currentMatch[0].batting === "teamOne" &&
          currentMatch[0].currentInnings === "SECOND_INNINGS") ||
        (currentMatch[0].batting === "teamTwo" &&
          currentMatch[0].currentInnings === "FIRST_INNINGS")
      ) {
        bowlingTeam = currentMatch[0].teamOne;
        bowlingTeamId = currentMatch[0].teamOneId;
      }
      return (
        <div className="container">
          <form onSubmit={this.handleSubmit} autoComplete="off">
            <div>
              <span>{currentMatch[0].currentInnings}</span>
              <span className="float-right">
                {moment().format("MMMM Do, h:mm a")}
              </span>
            </div>
            <h5 className="bg-dark text-light p-2">
              {currentMatch[0].teamOne}
              {currentMatch[0].toss === "teamOne" ? "(T)" : ""} vs{" "}
              {currentMatch[0].teamTwo}
              {currentMatch[0].toss === "teamTwo" ? "(T)" : ""}
            </h5>
            <hr />
            <h5>{bowlingTeam}</h5>
            <div className="form-group row">
              <label htmlFor="bowler" className="col-sm-2 col-form-label">
                Bowler
              </label>
              <div className="col-sm-10">
                <Typeahead
                  labelKey="name"
                  onChange={selected => {
                    console.log(selected);
                    if (selected.length) {
                      let bowlerId;
                      if (has(selected[0], "customOption")) {
                        bowlerId = "";
                      } else {
                        bowlerId = selected[0].id;
                      }
                      this.setState({
                        bowler: {
                          id: bowlerId,
                          name: startCase(toLower(selected[0].name)),
                          teamName: bowlingTeam,
                          teamId: bowlingTeamId,
                          onStrike: true,
                          bowlingOrder: 2,
                          balls: 0,
                          wickets: 0,
                          wides: 0,
                          noBalls: 0,
                          runs: 0,
                          dots: 0,
                          byes: 0,
                          fours: 0,
                          sixes: 0,
                          eco: 0
                        }
                      });
                    }
                  }}
                  allowNew={true}
                  options={bowlingSquad !== undefined ? bowlingSquad : []}
                  filterBy={["name"]}
                  placeholder="Choose bowler..."
                />
              </div>
            </div>
            <div className="form-group row">
              <div className="col-sm-10">
                <button className="btn btn-primary">Add Player</button>
              </div>
            </div>
          </form>
        </div>
      );
    } else {
      return (
        <div className="container center">
          <p>Loading...</p>
        </div>
      );
    }
  }
}

const mapStateToProps = state => {
  console.log(state);
  let currentMatch = state.firestore.ordered.matches;
  let bowlingSquad;
  if (currentMatch) {
    currentMatch = currentMatch[0];
    let teamId = currentMatch.firstBowlingId;
    if (currentMatch.currentInnings === "SECON_INNINGS") {
      let teamId = currentMatch[0].secondBowlingId;
    }
    bowlingSquad = find(state.firestore.ordered.teams, { id: teamId });
    console.log(bowlingSquad);
  }

  return {
    auth: state.firebase.auth,
    currentMatch: state.firestore.ordered.matches,
    bowlingSquad: state.matches.bowlingSquad,
    firstInningsBowling: state.firestore.ordered.firstInningsBowling,
    secondInningsBowling: state.firestore.ordered.secondInningsBowling,
    firstInningsScore: state.firestore.ordered.firstInningsScore,
    secondInningsScore: state.firestore.ordered.secondInningsScore,
    overCompleted: state.matches.overCompleted,
    bowlingTeam: bowlingSquad
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getTeamPlayers: (teamId, teamAction) =>
      dispatch(getTeamPlayers(teamId, teamAction)),
    addBowler: bowler => dispatch(addBowler(bowler)),
    overStart: () => dispatch(overStart()),
    overComplete: () => dispatch(overComplete()),
    updateScore: (score, whichCollection) =>
      dispatch(updateScore(score, whichCollection))
  };
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  firestoreConnect(props => [
    { collection: "matches", doc: props.match.params.matchId },
    { collection: "teams" },
    {
      collection: "matches",
      doc: props.match.params.matchId,
      subcollections: [{ collection: "firstInningsBowling" }],
      storeAs: "firstInningsBowling"
    },
    {
      collection: "matches",
      doc: props.match.params.matchId,
      subcollections: [{ collection: "secondInningsBowling" }],
      storeAs: "secondInningsBowling"
    },
    {
      collection: "matches",
      doc: props.match.params.matchId,
      subcollections: [
        {
          collection: "firstInningsScore",
          orderBy: ["createdAt", "desc"],
          limit: 1
        }
      ],
      storeAs: "firstInningsScore"
    },
    ,
    {
      collection: "matches",
      doc: props.match.params.matchId,
      subcollections: [
        {
          collection: "secondInningsScore",
          orderBy: ["createdAt", "desc"],
          limit: 1
        }
      ],
      storeAs: "secondInningsScore"
    }
  ])
)(AddBowler);
