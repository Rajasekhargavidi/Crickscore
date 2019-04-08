import React from "react";
import MatchSummary from "./MatchSummary";

const LiveMatches = ({ matches, auth }) => {
  return (
    <div className="match-list section">
      {matches &&
        matches.map((match, index) => (
          <MatchSummary key={match.id} match={match} auth={auth} />
        ))}
    </div>
  );
};

export default LiveMatches;
