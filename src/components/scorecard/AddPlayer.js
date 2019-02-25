import React, { Component } from "react";
import moment from "moment";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { getTeamPlayers, addPlayers } from "../../store/actions/matches";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import "react-bootstrap-typeahead/css/Typeahead-bs4.css";
import { has, startCase, toLower } from "lodash";

class AddPlayer extends Component {
  state = {
    striker: {
      id: "",
      name: "",
      teamName: "",
      teamId: "",
      onStrike: true,
      battingOrder: 1
    },
    nonStriker: {
      id: "",
      name: "",
      teamName: "",
      teamId: "",
      onStrike: true,
      battingOrder: 2
    },
    bowler: {
      id: "",
      name: "",
      teamName: "",
      teamId: "",
      onStrike: true,
      bowlingOrder: 1
    }
  };
  handleSubmit = e => {
    e.preventDefault();
    const { currentMatch } = this.props;
    const { striker, nonStriker, bowler } = this.state;
    console.log(striker);
    console.log(nonStriker);
    console.log(bowler);
    this.props.addPlayers(striker, nonStriker, bowler);
    this.props.history.push(`/match/${currentMatch[0].id}/score`);
  };

  componentDidUpdate(previousProps, previousState) {
    const { currentMatch } = this.props;
    if (previousProps.currentMatch !== currentMatch) {
      if (currentMatch) {
        this.props.getTeamPlayers(currentMatch[0].firstBattingId, "batting");
        this.props.getTeamPlayers(currentMatch[0].firstBowlingId, "bowling");
      }
    }
  }
  render() {
    const { auth, bowlingSquad, battingSquad, currentMatch } = this.props;
    if (!auth.uid) {
      return <Redirect to="/signIn" />;
    }
    if (currentMatch) {
      let battingTeam, battingTeamId, bowlingTeam, bowlingTeamId;
      if (currentMatch[0].currentInnings === "FIRST_INNINGS") {
        battingTeam = currentMatch[0].firstBatting;
        battingTeamId = currentMatch[0].firstBattingId;
        bowlingTeam = currentMatch[0].firstBowling;
        bowlingTeamId = currentMatch[0].firstBowlingId;
      }
      if (currentMatch[0].currentInnings === "SECOND_INNINGS") {
        battingTeam = currentMatch[0].secondBatting;
        battingTeamId = currentMatch[0].secondBattingId;
        bowlingTeam = currentMatch[0].secondBowling;
        bowlingTeamId = currentMatch[0].secondBowlingId;
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
            <h5>{battingTeam}</h5>
            <div className="form-group row">
              <label htmlFor="striker" className="col-sm-2 col-form-label">
                Striker
              </label>
              <div className="col-sm-10">
                <Typeahead
                  labelKey="name"
                  onChange={selected => {
                    if (selected.length) {
                      let strikerId;
                      if (has(selected[0], "customOption")) {
                        strikerId = "";
                      } else {
                        strikerId = selected[0].id;
                      }
                      this.setState({
                        striker: {
                          id: strikerId,
                          name: startCase(toLower(selected[0].name)),
                          teamName: battingTeam,
                          teamId: battingTeamId,
                          onStrike: true,
                          battingOrder: 1,
                          balls: 0,
                          runs: 0,
                          dots: 0,
                          fours: 0,
                          sixes: 0,
                          sr: 0
                        }
                      });
                    }
                  }}
                  allowNew={true}
                  options={battingSquad !== undefined ? battingSquad : []}
                  filterBy={["name"]}
                  placeholder="Choose striker..."
                />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="nonStriker" className="col-sm-2 col-form-label">
                Non Striker
              </label>
              <div className="col-sm-10">
                <Typeahead
                  labelKey="name"
                  onChange={selected => {
                    if (selected.length) {
                      let nonStrikerId;
                      if (has(selected[0], "customOption")) {
                        nonStrikerId = "";
                      } else {
                        nonStrikerId = selected[0].id;
                      }
                      this.setState({
                        nonStriker: {
                          id: nonStrikerId,
                          name: startCase(toLower(selected[0].name)),
                          teamName: battingTeam,
                          teamId: battingTeamId,
                          onStrike: false,
                          battingOrder: 2,
                          balls: 0,
                          runs: 0,
                          dots: 0,
                          fours: 0,
                          sixes: 0,
                          sr: 0
                        }
                      });
                    }
                  }}
                  allowNew={true}
                  options={battingSquad !== undefined ? battingSquad : []}
                  filterBy={["name"]}
                  placeholder="Choose non striker..."
                />
              </div>
            </div>
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
                          eco: 0.0
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
                <button className="btn btn-primary">Add Players</button>
              </div>
            </div>
          </form>
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

const mapStateToProps = state => {
  console.log(state);
  return {
    auth: state.firebase.auth,
    currentMatch: state.firestore.ordered.matches,
    bowlingSquad: state.matches.bowlingSquad,
    battingSquad: state.matches.battingSquad
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getTeamPlayers: (teamId, teamAction) =>
      dispatch(getTeamPlayers(teamId, teamAction)),
    addPlayers: (striker, nonStriker, bowler) =>
      dispatch(addPlayers(striker, nonStriker, bowler))
  };
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  firestoreConnect(props => [
    { collection: "matches", doc: props.match.params.matchId }
  ])
)(AddPlayer);
