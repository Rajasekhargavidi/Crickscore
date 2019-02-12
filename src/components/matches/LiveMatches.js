import React from "react";
import MatchSummary from "./MatchSummary";

const LiveMatches = ({ matches }) => {
  return (
    <div className="match-list section">
      {matches &&
        matches.map((match, index) => (
          <MatchSummary key={match.id} match={match} />
        ))}
    </div>
  );
};

export default LiveMatches;
