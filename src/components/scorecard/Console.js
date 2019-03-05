import React, { Component } from "react";
import moment from "moment";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import {
  addScoreToMatch,
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
import { runsJson, extrasJson, outJson } from "../../config/console";
import { calculateOvers, calculateEco, calculateSR } from "../../utils";

import LiveScorecard from "./LiveScorecard";
import BowlerModal from "./BowlerModal";
import OutModal from "./OutModal";

import { find, floor, isEmpty, round, map, findIndex } from "lodash";

class Console extends Component {
  state = {
    newBatsman: {},
    newBowler: {},
    overCompleted: false,
    extra: false,
    boundary: false,
    out: false,
    extraType: "",
    outType: "",
    whoIsOut: "",
    bowlerModal: false,
    outModal: false,
    ER: runsJson,
    EE: extrasJson,
    WK: outJson,
    currentEvent: "",
    runEvent: "",
    extraEvent: "",
    outEvent: "",
    extraRun: 0,
    batsmanBall: true,
    bowlerBall: true,
    bowlerWicket: false,
    ballCounted: true
  };

  componentDidUpdate(prevProps) {
    const { score } = this.props;
    console.log(this.props.score !== prevProps.score);
    if (score !== prevProps.score) {
      console.log(score.newBowler);
      console.log(score.overCompleted);
      if (score.overCompleted && isEmpty(score.newBowler)) {
        this.setState({ bowlerModal: true });
      }
    }
  }

  handleUIReset = localVariable => {
    localVariable = map(localVariable, l => {
      l.selected = false;
      return l;
    });
    return localVariable;
  };
  handleRunClick = eachRun => {
    console.log(eachRun);
    const { ER, currentEvent } = this.state;
    const { score } = this.props;
    let currentRun = eachRun.run;
    let localEr = this.handleUIReset(ER);
    let localIndex = findIndex(localEr, eachRun);
    localEr[localIndex].selected = true;
    this.setState({
      runs: parseInt(currentRun),
      ER: localEr,
      runEvent: eachRun.event
    });
  };
  handleExtra = eachExtra => {
    console.log(eachExtra);
    const { EE, extraRun, currentEvent } = this.state;
    const { score } = this.props;
    let localCurrentRun = extraRun;

    let localEe = this.handleUIReset(EE);
    let localIndex = findIndex(localEe, eachExtra);
    localEe[localIndex].selected = true;
    if (eachExtra.extraRun) {
      localCurrentRun = localCurrentRun + 1;
    }
    this.setState({
      EE: localEe,
      extraRun: localCurrentRun,
      extra: eachExtra.extra,
      extraType: eachExtra.id,
      extraEvent: eachExtra.event,
      batsmanball: eachExtra.batsmanball,
      bowlerBall: eachExtra.bowlerBall,
      ballCounted: eachExtra.ballCounted
    });
  };
  handleOut = eachWicket => {
    console.log(eachWicket);
    const { WK } = this.state;
    const { score } = this.props;
    console.log(score);
    let localWk = this.handleUIReset(WK);
    let localIndex = findIndex(localWk, eachWicket);
    localWk[localIndex].selected = true;
    this.setState({
      WK: localWk,
      outModal: eachWicket.openModal,
      out: eachWicket.out,
      outType: eachWicket.id,
      outEvent: eachWicket.event,
      bowlerWicket: eachWicket.bowlerWicket
    });
  };

  handleSubmitUI = () => {
    this.setState({
      extra: false,
      boundary: false,
      out: false,
      extraType: "",
      outType: "",
      whoIsOut: "",
      bowlerModal: false,
      outModal: false,
      currentEvent: "",
      runEvent: "",
      extraEvent: "",
      outEvent: "",
      extraRun: 0,
      batsmanBall: true,
      bowlerBall: true,
      bowlerWicket: false,
      ER: this.handleUIReset(this.state.ER),
      EE: this.handleUIReset(this.state.EE),
      WK: this.handleUIReset(this.state.WK),
      ballCounted: true
    });
  };

  handleScore = () => {
    const { score, currentMatch, bowler, striker, nonStriker } = this.props;
    const {
      runs,
      out,
      extra,
      outType,
      extraType,
      runEvent,
      extraEvent,
      outEvent,
      extraRun,
      batsmanBall,
      bowlerBall,
      bowlerWicket,
      ballCounted
    } = this.state;
    let currentBall = score.ball;
    let wides = 0;
    let noBalls = 0;
    let byes = 0;
    let fours = 0;
    let sixes = 0;
    let batsmanDots = 0;
    let bowlerDots = 0;
    let wickets = 0;
    // let payload = this.state;
    console.log("dispatch create score here");
    let lastSixBalls = score.lastSixBalls;
    if (lastSixBalls.length === 6) {
      lastSixBalls.pop();
    }
    let overCompleted = false;
    let localStriker = striker;
    let localBowler = bowler;
    let bowlerBalls = bowler.balls;
    let batsmanBalls = striker.balls;
    let bowlerRuns = bowler.runs + runs + extraRun;
    let batsmanRuns = striker.runs + runs;
    if (batsmanBall) {
      batsmanBalls++;
    }
    if (bowlerBall) {
      bowlerBalls++;
    }
    if (runs === 0) {
      batsmanDots = 1;
      bowlerDots = 1;
    } else if (runs === 4) {
      fours = 1;
    } else if (runs === 6) {
      sixes = 1;
    }
    if (extra) {
      if (extraEvent === "wd") {
        wides = 1;
        bowlerDots = 0;
      } else if (extraEvent === "nb") {
        noBalls = 1;
        bowlerDots = 0;
      } else if (extraEvent === "b") {
        byes = 1;
      }
    }
    if (out) {
      if (bowlerWicket) {
        wickets = 1;
      }
    }
    if (ballCounted) {
      currentBall++;
    }
    let currentOver = calculateOvers(currentBall);
    localStriker = {
      ...localStriker,
      balls: batsmanBalls,
      runs: batsmanRuns,
      dots: localStriker.dots + batsmanDots,
      fours: localStriker.fours + fours,
      sixes: localStriker.sixes + sixes,
      sr: calculateSR(batsmanRuns, batsmanBalls)
    };
    localBowler = {
      ...localBowler,
      balls: bowlerBalls,
      runs: bowlerRuns,
      dots: bowler.dots + bowlerDots,
      wides: bowler.wides + wides,
      noBalls: bowler.noBalls + noBalls,
      byes: bowler.byes + byes,
      fours: bowler.dots + bowlerDots,
      sixes: bowler.wides + wides,
      overs: calculateOvers(bowlerBalls),
      eco: calculateEco(bowlerRuns, bowlerBalls)
    };
    if (currentBall % 6 === 0) {
      overCompleted = true;
    }
    lastSixBalls.unshift({
      over: currentOver,
      event: runEvent + extraEvent + outEvent
    });
    let totalRuns =
      parseInt(score.totalRuns) + parseInt(runs) + parseInt(extraRun);
    let totalWickets = score.totalWickets;
    let nextStriker = localStriker;
    let nextNonStriker = nonStriker;
    if (currentBall % 6 === 0 || runs % 2 !== 0) {
      nextStriker = nonStriker;
      nextNonStriker = localStriker;
    }
    if (out) {
      totalWickets++;
    }

    // run rate = totalRuns*6/totalBalls;
    let CRR = round((totalRuns * 6) / currentBall, 2);
    let EXP = floor(CRR * parseInt(currentMatch[0].overs));
    let payload = {
      runs,
      ball: currentBall,
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
      newBatsman: {},
      extra,
      extraType,
      out,
      outType,
      extraRun
    };
    console.log(payload);
    this.props.addScoreToMatch(payload, "firstInningsScore");
    this.handleSubmitUI();
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

  toggle = () => {
    this.setState(prevState => ({
      bowlerModal: !prevState.bowlerModal
    }));
  };

  toggleOutModal = () => {
    this.setState(prevState => ({
      outModal: !prevState.outModal
    }));
  };

  render() {
    const { currentMatch, score, striker, bowler, nonStriker } = this.props;
    const { bowlerModal, ER, EE, WK, outModal } = this.state;
    if (currentMatch && score) {
      // if (score.overCompleted && isEmpty(score.newBowler)) {
      //   return <Redirect to={`/match/${currentMatch[0].id}/addBowler`} />;
      // }
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
                {ER.map((eachRun, index) => (
                  <span
                    key={index}
                    onClick={() => {
                      this.handleRunClick(eachRun);
                    }}
                    id={eachRun.id}
                    className={
                      eachRun.selected ? eachRun.selectedStyle : eachRun.style
                    }
                  >
                    {eachRun.run}
                  </span>
                ))}
              </div>
            </div>
            <hr />
            <div className="row text-center">
              <div className="col">
                <h3 className="score-label">extra</h3>
                <div className="row">
                  {EE.map((eachExtra, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        this.handleExtra(eachExtra);
                      }}
                      id={eachExtra.id}
                      className={
                        eachExtra.selected
                          ? eachExtra.selectedStyle
                          : eachExtra.style
                      }
                    >
                      {eachExtra.type}
                    </div>
                  ))}
                </div>
              </div>
              <div className="col">
                <h3 className="score-label">wicket</h3>
                <div className="row">
                  {WK.map((eachOut, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        this.handleOut(eachOut);
                      }}
                      id={eachOut.id}
                      className={
                        eachOut.selected ? eachOut.selectedStyle : eachOut.style
                      }
                    >
                      {eachOut.type}
                    </div>
                  ))}
                </div>
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
          <BowlerModal openModal={bowlerModal} toggle={this.toggle} />
          <OutModal openModal={outModal} toggle={this.toggleOutModal} />
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
  let bowlingSquad;
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
    currentMatch = currentMatch[0];
    let teamId = currentMatch.firstBowlingId;
    if (currentMatch.currentInnings === "SECOND_INNINGS") {
      let teamId = currentMatch[0].secondBowlingId;
    }
    bowlingSquad = find(state.firestore.ordered.teams, { id: teamId });
  }
  return {
    auth: state.firebase.auth,
    currentMatch: state.firestore.ordered.matches,
    score: score,
    bowler: bowler,
    striker: striker,
    nonStriker: nonStriker,
    bowlingSquad: state.matches.bowlingSquad
  };
};
const mapDispatchToProps = dispatch => {
  return {
    addScoreToMatch: (score, whichCollection) =>
      dispatch(addScoreToMatch(score, whichCollection)),
    getTeamPlayers: (teamId, teamAction) =>
      dispatch(getTeamPlayers(teamId, teamAction)),
    addBowler: bowler => dispatch(addBowler(bowler)),
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
