import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";

const MatchSummary = ({ match }) => {
  let url = `/match/${match.id}/score`;
  return (
    <div className="card mb-2">
      <div className="card-header text-capitalize">
        {match.venue}
        <span className="float-right">{match.overs} overs match</span>
      </div>
      <div className="card-body">
        <span className="card-title score-values">
          {match.teamOne} <span className="text-uppercase">vs</span>{" "}
          {match.teamTwo}
        </span>
        <div className="score-label">
          {moment(match.createdAt.toDate()).calendar()}
        </div>
        <div className="score-sub-label">{match.tossInformation}</div>
        <div>{match.statusType}</div>
        <hr />
        <div className="card-text">
          <div className="score-values">{match.firstBatting}</div>
          <div className="score-sub-text">
            {match.firstInningsRuns} / {match.firstInningsWickets}
            <span className="float-right">
              {match.firstInningsOvers} / {match.overs} overs
            </span>
          </div>
          <div className="score-values">{match.secondBatting}</div>
          <div className="score-sub-text">
            {match.secondInningsRuns} / {match.secondInningsWickets}
            <span className="float-right">
              {match.secondInningsOvers} / {match.overs} overs
            </span>
          </div>
        </div>
      </div>
      <div className="card-footer">
        <Link
          to={`/match/${match.id}/scorecard`}
          className="float-left btn btn-info btn-sm"
        >
          View Score
        </Link>
        <Link to={url} className="float-right btn btn-primary btn-sm">
          Start Scoring
        </Link>
      </div>
    </div>
  );
};

export default MatchSummary;
