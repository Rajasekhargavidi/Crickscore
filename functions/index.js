const functions = require("firebase-functions");
const admin = require("firebase-admin");
const lodash = require("lodash");
admin.initializeApp(functions.config().firebase);

const createFirstInningsScore = (finalScore, matchId) => {
  return admin
    .firestore()
    .collection("matches")
    .doc(matchId)
    .set(finalScore, { merge: true })
    .then(doc => {
      console.log(doc);
    });
};

const createFirstInningsStrikerScore = (striker, matchId) => {
  return admin
    .firestore()
    .collection("matches")
    .doc(matchId)
    .collection("firstInningsBatting")
    .doc(striker.id)
    .set(striker, { merge: true })
    .then(doc => {
      console.log(doc);
    });
};

const createFirstInningsNonStrikerScore = (nonStriker, matchId) => {
  return admin
    .firestore()
    .collection("matches")
    .doc(matchId)
    .collection("firstInningsBatting")
    .doc(nonStriker.id)
    .set(nonStriker, { merge: true })
    .then(doc => {
      console.log(doc);
    });
};

const createFirstInningsBowlerScore = (bowler, matchId) => {
  return admin
    .firestore()
    .collection("matches")
    .doc(matchId)
    .collection("firstInningsBowling")
    .doc(bowler.id)
    .set(bowler, { merge: true })
    .then(doc => {
      console.log(doc);
    });
};

const createSecondInningsStrikerScore = (striker, matchId) => {
  return admin
    .firestore()
    .collection("matches")
    .doc(matchId)
    .collection("secondInningsBatting")
    .doc(striker.id)
    .set(striker, { merge: true })
    .then(doc => {
      console.log(doc);
    });
};

const createSecondInningsNonStrikerScore = (nonStriker, matchId) => {
  return admin
    .firestore()
    .collection("matches")
    .doc(matchId)
    .collection("secondInningsBatting")
    .doc(nonStriker.id)
    .set(nonStriker, { merge: true })
    .then(doc => {
      console.log(doc);
    });
};

const createSecondInningsBowlerScore = (bowler, matchId) => {
  return admin
    .firestore()
    .collection("matches")
    .doc(matchId)
    .collection("secondInningsBowling")
    .doc(bowler.id)
    .set(bowler, { merge: true })
    .then(doc => {
      console.log(doc);
    });
};

exports.firstInningsScoreCreated = functions.firestore
  .document("matches/{matchId}/firstInningsScore/{scoreId}")
  .onWrite((change, context) => {
    const score = change.after.data();
    const finalScore = {
      firstInningsRuns: score.totalRuns,
      firstInningsWickets: score.totalWickets,
      firstInningsOvers: score.currentOver,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    return createFirstInningsScore(finalScore, context.params.matchId);
  });

exports.secondInningsScoreCreated = functions.firestore
  .document("matches/{matchId}/secondInningsScore/{scoreId}")
  .onWrite((change, context) => {
    const score = change.after.data();
    const finalScore = {
      secondInningsRuns: score.totalRuns,
      secondInningsWickets: score.totalWickets,
      secondInningsOvers: score.currentOver,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    return createFirstInningsScore(finalScore, context.params.matchId);
  });

exports.firstInningsStrikerScore = functions.firestore
  .document("matches/{matchId}/firstInningsScore/{scoreId}")
  .onWrite((change, context) => {
    const score = change.after.data();
    let localStriker = score.striker;
    if (lodash.isEmpty(localStriker)) return null;
    return createFirstInningsStrikerScore(localStriker, context.params.matchId);
  });

exports.firstInningsNonStrikerScore = functions.firestore
  .document("matches/{matchId}/firstInningsScore/{scoreId}")
  .onWrite((change, context) => {
    const score = change.after.data();
    let localNonStriker = score.nonStriker;
    if (lodash.isEmpty(localNonStriker)) return null;
    return createFirstInningsNonStrikerScore(
      localNonStriker,
      context.params.matchId
    );
  });

exports.firstInningsBowlerScore = functions.firestore
  .document("matches/{matchId}/firstInningsScore/{scoreId}")
  .onWrite((change, context) => {
    const score = change.after.data();
    let localBowler = score.bowler;
    if (lodash.isEmpty(localBowler)) return null;
    return createFirstInningsBowlerScore(localBowler, context.params.matchId);
  });

exports.secondInningsStrikerScore = functions.firestore
  .document("matches/{matchId}/secondInningsScore/{scoreId}")
  .onWrite((change, context) => {
    const score = change.after.data();
    let localStriker = score.striker;
    if (lodash.isEmpty(localStriker)) return null;
    return createSecondInningsStrikerScore(
      localStriker,
      context.params.matchId
    );
  });

exports.secondInningsNonStrikerScore = functions.firestore
  .document("matches/{matchId}/secondInningsScore/{scoreId}")
  .onWrite((change, context) => {
    const score = change.after.data();
    let localNonStriker = score.nonStriker;
    if (lodash.isEmpty(localBowler)) return null;
    return createSecondInningsNonStrikerScore(
      localNonStriker,
      context.params.matchId
    );
  });

exports.secondInningsBowlerScore = functions.firestore
  .document("matches/{matchId}/secondInningsScore/{scoreId}")
  .onWrite((change, context) => {
    const score = change.after.data();
    let localBowler = score.bowler;
    if (lodash.isEmpty(localBowler)) return null;
    return createSecondInningsBowlerScore(localBowler, context.params.matchId);
  });

// exports.userCreated = functions.auth.user().onCreate(user => {
//   return admin
//     .firestore()
//     .collection("users")
//     .doc(user.uid)
//     .get()
//     .then(doc => {
//       const newUser = doc.data();
//       const notification = {
//         content: "joined the app",
//         user: `${newUser.firstName} ${newUser.lastName}`,
//         time: admin.firestore.FieldValue.serverTimestamp()
//       };
//       return createFirstInningsScore(notification);
//     });
// });
