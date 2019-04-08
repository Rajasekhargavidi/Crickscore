import React, { Component } from "react";
import moment from "moment";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import {
  addScoreToMatch,
  getTeamPlayers,
  addBowler,
  updateScore,
  addBatsman,
  addPlayers,
  updateMatch
} from "../../store/actions/matches";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";
import { runsJson, extrasJson, outJson } from "../../config/console";
import {
  calculateOvers,
  calculateEco,
  calculateSR,
  expectedRuns,
  currentRR,
  requiredRR
} from "../../utils";
import LiveScorecard from "./LiveScorecard";
import BowlerModal from "./BowlerModal";
import BatsmanModal from "./BatsmanModal";
import OutModal from "./OutModal";
import AddPlayerModal from "./AddPlayerModal";

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
    whoIsOut: {},
    bowlerModal: false,
    batsmanModal: false,
    initialPlayersModal: false,
    outModal: false,
    ER: runsJson,
    EE: extrasJson,
    WK: outJson,
    currentExtraJson: {},
    currentRunJson: {},
    currentOutJson: {},
    battingCollection: "firstInningsBatting",
    bowlingCollection: "firstInningsBowling",
    scoreCollection: "firstInningsScore",
    error: ""
  };

  componentDidUpdate(prevProps) {
    const { score, currentMatch } = this.props;
    if (currentMatch !== prevProps.currentMatch) {
      let battingCollection,
        bowlingCollection,
        scoreCollection,
        battingTeam,
        bowlingTeam,
        battingTeamId,
        bowlingTeamId;
      if (currentMatch[0].currentInnings === "SECOND_INNINGS") {
        battingTeamId = currentMatch[0].secondBattingId;
        bowlingTeamId = currentMatch[0].secondBowlingId;
        battingTeam = currentMatch[0].secondBatting;
        bowlingTeam = currentMatch[0].secondBowling;
        this.props.getTeamPlayers(bowlingTeamId, "bowling");
        this.props.getTeamPlayers(battingTeamId, "batting");
        bowlingCollection = "secondInningsBowling";
        battingCollection = "secondInningsBatting";
        scoreCollection = "secondInningsScore";
      } else {
        battingTeamId = currentMatch[0].firstBattingId;
        bowlingTeamId = currentMatch[0].firstBowlingId;
        battingTeam = currentMatch[0].firstBatting;
        bowlingTeam = currentMatch[0].firstBowling;
        this.props.getTeamPlayers(bowlingTeamId, "bowling");
        this.props.getTeamPlayers(battingTeamId, "batting");
        bowlingCollection = "firstInningsBowling";
        battingCollection = "firstInningsBatting";
        scoreCollection = "firstInningsScore";
      }
      this.setState({
        battingCollection,
        bowlingCollection,
        scoreCollection,
        battingTeam,
        bowlingTeam,
        battingTeamId,
        bowlingTeamId
      });
    }
    if (score !== prevProps.score) {
      if (score) {
        this.setState({
          bowlerModal: score.overCompleted && isEmpty(score.newBowler),
          batsmanModal: score.out && isEmpty(score.newBatsman)
        });
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
    let localEr = this.handleUIReset(ER);
    let localIndex = findIndex(localEr, eachRun);
    localEr[localIndex].selected = true;
    this.setState({
      ER: localEr,
      currentRunJson: eachRun,
      error: ""
    });
  };
  handleExtra = eachExtra => {
    const { EE } = this.state;
    let localEe = this.handleUIReset(EE);
    let localIndex = findIndex(localEe, eachExtra);
    localEe[localIndex].selected = true;

    this.setState({
      EE: localEe,
      currentExtraJson: eachExtra
    });
  };
  handleOut = eachWicket => {
    const { WK } = this.state;
    const { striker } = this.props;
    let localWk = this.handleUIReset(WK);
    let localIndex = findIndex(localWk, eachWicket);
    localWk[localIndex].selected = true;
    this.setState({
      WK: localWk,
      outModal: eachWicket.openModal,
      whoIsOut: striker,
      currentOutJson: eachWicket
    });
  };
  handleSubmitUI = () => {
    this.setState({
      whoIsOut: {},
      bowlerModal: false,
      batsmanModal: false,
      initialPlayersModal: false,
      outModal: false,
      ER: this.handleUIReset(this.state.ER),
      EE: this.handleUIReset(this.state.EE),
      WK: this.handleUIReset(this.state.WK),
      currentExtraJson: {},
      currentRunJson: {},
      currentOutJson: {}
    });
  };
  handleScore = () => {
    const { score, currentMatch, bowler, striker, nonStriker } = this.props;
    const {
      whoIsOut,
      currentRunJson,
      currentExtraJson,
      currentOutJson,
      scoreCollection
    } = this.state;
    if (isEmpty(currentRunJson)) {
      this.setState({ error: "Select runs first" });
    } else {
      let localBowler = bowler;
      let localStriker = striker;
      let localNonStriker = nonStriker;
      let currentBall = parseInt(score.ball);
      let nextBallCounted = true;
      let runs = 0;
      let finalRuns = 0;
      let totalWickets = score.totalWickets;
      let currentEvent = "";
      let lastSixBalls = score.lastSixBalls;
      let extra = false;
      let extraType = "";
      let extraRun = 0;
      let out = false;
      let outType = "";
      let batsmanRun = true;
      let batsmanBall = true;
      let bowlerRun = true;
      let bowlerBall = true;
      let bowlerWicket = false;
      let boundary = false;
      let overCompleted = false;
      if (!isEmpty(currentRunJson)) {
        runs = parseInt(currentRunJson.run);
        finalRuns += runs;
        currentEvent += currentRunJson.event;
        if (score.nextBallCounted) {
          currentBall++;
        }
      }
      let currentOver = calculateOvers(currentBall);
      if (!isEmpty(currentExtraJson)) {
        if (currentExtraJson.extra) {
          if (currentExtraJson.extraRun) {
            finalRuns++;
          }
          if (!currentExtraJson.ballCounted) {
            nextBallCounted = false;
          }
          currentEvent += currentExtraJson.event;
          extra = currentExtraJson.extra;
          extraType = currentExtraJson.id;
          extraRun = currentExtraJson.extraRun ? 1 : 0;
          batsmanBall = currentExtraJson.batsmanBall;
          batsmanRun = currentExtraJson.batsmanRun;
          bowlerBall = currentExtraJson.bowlerBall;
          bowlerRun = currentExtraJson.bowlerRun;
        }
      }

      if (!isEmpty(currentOutJson)) {
        out = currentOutJson.out;
        outType = currentOutJson.id;
        currentEvent += currentOutJson.event;
        bowlerWicket = currentOutJson.bowlerWicket;
        if (out) {
          totalWickets++;
        }
      }
      currentEvent =
        currentEvent.length > 1 ? replace(currentEvent, ".", "") : currentEvent;
      if (lastSixBalls.length === 6) {
        lastSixBalls.pop();
      }
      lastSixBalls.unshift({
        over: currentOver,
        event: currentEvent
      });
      let totalRuns = score.totalRuns + finalRuns;
      let CRR = currentRR(totalRuns, currentBall);
      let EXP = expectedRuns(CRR, currentMatch[0].overs);

      if (batsmanBall) {
        localStriker = { ...localStriker, balls: localStriker.balls + 1 };
      }
      if (batsmanRun) {
        localStriker = { ...localStriker, runs: localStriker.runs + runs };
        if (runs === 0) {
          localStriker = { ...localStriker, dots: localStriker.dots + 1 };
          localBowler = { ...localBowler, dots: localBowler.dots + 1 };
        }
        if (runs === 4) {
          localStriker = { ...localStriker, fours: localStriker.fours + 1 };
          localBowler = { ...localBowler, fours: localBowler.fours + 1 };
          boundary = true;
        }
        if (runs === 6) {
          localStriker = { ...localStriker, sixes: localStriker.sixes + 1 };
          localBowler = { ...localBowler, sixes: localBowler.sixes + 1 };
          boundary = true;
        }
      }
      if (bowlerBall) {
        localBowler = { ...localBowler, balls: localBowler.balls + 1 };
      }
      if (bowlerRun) {
        localBowler = { ...localBowler, runs: localBowler.runs + finalRuns };
      }
      if (bowlerWicket) {
        localBowler = { ...localBowler, wickets: localBowler.wickets + 1 };
      }
      localStriker = {
        ...localStriker,
        sr: calculateSR(localStriker.runs, localStriker.balls)
      };
      localBowler = {
        ...localBowler,
        overs: calculateOvers(localBowler.balls)
      };
      localBowler = {
        ...localBowler,
        eco: calculateEco(localBowler.runs, localBowler.balls)
      };
      if (extraType === "wd") {
        localBowler = { ...localBowler, wides: localBowler.wides + 1 };
      }
      if (extraType === "nb") {
        localBowler = { ...localBowler, noBalls: localBowler.noBalls + 1 };
      }
      if (extraType === "b") {
        localBowler = { ...localBowler, byes: localBowler.byes + 1 };
      }
      if (out && whoIsOut.id === localStriker.id) {
        localStriker = {
          ...localStriker,
          out: true,
          howOut: bowlerWicket ? localBowler.name : "run out",
          onStrike: false
        };
      }
      if (out && whoIsOut.id === localNonStriker.id) {
        localNonStriker = {
          ...localNonStriker,
          out: true,
          howOut: "run out",
          onStrike: false
        };
      }
      if (currentBall !== 0 && currentBall % 6 === 0 && !extra) {
        overCompleted = true;
      }
      let payload = {
        runs,
        lastSixBalls,
        currentEvent,
        ball: currentBall,
        CRR,
        EXP,
        nextBallCounted,
        currentOver,
        totalRuns,
        totalWickets,
        extra,
        extraType,
        extraRun,
        out,
        outType,
        whoIsOut,
        striker: localStriker,
        nonStriker: localNonStriker,
        bowler: localBowler,
        boundary,
        newBowler: {},
        newBatsman: {},
        overCompleted,
        changeStrike: false,
        changeBowler: false,
        endInnings: false,
        finalRuns
      };
      this.props.addScoreToMatch(payload, scoreCollection);
      this.handleSubmitUI();
      if (currentBall === parseInt(currentMatch[0].overs) * 6 && !extra) {
        this.handleInnings();
      }
    }
  };
  handleStrike = () => {
    const { score } = this.props;
    const { scoreCollection } = this.state;
    let localScore = { ...score, changeStrike: true };
    this.props.updateScore(localScore, scoreCollection);
  };
  handleBowler = () => {
    this.setState({ bowlerModal: true });
  };
  handleChangeBowler = (e, bowler) => {
    e.preventDefault();
    const { currentInningsBowling, score } = this.props;
    const { scoreCollection } = this.state;
    console.log("handleBowlerChange");
    console.log(currentInningsBowling);
    console.log(scoreCollection);
    var alreadyExists = find(currentInningsBowling, { id: bowler.id });
    if (alreadyExists === undefined) {
      this.props.addBowler({
        ...bowler,
        bowlingOrder: currentInningsBowling.length + 1
      });
    } else {
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
    const { currentInningsBatting, currentMatch, score } = this.props;
    const { scoreCollection } = this.state;
    var alreadyExists = find(currentInningsBatting, { id: batsman.id });
    if (alreadyExists === undefined) {
      this.props.addBatsman({
        ...batsman,
        battingOrder: currentInningsBatting.length + 1
      });
    } else {
      this.props.updateScore(
        { ...score, newBatsman: alreadyExists },
        scoreCollection
      );
    }
    this.setState(prevState => ({
      batsmanModal: !prevState.batsmanModal
    }));
  };
  handleInitialPlayers = (e, striker, nonStriker, bowler) => {
    e.preventDefault();

    this.props.addPlayers(striker, nonStriker, bowler);
    this.setState(prevState => ({
      initialPlayersModal: !prevState.initialPlayersModal
    }));
  };
  handleInnings = () => {
    const { currentMatch } = this.props;
    let match = {
      ...currentMatch[0],
      statusType: 3,
      status: "INNINGS_BREAK",
      currentInnings: "SECOND_INNINGS",
      initialPlayersNeeded: true
    };
    this.props.updateMatch(match);
  };
  handleEndMatch = () => {
    const { currentMatch } = this.props;
    let match = {
      ...currentMatch[0],
      statusType: 4,
      status: "MATCH_ENDED",
      currentInnings: "SECOND_INNINGS",
      initialPlayersNeeded: false
    };
    this.props.updateMatch(match);
  };

  handleEndMatch = () => {
    const { currentMatch } = this.props;
    let match = {
      ...currentMatch[0],
      statusType: 5,
      status: "MATCH_ENDED",
      currentInnings: "SECOND_INNINGS",
      initialPlayersNeeded: false
    };
    this.props.updateMatch(match);
  };
  lastSixBalls = lastSixBalls =>
    lastSixBalls.length !== 0 &&
    lastSixBalls.map((ball, i) => (
      <div key={i} className="col-2 text-center p-1">
        <div className="score-label">{ball.over}</div>
        <div className="ball-values bg-white border border-danger text-uppercase last-six-balls">
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
  toggleInitialPlayersModal = () => {
    this.setState(prevState => ({
      initialPlayersModal: !prevState.initialPlayersModal
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
      battingSquad,
      auth,
      currentInningsBatting,
      currentInningsBowling
    } = this.props;
    const {
      bowlerModal,
      ER,
      EE,
      WK,
      outModal,
      batsmanModal,
      battingTeam,
      battingTeamId,
      bowlingTeam,
      bowlingTeamId,
      initialPlayersModal,
      error
    } = this.state;
    if (!auth.uid) {
      return <Redirect to="/signIn" />;
    }

    if (currentMatch) {
      if (!currentMatch[0].initialPlayersNeeded && score) {
        return (
          <div className="my-2">
            {/* heading */}
            <div className="m-3 border-bottom border-primary pb-3 score-label">
              {currentMatch[0].teamOne} vs {currentMatch[0].teamTwo} at{" "}
              {currentMatch[0].venue}
              <span className="float-right text-danger score-values">
                {currentMatch[0].currentInnings === "FIRST_INNINGS"
                  ? "1st"
                  : "2nd"}{" "}
                Inn
              </span>
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
                    <div className="col-2 text-uppercase p-1">
                      <img
                        src={
                          "https://static.thenounproject.com/png/635343-200.png"
                        }
                        alt="Bat"
                        className="img-fluid"
                      />
                    </div>
                    <div className="col-10 text-capitalize text-truncate border-right p-1">
                      {striker && striker.name}
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="row bg-light">
                    <div className="col-10 text-capitalize text-truncate p-1">
                      {bowler && bowler.name}
                    </div>
                    <div className="col-2 text-uppercase p-1">
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
              <div className="row my-1 py-1 px-4">
                {this.lastSixBalls(score.lastSixBalls)}
              </div>
            </div>
            {/* runs panel */}
            <div className="bg-light text-dark p-3">
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
              {error && <div className="error">{error}</div>}
              <hr />
              <div className="row text-center">
                <div className="col">
                  <h3 className="score-label">extra</h3>

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
                <div className="col">
                  <h3 className="score-label">wicket</h3>

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
            <div className="container my-2">
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
                  {currentMatch[0].currentInnings === "FIRST_INNINGS" && (
                    <button
                      onClick={this.handleInnings}
                      className="btn btn-danger text-uppercase"
                    >
                      end innings
                    </button>
                  )}
                  {currentMatch[0].currentInnings === "SECOND_INNINGS" && (
                    <button
                      onClick={this.handleEndMatch}
                      className="btn btn-danger text-uppercase"
                    >
                      end match
                    </button>
                  )}
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
              bowlingSquad={bowlingSquad}
              bowlingTeam={bowlingTeam}
              bowlingTeamId={bowlingTeamId}
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
              battingSquad={battingSquad}
              battingTeam={battingTeam}
              battingTeamId={battingTeamId}
            />
          </div>
        );
      } else {
        return (
          <AddPlayerModal
            openModal={currentMatch[0].initialPlayersNeeded}
            submitInitialPlayers={this.handleInitialPlayers}
            battingSquad={battingSquad}
            bowlingSquad={bowlingSquad}
            bowlingTeam={bowlingTeam}
            bowlingTeamId={bowlingTeamId}
            battingTeam={battingTeam}
            battingTeamId={battingTeamId}
            currentMatch={currentMatch[0]}
          />
        );
      }
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

  let currentInningsBowling, currentInningsBatting;
  if (currentMatch) {
    if (currentMatch[0].currentInnings === "FIRST_INNINGS") {
      score = state.firestore.ordered.firstInningsScore;
      currentInningsBowling = state.firestore.ordered.firstInningsBowling;
      currentInningsBatting = state.firestore.ordered.firstInningsBatting;
    } else {
      score = state.firestore.ordered.secondInningsScore;
      currentInningsBowling = state.firestore.ordered.secondInningsBowling;
      currentInningsBatting = state.firestore.ordered.secondInningsBatting;
    }
    if (!currentMatch[0].initialPlayersNeeded && score) {
      score = score[0];

      striker = score.striker;
      bowler = score.bowler;
      nonStriker = score.nonStriker;

      if (score.runs % 2 !== 0) {
        let tempStriker = striker;
        striker = nonStriker;
        nonStriker = tempStriker;
      }
      if (score.ball !== 0 && score.ball % 6 === 0 && !score.extra) {
        let tempStriker = striker;
        striker = nonStriker;
        nonStriker = tempStriker;
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
      striker = { ...striker, onStrike: true, out: false };
      nonStriker = { ...nonStriker, onStrike: false, out: false };
      if (score.changeStrike) {
        let tempStriker = striker;
        striker = nonStriker;
        nonStriker = tempStriker;
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
    currentInningsBatting: currentInningsBatting,
    currentInningsBowling: currentInningsBowling
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
      dispatch(updateScore(score, whichCollection)),
    addPlayers: (striker, nonStriker, bowler) =>
      dispatch(addPlayers(striker, nonStriker, bowler)),

    updateMatch: payload => dispatch(updateMatch(payload))
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
