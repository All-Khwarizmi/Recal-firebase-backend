import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();
const logInfo = functions.logger.info;

export default functions.firestore
  .document('quizz/{quizzId}')
  .onCreate(async (quizzSnapshot, context) => {
    logInfo(
      `Executing reactive fn "on Quizz created that should fetch all users from a matching class and update users"`
    );
    try {
      const { classId, quizzName } = quizzSnapshot.data()!;
      const data = quizzSnapshot.data();

      // Get users ref
      const usersRef = db.collection('users');

      // Get users from the concerned class
      const usersSnapshot = await usersRef
        .where('classId', '==', classId)
        .get();

      // Check if no users
      if (usersSnapshot.empty) {
        logInfo('No matching documents.');
        return;
      }

      // Update users
      usersSnapshot.forEach(async (doc) => {
        const { classId, userName, userNotificationTokenId, userId } = doc.data();
        logInfo(`${classId}, ${userName}, ${userNotificationTokenId}`);

        // Add quizz on user sc
        // Todo : use doc.ref to update user
        await db
          .collection('users')
          .doc(userId)
          .collection('todoQuizz')
          .doc(quizzName)
          .set(data!, { merge: true });
      });
    } catch (e) {
      logInfo(`Error in endpoint fn "on Quizz created" ${e}`);
    }
  });
