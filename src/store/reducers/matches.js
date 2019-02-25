const initialState = {
  matches: [],
  players: [],
  currentMatch: {},
  currentScore: {},
  battingSquad: [],
  bowlingSquad: [],
  overCompleted: false,
  score: {}
};
const matches = (state = initialState, action) => {
  switch (action.type) {
    case "CREATE_MATCH":
      return { ...state, currentMatch: action.match };
    case "CREATE_PLAYERS":
      return { ...state, players: action.players };
    case "CURRENT_SCORE":
      return { ...state, currentScore: action.score };
    case "BATTING_TEAM_SQUAD":
      return { ...state, battingSquad: action.teamData };
    case "BOWLING_TEAM_SQUAD":
      return { ...state, bowlingSquad: action.teamData };
    case "OVER_COMPLETE":
      return { ...state, overCompleted: true };
    case "OVER_START":
      return { ...state, overCompleted: false };
    default:
      return state;
  }
};

export default matches;
