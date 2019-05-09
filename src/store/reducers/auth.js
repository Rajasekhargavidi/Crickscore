const initialState = {
  signUpError: "",
  signInError: "",
  createTeamError: ""
};
const auth = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { ...state, signInError: "" };
    case "SIGNOUT_SUCCESS":
      return { ...state, signUpError: "" };
    case "SIGNUP_SUCCESS":
      return { ...state, signUpError: "" };
    case "CREATETEAM_SUCCESS":
      return { ...state, createTeamError: "" };
    case "SIGNUP_ERROR":
      return { ...state, signUpError: action.error };
    case "SIGNIN_ERROR":
      return { ...state, signInError: action.error };
    case "CREATETEAM_ERROR":
      return { ...state, createTeamError: action.error };
    default:
      return state;
  }
};

export default auth;
