export const createMatch = match => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    const profile = getState().firebase.profile;
    const scorerId = getState().firebase.auth.uid;
    const ref = firestore.collection("matches").doc();
    if (match.teamOneId === "") {
      const teamOneref = firestore.collection("teams").doc();
      match = { ...match, teamOneId: teamOneref.id };
      teamOneref
        .set({
          name: match.teamOne,
          scorerFirstName: profile.firstName,
          scorerLastName: profile.lastName,
          scorerId: scorerId,
          status: 1,
          createdAt: new Date()
        })
        .then(() => {
          console.log("team added successfully");
        })
        .catch(err => console.log(err));
    }

    if (match.teamTwoId === "") {
      const teamTworef = firestore.collection("teams").doc();
      match = { ...match, teamTwoId: teamTworef.id };
      teamTworef
        .set({
          name: match.teamTwo,
          scorerFirstName: profile.firstName,
          scorerLastName: profile.lastName,
          scorerId: scorerId,
          status: 1,
          createdAt: new Date()
        })
        .then(() => {
          console.log("team added successfully");
        })
        .catch(err => console.log(err));
    }
    ref
      .set({
        ...match,
        scorerFirstName: profile.firstName,
        scorerLastName: profile.lastName,
        scorerId: scorerId,
        status: 1,
        statusType: "CREATED",
        currentInnings: "FIRST_INNINGS",
        createdAt: new Date()
      })
      .then(() => {
        match = { ...match, id: ref.id };
        dispatch({ type: "CREATE_MATCH", match });
      })
      .catch(err => console.log(err));
  };
};

export const addPlayers = players => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    const profile = getState().firebase.profile;
    const scorerId = getState().firebase.auth.uid;
    firestore
      .collection("players")
      .add({
        ...players,
        addedBy: scorerId,
        addedByName: `${profile.firstName} ${profile.lastName}`,
        status: 1,
        statusType: "CREATED",
        createdAt: new Date()
      })
      .then(() => {
        dispatch({ type: "CREATE_PLAYERS", players });
      })
      .catch(err => console.log(err));
  };
};

export const addPlayer = (
  name,
  selectedPlayerId,
  teamId,
  matchId,
  teamAction,
  currentInnings
) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    console.log(name, "name");
    console.log(name, "name");
    console.log(teamId, "teamId");
    console.log(matchId, "matchId");
    console.log(teamAction, "teamAction");
    console.log(currentInnings, "currentInnings");
    const firestore = getFirestore();
    const profile = getState().firebase.profile;
    const scorerId = getState().firebase.auth.uid;
    let playerId;
    if (selectedPlayerId === "") {
      const playersRef = firestore.collection("players").doc();
      playerId = playersRef.id;
      playersRef
        .set({
          name: name,
          addedBy: scorerId,
          addedByName: `${profile.firstName} ${profile.lastName}`,
          status: 1,
          createdAt: new Date()
        })
        .then(() => {
          // dispatch({ type: "CREATE_PLAYERS", players });
        })
        .catch(err => console.log(err));
      firestore
        .collection("teams")
        .doc(teamId)
        .collection("players")
        .doc(playerId)
        .set({
          id: playerId,
          name: name,
          addedBy: scorerId,
          addedByName: `${profile.firstName} ${profile.lastName}`,
          status: 1,
          createdAt: new Date()
        })
        .then(() => {
          // dispatch({ type: "CREATE_PLAYERS", players });
        })
        .catch(err => console.log(err));
    } else {
      playerId = selectedPlayerId;
    }
    let whichCollection;
    if (teamAction === "batting" && currentInnings === "FIRST_INNINGS") {
      whichCollection = "firstInningsBatting";
    } else if (teamAction === "bowling" && currentInnings === "FIRST_INNINGS") {
      whichCollection = "firstInningsBowling";
    } else if (
      teamAction === "batting" &&
      currentInnings === "SECOND_INNINGS"
    ) {
      whichCollection = "secondInningsBatting";
    } else {
      whichCollection = "secondInningsBowling";
    }
    firestore
      .collection("matches")
      .doc(matchId)
      .collection(whichCollection)
      .doc(playerId)
      .set({
        id: playerId,
        name: name,
        addedBy: scorerId,
        addedByName: `${profile.firstName} ${profile.lastName}`,
        status: 1,
        createdAt: new Date()
      })
      .then(() => {
        // dispatch({ type: "CREATE_PLAYERS", players });
      })
      .catch(err => console.log(err));
  };
};

export const getTeamPlayers = (teamId, teamAction) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    console.log(teamId);
    firestore
      .collection("teams")
      .doc(teamId)
      .collection("players")
      .get()
      .then(somedoc => {
        if (somedoc.size > 0) {
          let teamData = [];
          somedoc.forEach(snapshot => {
            let teamSingleData = snapshot.data();
            console.log(teamData);
            teamData.push(teamSingleData);
          });
          if (teamAction === "batting") {
            dispatch({ type: "BATTING_TEAM_SQUAD", teamData });
          } else {
            dispatch({ type: "BOWLING_TEAM_SQUAD", teamData });
          }
          // console.log(somedoc.data());
        } else {
          console.log("no data available");
        }
      })
      .catch(err => console.log(err));
  };
};
