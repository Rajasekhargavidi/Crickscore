const functions = require("firebase-functions");
const admin = require("firebase-admin");
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
