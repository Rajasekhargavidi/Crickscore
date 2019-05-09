export const signIn = credentials => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();
    firebase
      .auth()
      .signInWithEmailAndPassword(credentials.email, credentials.password)
      .then(() => {
        dispatch({ type: "LOGIN_SUCCESS" });
      })
      .catch(err => dispatch({ type: "SIGNIN_ERROR", error: err.message }));
  };
};

export const signUp = newUser => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();
    firebase
      .auth()
      .createUserWithEmailAndPassword(newUser.email, newUser.password)
      .then(response => {
        return firestore
          .collection("users")
          .doc(response.user.uid)
          .set({
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            initials: newUser.firstName[0] + newUser.lastName[0]
          });
      })
      .then(() => {
        dispatch({ type: "SIGNUP_SUCCESS" });
      })
      .catch(err => dispatch({ type: "SIGNUP_ERROR", error: err.message }));
  };
};

export const signOut = () => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();
    firebase
      .auth()
      .signOut()
      .then(() => {
        dispatch({ type: "SIGNOUT_SUCCESS" });
      })
      .catch(err => console.log(err));
  };
};

export const createTeam =(newTeam) => {
  return (dispatch,getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore;
    const firebase = getFirebase();
    firebase
      .auth()
      .saveTournamentWithTeamDetails(newTeam.name,
             newTeam.startDate,
             newTeam.Fee,
             newTeam.firstPrize,
             newTeam.secondPrize,
             newTeam.sponsors,
             newTeam.totalteams)
      .then(response => {
      return firestore
          .collection("users")
          .doc(response.user.uid)
          .set({
            Name: newTeam.firstName,
            startDate: newTeam.startDate,
            fee: newTeam.fee,
            firstPrize: newTeam.firstPrize,
            secondPrize: newTeam.secondPrize,
            sponsors: newTeam.sponsors,
            totalteams:newTeam.totalteams
          });
      })
      .then(() => {
        dispatch({ type: "" });
      })
      .catch(err => dispatch({ type: "SIGNUP_ERROR", error: err.message }));
  };
};

