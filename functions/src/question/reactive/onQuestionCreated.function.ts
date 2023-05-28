import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();
const logInfo = functions.logger.info;

export default functions.firestore
  .document('quizz/{quizzId}/questions/{questionId}')
  .onCreate(async (questionSnapshot, context) => {
    try {
      logInfo(`Executing in on question created reactive function`);

      const { questionId, quizzId } = context.params;
      const { classId } = questionSnapshot.data();

      // Update number of questions field in Quizz
      const quizzInRootCollectionRef = db.collection('quizz').doc(quizzId);
      const quizzInRootCollectionSnapshot =
        await quizzInRootCollectionRef.collection("questions").get();

      let numberOfQuestionsInQuizz = 0;

      // Checking if doc exists and updating it if so
      if (!quizzInRootCollectionSnapshot.empty) {
        const  oldNumberOfQuestionsInRootQuizz =
          quizzInRootCollectionSnapshot.size;

        numberOfQuestionsInQuizz = oldNumberOfQuestionsInRootQuizz;
        await quizzInRootCollectionRef.set(
          { numberOfQuestions: oldNumberOfQuestionsInRootQuizz },
          { merge: true }
        );
      }

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

      // Add question to quizz on user sc
      usersSnapshot.forEach(async (doc) => {
        const { userNotificationTokenId } = doc.data();
        //  todoQuizz ref
        const userTodoQuizzRef = db
          .collection('users')
          .doc(userNotificationTokenId)
          .collection('todoQuizz')
          .doc(quizzId);


        // Updating todoQuizz
        await userTodoQuizzRef.set(
          {
            numberOfQuestions: numberOfQuestionsInQuizz,
          },
          { merge: true }
        );

        // Adding question data to todoQuizz sc
        await db
          .collection('users')
          .doc(userNotificationTokenId)
          .collection('todoQuizz')
          .doc(quizzId)
          .collection('questions')
          .doc(questionId)
          .set(questionSnapshot.data(), { merge: true });
      });
    } catch (e) {
      logInfo(`Error in on question created reactive function ${e}`);
    }
  });
