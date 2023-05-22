import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();
const logInfo = functions.logger.info;

export default functions.firestore
  .document('quizz/{quizzId}')
  .onCreate(async (quizzSnapshot, context) => {
    const data = quizzSnapshot.data();
    logInfo(
      `quizzSnapshot: ${data['name']} from the quizz ${context.params.quizzId}`
    );

    // Get users ref
    const usersRef = db.collection('users');

    // Get users from the concerned class
    const usersSnapshot = await usersRef
      .where('classId', '==', data['classId'])
      .get();

    // Check if no users
    if (usersSnapshot.empty) {
      logInfo('No matching documents.');
      return;
    }

    // Update users
    usersSnapshot.forEach(async (doc) => {
      logInfo(
        `${doc.data()['classId']}, ${doc.data()['name']}, ${
          doc.data()['notificationTokenId']
        }`
      );

      // Add quizz on user sc
      await db
        .collection('users')
        .doc(doc.data()['id'])
        .collection('todoQuizz')
        .doc(data['name'])
        .set(data, { merge: true });
    });
  });
