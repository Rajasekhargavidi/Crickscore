import React, { Component } from "react";
import moment from "moment";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { addScoreToMatch } from "../../store/actions/matches";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import "react-bootstrap-typeahead/css/Typeahead-bs4.css";

import LiveScorecard from "./LiveScorecard";

import { find, floor, isEmpty, round } from "lodash";

class Console extends Component {
  state = {
    newBatsman: {},
    newBowler: {},
    overCompleted: false,
    extra: false,
    boundary: false,
    out: false,
    extraType: "",
    whoIsOut: ""
  };
  handleRunClick = e => {
    const { score } = this.props;
    let currentRun = e.target.innerHTML;
    let currentBall = parseInt(score.ball) + 1;
    if (
      e.target.className ===
      "col current-run bg-white text-dark align-middle mx-2 p-1"
    ) {
      e.target.className =
        "col current-run text-white align-middle mx-2 p-1 bg-success";
    } else {
      e.target.className =
        "col current-run bg-white text-dark align-middle mx-2 p-1";
    }

    this.setState({
      runs: parseInt(currentRun),
      ball: currentBall
    });
  };
  handleExtra = e => {
    console.log(e.target.id);
    const { score } = this.props;
    if (
      e.target.className ===
      "col border border-dark shadow bg-white mx-5 my-1 text-capitalize"
    ) {
      e.target.className =
        "col border border-dark shadow bg-success text-white mx-5 my-1 text-capitalize";
    } else {
      e.target.className =
        "col border border-dark shadow bg-white mx-5 my-1 text-capitalize";
    }
    this.setState({
      currentExtra: e.target.innerHTML
    });
  };
  handleOut = e => {
    const { score } = this.props;
    console.log(e.target.id);
    if (
      e.target.className ===
      "col border border-dark shadow bg-white mx-5 my-1 text-capitalize"
    ) {
      e.target.className =
        "col border border-dark shadow bg-success text-white mx-5 my-1 text-capitalize";
    } else {
      e.target.className =
        "col border border-dark shadow bg-white mx-5 my-1 text-capitalize";
    }
    this.setState({
      currentOut: e.target.innerHTML
    });
  };

  handleScore = () => {
    const { score, currentMatch, bowler, striker, nonStriker } = this.props;
    const { runs, ball } = this.state;
    let currentOver = floor(ball / 6) + "." + (ball % 6);
    let payload = this.state;
    console.log("dispatch create score here");
    let lastSixBalls = score.lastSixBalls;
    if (lastSixBalls.length === 6) {
      lastSixBalls.pop();
    }
    let overCompleted = false;
    let localStriker = striker;
    let localBowler = bowler;
    localStriker = {
      ...localStriker,
      balls: localStriker.balls + 1,
      runs: localStriker.runs + runs
    };
    console.log(localStriker);
    localBowler = {
      ...localBowler,
      balls: bowler.balls + 1,
      runs: bowler.runs + runs
    };
    if (ball % 6 === 0) {
      overCompleted = true;
    }
    lastSixBalls.unshift({
      over: currentOver,
      event: runs
    });
    let totalRuns = parseInt(score.totalRuns) + parseInt(runs);
    let totalWickets = score.totalWickets;
    let nextStriker = localStriker;
    let nextNonStriker = nonStriker;
    if (ball % 6 === 0 || runs % 2 !== 0) {
      nextStriker = nonStriker;
      nextNonStriker = localStriker;
    }
    console.log(striker);
    // run rate = totalRuns*6/totalBalls;
    let CRR = round((totalRuns * 6) / ball, 2);
    let EXP = floor(CRR * parseInt(currentMatch[0].overs));
    payload = {
      ...payload,
      CRR,
      EXP,
      currentOver,
      striker: nextStriker,
      nonStriker: nextNonStriker,
      bowler: localBowler,
      totalRuns,
      totalWickets,
      lastSixBalls,
      overCompleted,
      newBowler: {},
      newBatsman: {}
    };
    this.props.addScoreToMatch(payload, "firstInningsScore");
  };

  handleStrike = () => {
    const { score } = this.props;
    console.log("dispatch update player here");
  };

  handleBowler = () => {
    const { score } = this.props;
    console.log("dispatch update player here");
  };

  handleInnings = () => {
    const { score } = this.props;
    console.log("dispatch update player here");
  };

  lastSixBalls = lastSixBalls =>
    lastSixBalls.length !== 0 &&
    lastSixBalls.map((ball, i) => (
      <div key={i} className="col text-center p-1">
        <div className="score-label">{ball.over}</div>
        <div className="ball-values bg-white border border-light text-uppercase">
          {ball.event}
        </div>
      </div>
    ));

  render() {
    const { currentMatch, score, striker, bowler, nonStriker } = this.props;
    if (currentMatch && score) {
      if (score.overCompleted && isEmpty(score.newBowler)) {
        return <Redirect to={`/match/${currentMatch[0].id}/addBowler`} />;
      }
      return (
        <div className="my-2">
          {/* top panel */}
          <div className="container">
            <div className="row text-center px-4">
              <div className="col-3 bg-danger text-white p-1">
                <div className="score-label text-uppercase">score</div>
                <div className="score-values">
                  {score.totalRuns}/{score.totalWickets}
                </div>
              </div>
              <div className="col-6 p-1 bg-light">
                <div className="score-label text-uppercase">crr</div>
                <div className="score-values">{score.CRR}</div>
              </div>
              <div className="col-3 bg-danger text-white p-1">
                <div className="score-label text-uppercase">overs</div>
                <div className="score-values">
                  {score.currentOver}/{currentMatch[0].overs}
                </div>
              </div>
            </div>
            <div className="row my-1 px-4">
              <div className="col bg-light">
                <div className="row">
                  <div className="col-3 text-uppercase p-1">
                    <img
                      src={
                        "https://static.thenounproject.com/png/635343-200.png"
                      }
                      alt="Bat"
                      className="img-fluid"
                    />
                  </div>
                  <div className="col-9 text-capitalize text-truncate border-right p-1">
                    {striker && striker.name}
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="row bg-light">
                  <div className="col-9 text-capitalize text-truncate p-1">
                    {bowler && bowler.name}
                  </div>
                  <div className="col-3 text-uppercase p-1">
                    <img
                      src={
                        "https://static.thenounproject.com/png/866374-200.png"
                      }
                      alt="Bat"
                      className="img-fluid"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row my-1 px-4">
              <div className="col-3 text-uppercase bg-danger text-light innings-col">
                {currentMatch[0].currentInnings === "FIRST_INNINGS"
                  ? "1st"
                  : "2nd"}{" "}
                Inn
              </div>
              <div className="col-9 bg-light">
                <div className="score-label text-uppercase">exp runs</div>
                <div className="score-values">{score.EXP}</div>
              </div>
            </div>
            <div className="row my-1 py-1 px-4">
              {this.lastSixBalls(score.lastSixBalls)}
            </div>
          </div>
          {/* runs panel */}
          <div className="bg-secondary text-white p-3">
            <div className="row">
              <div className="score-label text-center text-uppercase col-12 mb-2">
                runs
              </div>
              <div className="text-center col-12">
                <span
                  onClick={this.handleRunClick}
                  id="runZero"
                  className="col current-run bg-white text-dark align-middle mx-2 p-1"
                >
                  0
                </span>
                <span
                  onClick={this.handleRunClick}
                  id="runOne"
                  className="col current-run bg-white text-dark align-middle mx-2 p-1"
                >
                  1
                </span>
                <span
                  onClick={this.handleRunClick}
                  id="runTwo"
                  className="col current-run bg-white text-dark align-middle mx-2 p-1"
                >
                  2
                </span>
                <span
                  onClick={this.handleRunClick}
                  id="runThree"
                  className="col current-run bg-white text-dark align-middle mx-2 p-1"
                >
                  3
                </span>
                <span
                  onClick={this.handleRunClick}
                  id="runFour"
                  className="col current-run bg-white text-dark align-middle mx-2 p-1"
                >
                  4
                </span>
                <span
                  onClick={this.handleRunClick}
                  id="runFive"
                  className="col current-run bg-white text-dark align-middle mx-2 p-1"
                >
                  5
                </span>
                <span
                  onClick={this.handleRunClick}
                  id="runSix"
                  className="col current-run bg-white text-dark align-middle mx-2 p-1"
                >
                  6
                </span>
              </div>
            </div>
            <hr />
            <div className="row text-center score-label">
              <div className="col">extra</div>
              <div className="col">wicket</div>
            </div>
            <div className="row text-center text-dark">
              <div
                id="wide"
                onClick={this.handleExtra}
                className="col border border-dark shadow bg-white mx-5 my-1 text-capitalize"
              >
                wide
              </div>
              <div
                id="out"
                onClick={this.handleOut}
                className="col border border-dark shadow bg-white mx-5 my-1 text-capitalize"
              >
                out
              </div>
            </div>
            <div className="row text-center text-dark">
              <div
                id="noBall"
                onClick={this.handleExtra}
                className="col border border-dark shadow bg-white mx-5 my-1 text-capitalize"
              >
                no ball
              </div>
              <div
                id="runOut"
                onClick={this.handleOut}
                className="col border border-dark shadow bg-white mx-5 my-1 text-capitalize"
              >
                run out
              </div>
            </div>
            <div className="row text-center text-dark">
              <div
                id="byes"
                onClick={this.handleExtra}
                className="col border border-dark shadow bg-white mx-5 my-1 text-capitalize"
              >
                byes
              </div>
              <div
                id="caughtOut"
                onClick={this.handleOut}
                className="col border border-dark shadow bg-white mx-5 my-1 text-capitalize"
              >
                caught out
              </div>
            </div>
            <div className="row text-center text-dark">
              <div
                id="legByes"
                onClick={this.handleExtra}
                className="col border border-dark shadow bg-white mx-5 my-1 text-capitalize"
              >
                leg byes
              </div>
              <div
                id="retiredHurt"
                onClick={this.handleOut}
                className="col border border-dark shadow bg-white mx-5 my-1 text-capitalize"
              >
                retired hurt
              </div>
            </div>
            <div className="row text-center text-dark">
              <div
                id="noExtra"
                onClick={this.handleExtra}
                className="col border border-dark shadow bg-white mx-5 my-1 text-capitalize"
              >
                no extra
              </div>
              <div
                id="notOut"
                onClick={this.handleOut}
                className="col border border-dark shadow bg-white mx-5 my-1 text-capitalize"
              >
                not out
              </div>
            </div>
          </div>
          {/* score submit */}
          <div className="container mt-2">
            <button
              onClick={this.handleScore}
              className="btn btn-block btn-success text-uppercase"
            >
              Submit
            </button>
          </div>
          {/* change player panel */}
          <div className="container mt-2">
            <div className="row">
              <div className="col">
                <button
                  onClick={this.handleStrike}
                  className="btn btn-success text-uppercase"
                >
                  Change strike
                </button>
              </div>
              <div className="col">
                <button
                  onClick={this.handleBowler}
                  className="btn btn-warning text-uppercase"
                >
                  Change bowler
                </button>
              </div>
              <div className="col">
                <button
                  onClick={this.handleInnings}
                  className="btn btn-danger text-uppercase"
                >
                  end innings
                </button>
              </div>
            </div>
          </div>
          {/* live scorecard */}
          <LiveScorecard
            striker={striker}
            nonStriker={nonStriker}
            bowler={bowler}
          />
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
  let striker = {};
  let bowler = {};
  let nonStriker = {};
  let currentMatch = state.firestore.ordered.matches;
  let score;
  if (currentMatch) {
    if (currentMatch[0].currentInnings === "FIRST_INNINGS") {
      score = state.firestore.ordered.firstInningsScore;
    } else {
      score = state.firestore.ordered.firstInningsScore;
    }
    if (score) {
      score = score[0];
      striker = score.striker;
      bowler = score.bowler;
      nonStriker = score.nonStriker;
      if (!isEmpty(score.newBowler)) {
        bowler = score.newBowler;
      }
    }
  }
  return {
    auth: state.firebase.auth,
    currentMatch: state.firestore.ordered.matches,
    score: score,
    bowler: bowler,
    striker: striker,
    nonStriker: nonStriker
  };
};
const mapDispatchToProps = dispatch => {
  return {
    addScoreToMatch: (score, whichCollection) =>
      dispatch(addScoreToMatch(score, whichCollection))
  };
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  firestoreConnect(props => [
    { collection: "matches", doc: props.match.params.matchId },
    {
      collection: "matches",
      doc: props.match.params.matchId,
      subcollections: [{ collection: "firstInningsBatting" }],
      storeAs: "firstInningsBatting"
    },
    {
      collection: "matches",
      doc: props.match.params.matchId,
      subcollections: [{ collection: "firstInningsBowling" }],
      storeAs: "firstInningsBowling"
    },
    {
      collection: "matches",
      doc: props.match.params.matchId,
      subcollections: [{ collection: "secondInningsBatting" }],
      storeAs: "secondInningsBatting"
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
)(Console);
