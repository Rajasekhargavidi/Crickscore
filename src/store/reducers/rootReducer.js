import auth from "./auth";
import matches from "./matches";
import { combineReducers } from "redux";
import { firestoreReducer } from "redux-firestore";
import { firebaseReducer } from "react-redux-firebase";

const rootReducer = combineReducers({
  auth: auth,
  matches: matches,
  firestore: firestoreReducer,
  firebase: firebaseReducer
});

export default rootReducer;
