import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";

const MatchSummary = ({ match }) => {
  let url =
    match.statusType === "CREATED"
      ? `/match/${match.id}/addPlayer`
      : `/match/${match.id}/score`;
  return (
    <div className="card mb-2">
      <div className="card-header">
        {match.venue}{" "}
        <span className="float-right">
          {moment(match.createdAt.toDate()).calendar()}
        </span>
      </div>
      <div className="card-body">
        <span className="card-title">
          {match.teamOne}
          {match.toss === "teamOne" ? "(T)" : ""} vs {match.teamTwo}
          {match.toss === "teamTwo" ? "(T)" : ""}
        </span>
        <div className="card-text">
          <div>
            {match.batting === "teamOne" ? match.teamOne : match.teamTwo} -{" "}
            {match.firstInningsRuns} / {match.firstInningsWickets} (
            {match.firstInningsOvers} overs)
          </div>
          <div>
            {match.batting === "teamOne" ? match.teamTwo : match.teamOne} - Yet
            to bat
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
