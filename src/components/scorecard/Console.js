import React, { Component } from "react";
import moment from "moment";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  addScoreToMatch,
  getTeamPlayers,
  addBowler,
  overStart,
  overComplete,
  updateScore,
  addBatsman
} from "../../store/actions/matches";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";
import { runsJson, extrasJson, outJson } from "../../config/console";
import { calculateOvers, calculateEco, calculateSR } from "../../utils";

import LiveScorecard from "./LiveScorecard";
import BowlerModal from "./BowlerModal";
import BatsmanModal from "./BatsmanModal";
import OutModal from "./OutModal";

import {
  find,
  floor,
  isEmpty,
  round,
  map,
  findIndex,
  replace,
  isEqual
} from "lodash";

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
    whoIsOut: {},
    bowlerModal: false,
    batsmanModal: false,
    outModal: false,
    ER: runsJson,
    EE: extrasJson,
    WK: outJson,
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
    const { score, currentMatch } = this.props;

    if (score !== prevProps.score) {
      if (score.overCompleted && isEmpty(score.newBowler)) {
        this.setState({ bowlerModal: true });
      }
      if (score.out && isEmpty(score.newBatsman)) {
        this.setState({ batsmanModal: true });
      }
      if (currentMatch) {
        if (currentMatch[0].currentInnings === "FIRST_INNINGS") {
          this.props.getTeamPlayers(currentMatch[0].firstBowlingId, "bowling");
          this.props.getTeamPlayers(currentMatch[0].firstBattingId, "batting");
        }
        if (currentMatch[0].currentInnings === "SECOND_INNINGS") {
          this.props.getTeamPlayers(currentMatch[0].secondBowlingId, "bowling");
          this.props.getTeamPlayers(currentMatch[0].secondBattingId, "batting");
        }
      }
    }
  }

  handleWhoIsOut = player => {
    if (!isEmpty(player)) this.setState({ whoIsOut: player, outModal: false });
  };

  handleUIReset = localVariable => {
    localVariable = map(localVariable, l => {
      l.selected = false;
      return l;
    });
    return localVariable;
  };
  handleRunClick = eachRun => {
    const { ER } = this.state;
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
    const { EE, extraRun } = this.state;
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
    const { WK } = this.state;
    const { score } = this.props;
    let localWk = this.handleUIReset(WK);
    let localIndex = findIndex(localWk, eachWicket);
    localWk[localIndex].selected = true;
    this.setState({
      WK: localWk,
      outModal: eachWicket.openModal,
      out: eachWicket.out,
      outType: eachWicket.id,
      outEvent: eachWicket.event,
      bowlerWicket: eachWicket.bowlerWicket,
      whoIsOut: score.striker
    });
  };

  handleSubmitUI = () => {
    this.setState({
      extra: false,
      boundary: false,
      out: false,
      extraType: "",
      outType: "",
      whoIsOut: {},
      bowlerModal: false,
      batsmanModal: false,
      outModal: false,
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
      whoIsOut
    } = this.state;
    let showBall = true;
    let nextBallCounted = true;
    let wides = 0;
    let noBalls = 0;
    let byes = 0;
    let fours = 0;
    let sixes = 0;
    let batsmanDots = 0;
    let bowlerDots = 0;
    let wickets = 0;
    console.log(score);
    let currentBall = score.ball;
    let lastSixBalls = score.lastSixBalls;
    let overCompleted = false;
    let localStriker = striker;
    let localNonStriker = nonStriker;
    let localBowler = bowler;
    let bowlerBalls = bowler.balls;
    let batsmanBalls = striker.balls;
    let bowlerRuns = bowler.runs + runs + extraRun;
    let batsmanRuns = striker.runs + runs;
    let totalWickets = score.totalWickets;
    let currentEvent = runEvent + extraEvent + outEvent;
    currentEvent =
      currentEvent.length > 1 ? replace(currentEvent, ".", "") : currentEvent;
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
        nextBallCounted = false;
        bowlerDots = 0;
      } else if (extraEvent === "nb") {
        noBalls = 1;
        nextBallCounted = false;
        bowlerDots = 0;
      } else if (extraEvent === "b") {
        byes = 1;
      }
    }
    if (score.nextBallCounted) {
      currentBall++;
    }
    let currentOver = calculateOvers(currentBall);
    if (currentBall !== 0 && currentBall % 6 === 0) {
      overCompleted = true;
    }
    if (lastSixBalls.length === 6) {
      lastSixBalls.pop();
    }
    lastSixBalls.unshift({
      over: currentOver,
      event: currentEvent
    });
    let totalRuns =
      parseInt(score.totalRuns) + parseInt(runs) + parseInt(extraRun);
    let CRR =
      currentBall !== 0 ? round((totalRuns * 6) / currentBall, 2) : "INF";
    let EXP =
      currentBall !== 0 ? floor(CRR * parseInt(currentMatch[0].overs)) : "INF";
    if (out) {
      totalWickets++;
      if (bowlerWicket) {
        wickets = 1;
      }
      if (isEqual(whoIsOut, localStriker)) {
        localStriker = {
          ...localStriker,
          out: true,
          howOut: bowlerWicket ? localBowler.name : "run out"
        };
      }
      if (isEqual(whoIsOut, localNonStriker)) {
        localNonStriker = {
          ...localNonStriker,
          out: true,
          howOut: "run out"
        };
      }
    }
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
      fours: bowler.fours + fours,
      sixes: bowler.sixes + sixes,
      overs: calculateOvers(bowlerBalls),
      eco: calculateEco(bowlerRuns, bowlerBalls),
      wickets: bowler.wickets + wickets
    };
    let payload = {
      runs,
      ball: currentBall,
      CRR,
      EXP,
      currentOver,
      striker: localStriker,
      nonStriker: localNonStriker,
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
      extraRun,
      nextBallCounted,
      showBall,
      whoIsOut
    };
    console.log(payload);

    this.props.addScoreToMatch(payload, "firstInningsScore");
    this.handleSubmitUI();
  };

  handleStrike = () => {
    const { score } = this.props;
    let localStriker = score.striker;
    let localNonStriker = score.nonStriker;
    let localScore = {
      ...score,
      striker: localNonStriker,
      nonStriker: localStriker
    };
    this.props.updateScore(localScore, "firstInningsScore");
  };

  handleBowler = () => {
    const { score } = this.props;
    this.setState({ bowlerModal: true });
  };

  handleChangeBowler = (e, bowler) => {
    e.preventDefault();

    const {
      firstInningsBowling,
      secondInningsBowling,
      secondInningsScore,
      firstInningsScore,
      currentMatch
    } = this.props;

    var alreadyExists = find(firstInningsBowling, { id: bowler.id });

    if (alreadyExists === undefined) {
      this.props.addBowler({
        ...bowler,
        bowlingOrder: firstInningsBowling.length + 1
      });
    } else {
      let scoreCollection = "secondInningsScore";

      let score =
        secondInningsScore &&
        secondInningsScore.length &&
        secondInningsScore[0];
      if (currentMatch[0].currentInnings === "FIRST_INNINGS") {
        scoreCollection = "firstInningsScore";
        score =
          firstInningsScore && firstInningsScore.length && firstInningsScore[0];
      }

      this.props.updateScore(
        { ...score, newBowler: alreadyExists },
        scoreCollection
      );
    }
    this.setState(prevState => ({
      bowlerModal: !prevState.bowlerModal
    }));
  };

  handleChangeBatsman = (e, batsman) => {
    e.preventDefault();

    const {
      firstInningsBatting,
      secondInningsBatting,
      secondInningsScore,
      firstInningsScore,
      currentMatch
    } = this.props;

    var alreadyExists = find(firstInningsBatting, { id: batsman.id });

    if (alreadyExists === undefined) {
      this.props.addBatsman({
        ...batsman,
        battingOrder: firstInningsBatting.length + 1
      });
    } else {
      let scoreCollection = "secondInningsScore";
      let score =
        secondInningsScore &&
        secondInningsScore.length &&
        secondInningsScore[0];
      if (currentMatch[0].currentInnings === "FIRST_INNINGS") {
        scoreCollection = "firstInningsScore";
        score =
          firstInningsScore && firstInningsScore.length && firstInningsScore[0];
      }

      this.props.updateScore(
        { ...score, newBatsman: alreadyExists },
        scoreCollection
      );
    }
    this.setState(prevState => ({
      batsmanModal: !prevState.batsmanModal
    }));
  };

  handleInnings = () => {
    const { score } = this.props;
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

  toggleBatsmanModal = () => {
    this.setState(prevState => ({
      batsmanModal: !prevState.batsmanModal
    }));
  };

  render() {
    const {
      currentMatch,
      score,
      striker,
      bowler,
      nonStriker,
      bowlingSquad,
      battingSquad
    } = this.props;
    const { bowlerModal, ER, EE, WK, outModal, batsmanModal } = this.state;
    if (currentMatch && score) {
      return (
        <div className="my-2">
          {/* heading */}
          <div className="m-3 border-bottom border-primary pb-3 score-label">
            {currentMatch[0].teamOne} vs {currentMatch[0].teamTwo} at{" "}
            {currentMatch[0].venue}
          </div>
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
          {/* Full scoredard */}
          <Link
            to={`/match/${currentMatch[0].id}/scorecard`}
            className="btn btn-info btn-block"
            target="_blank"
          >
            Full Scorecard
          </Link>
          {/* modals */}
          <BowlerModal
            openModal={bowlerModal}
            toggle={this.toggle}
            submitBowler={this.handleChangeBowler}
            currentMatch={currentMatch[0]}
            bowlingSquad={bowlingSquad}
          />
          <OutModal
            openModal={outModal}
            toggle={this.toggleOutModal}
            striker={striker}
            nonStriker={nonStriker}
            handleWhoIsOut={this.handleWhoIsOut}
          />
          <BatsmanModal
            openModal={batsmanModal}
            toggle={this.toggleBatsmanModal}
            submitBatsman={this.handleChangeBatsman}
            currentMatch={currentMatch[0]}
            battingSquad={battingSquad}
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
  let striker = {};
  let bowler = {};
  let nonStriker = {};
  let currentMatch = state.firestore.ordered.matches;
  let score;
  if (currentMatch) {
    if (currentMatch[0].currentInnings === "FIRST_INNINGS") {
      score = state.firestore.ordered.firstInningsScore;
    } else {
      score = state.firestore.ordered.secondInningsScore;
    }
    if (score) {
      score = score[0];

      striker = score.striker;
      bowler = score.bowler;
      nonStriker = score.nonStriker;

      if (score.runs % 2 !== 0) {
        if (score.ball % 6 !== 0) {
          striker = score.nonStriker;
          nonStriker = score.striker;
        }
      } else {
        if (score.ball % 6 === 0) {
          striker = score.nonStriker;
          nonStriker = score.striker;
        }
      }

      if (!isEmpty(score.newBowler)) {
        bowler = score.newBowler;
      }

      if (!isEmpty(score.newBatsman)) {
        if (striker.out) {
          striker = score.newBatsman;
        }
        if (nonStriker.out) {
          nonStriker = score.newBatsman;
        }
      }
    }
  }
  return {
    auth: state.firebase.auth,
    currentMatch: state.firestore.ordered.matches,
    score: score,
    bowler: bowler,
    striker: striker,
    nonStriker: nonStriker,
    bowlingSquad: state.matches.bowlingSquad,
    battingSquad: state.matches.battingSquad,
    firstInningsBowling: state.firestore.ordered.firstInningsBowling,
    secondInningsBowling: state.firestore.ordered.secondInningsBowling,
    firstInningsBatting: state.firestore.ordered.firstInningsBatting,
    secondInningsBatting: state.firestore.ordered.secondInningsBatting,
    firstInningsScore: state.firestore.ordered.firstInningsScore,
    secondInningsScore: state.firestore.ordered.secondInningsScore
  };
};
const mapDispatchToProps = dispatch => {
  return {
    addScoreToMatch: (score, whichCollection) =>
      dispatch(addScoreToMatch(score, whichCollection)),
    getTeamPlayers: (teamId, teamAction) =>
      dispatch(getTeamPlayers(teamId, teamAction)),
    addBowler: bowler => dispatch(addBowler(bowler)),
    addBatsman: batsman => dispatch(addBatsman(batsman)),
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
