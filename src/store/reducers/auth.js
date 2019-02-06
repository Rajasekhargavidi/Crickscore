const initialState = {};
const auth = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return state;
      break;
    case "SIGNOUT_SUCCESS":
      return state;
      break;
    case "SIGNUP_SUCCESS":
      return state;
      break;
    default:
      return state;
  }
};

export default auth;
