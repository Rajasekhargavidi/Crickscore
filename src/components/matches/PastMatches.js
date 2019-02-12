import React from "react";
import MatchSummary from "./MatchSummary";
import { Link } from "react-router-dom";
const PastMatches = ({ matches }) => {
  return (
    <div className="match-list section">
      {matches &&
        matches.map((match, index) => (
          <Link key={match.id} to={`/match/${match.id}`}>
            <MatchSummary key={match.id} match={match} />
          </Link>
        ))}
    </div>
  );
};

export default PastMatches;
