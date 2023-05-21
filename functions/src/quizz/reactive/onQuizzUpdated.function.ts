import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();
const logInfo = functions.logger.info;

export default functions.firestore
  .document('quizz/{quizzId}/questions/{questionId}')
  .onCreate(async (questionSnapshot, context) => {
    logInfo(
      `questionSnapshot: ${
        questionSnapshot.data()['question']
      } from the quizz ${context.params.quizzId}, ${context.params.questionId}`
    );
    
    // Get users ref
    const usersRef = db.collection('users');

    // Get users from the concerned class
    const usersSnapshot = await usersRef
      .where('classId', '==', questionSnapshot.data()['classId'])
      .get();

    // Check if no users
    if (usersSnapshot.empty) {
      logInfo('No matching documents.');
      return;
    }

    // Todo: add logic
    usersSnapshot.forEach(async (doc) => {
      logInfo(
        `${doc.data()['classId']}, ${doc.data()['name']}, ${
          doc.data()['notificationTokenId']
        }`
      );

    // Add question to quizz on user sc 
      await db
        .collection('users')
        .doc(doc.data()['id'])
        .collection('todoQuizz')
        .doc(context.params.quizzId)
        .collection('questions')
        .doc(context.params.questionId)
        .set(questionSnapshot.data(), { merge: true });
    });
  });
