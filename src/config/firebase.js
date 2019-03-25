import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
var config = {
  apiKey: "AIzaSyCOhF36qbjlxiuXbbbjTJeRUZU8ycfF2yY",
  authDomain: "crikscore-666.firebaseapp.com",
  databaseURL: "https://crikscore-666.firebaseio.com",
  projectId: "crikscore-666",
  storageBucket: "",
  messagingSenderId: "771370686931"
};
firebase.initializeApp(config, {
  timestampsInSnapshots: true
});

export default firebase;
