import auth from "./auth";
import projects from "./projects";
import { combineReducers } from "redux";
import { firestoreReducer } from "redux-firestore";
import { firebaseReducer } from "react-redux-firebase";

const rootReducer = combineReducers({
  auth: auth,
  projects: projects,
  firestore: firestoreReducer,
  firebase: firebaseReducer
});

export default rootReducer;
