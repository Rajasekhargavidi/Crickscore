import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import { firestoreConnect } from "react-redux-firebase";
import moment from "moment";
import { find, floor, isEmpty, round, map, findIndex } from "lodash";

import LiveScorecard from "./LiveScorecard";
import InningsBatting from "./InningsBatting";
import InningsBowling from "./InningsBowling";
import BallByBall from "./BallByBall";

import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Card,
  Button,
  CardTitle,
  CardText,
  Row,
  Col
} from "reactstrap";
import classnames from "classnames";

class FullScorecard extends Component {
  state = {
    activeTab: "1"
  };
  componentWillMount() {
    
  }
  componentDidMount() {
    
  }
  toggle = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  };

  render() {
    const {
      auth,
      currentMatch,
      striker,
      nonStriker,
      bowler,
      firstInningsBatting,
      secondInningsBatting,
      firstInningsBowling,
      secondInningsBowling,
      scores
    } = this.props;
    if (!auth.uid) {
      return <Redirect to="/signIn" />;
    }
    if (currentMatch) {
      return (
        <div className="container mt-5">
          <a href="/matches">All Matches</a>
          <h3>
            {currentMatch[0].teamOne} vs {currentMatch[0].teamTwo} at{" "}
            {currentMatch[0].venue}
          </h3>
          <Nav pills justified={true} fill={true}>
            <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab === "1" })}
                onClick={() => {
                  this.toggle("1");
                }}
              >
                Full
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab === "2" })}
                onClick={() => {
                  this.toggle("2");
                }}
              >
                Live
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab === "3" })}
                onClick={() => {
                  this.toggle("3");
                }}
              >
                Ball By Ball
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab === "4" })}
                onClick={() => {
                  this.toggle("4");
                }}
              >
                Stats
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent className="mt-3" activeTab={this.state.activeTab}>
            <TabPane tabId="1">
              <h3>
                {currentMatch[0].firstBatting}
                <small className="float-right">1st Inn</small>
              </h3>
              <InningsBatting players={firstInningsBatting} />
              <h3>{currentMatch[0].firstBowling}</h3>
              <InningsBowling players={firstInningsBowling} />

              {secondInningsBatting && secondInningsBatting.length > 0 ? (
                <div>
                  <h3>
                    {currentMatch[0].firstBowling}
                    <small className="float-right">2nd Inn</small>
                  </h3>
                  <InningsBatting players={secondInningsBatting} />
                  <h3>{currentMatch[0].firstBatting}</h3>
                  <InningsBowling players={secondInningsBowling} />
                </div>
              ) : (
                <div />
              )}
            </TabPane>
            <TabPane tabId="2">
              <LiveScorecard
                striker={striker}
                nonStriker={nonStriker}
                bowler={bowler}
              />
            </TabPane>
            <TabPane tabId="3">
              <BallByBall scores={scores} />
            </TabPane>
            <TabPane tabId="4">
              <Row>
                <Col sm="6">
                  <Card body>
                    <CardTitle>Special Title Treatment</CardTitle>
                    <CardText>
                      With supporting text below as a natural lead-in to
                      additional content.
                    </CardText>
                    <Button>Go somewhere</Button>
                  </Card>
                </Col>
                <Col sm="6">
                  <Card body>
                    <CardTitle>Special Title Treatment</CardTitle>
                    <CardText>
                      With supporting text below as a natural lead-in to
                      additional content.
                    </CardText>
                    <Button>Go somewhere</Button>
                  </Card>
                </Col>
              </Row>
            </TabPane>
          </TabContent>
        </div>
      );
    } else {
      return (
        <div className="container center">
          <p>Loading Score...</p>
        </div>
      );
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  
  let striker = {};
  let bowler = {};
  let nonStriker = {};
  let currentMatch = state.firestore.ordered.matches;
  let scores;
  let score;
  if (currentMatch) {
    if (currentMatch[0].currentInnings === "FIRST_INNINGS") {
      scores = state.firestore.ordered.firstInningsScore;
    } else {
      scores = state.firestore.ordered.secondInningsScore;
    }
    if (scores) {
      score = scores[0];
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
    scores: scores,
    bowler: bowler,
    striker: striker,
    nonStriker: nonStriker,
    firstInningsBatting: state.firestore.ordered.firstInningsBatting,
    secondInningsBatting: state.firestore.ordered.secondInningsBatting,
    firstInningsBowling: state.firestore.ordered.firstInningsBowling,
    secondInningsBowling: state.firestore.ordered.secondInningsBowling
  };
};
export default compose(
  connect(mapStateToProps),
  firestoreConnect(props => [
    { collection: "matches", doc: props.match.params.matchId },
    {
      collection: "matches",
      doc: props.match.params.matchId,
      subcollections: [
        {
          collection: "firstInningsScore",
          orderBy: ["createdAt", "desc"]
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
    },
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
    }
  ])
)(FullScorecard);
