import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { calendar } from '../../utils/recallHelpers';
import { v4 as uuidv4 } from 'uuid';

const db = admin.firestore();
const logInfo = functions.logger.info;

/**
 * On user created
 *    - add it to category
 *    - update it with already created quizzes
 *    - update user score +50 on creation
 *
 *
 */
export default functions.firestore
  .document('users/{userId}')
  .onCreate(async (userSnapshot, context) => {
    try {
      logInfo(
        `Executing reactive fn "on User Created that should fetch all quizzes from a matching class and update users"`
      );

      const { userName, userId, classId, userScore, userNotificationTokenId } =
        userSnapshot.data();
      logInfo(`${userName}, ${userId}, ${classId}`);
      const data = userSnapshot.data();

      // Get the quizzes
      const quizzes = await db
        .collection('quizz')
        .where('classId', '==', classId)
        .get();

      // Update user with quizzes
      quizzes.docs.forEach((doc) => {
        const {
          classId,
          image,
          quizzId,
          lastStudyDay,
          nextStudyDay,
          numberOfQuestions,
          studySessions,
          quizzName,
        } = doc.data();
        userSnapshot.ref.collection('todoQuizz').doc(quizzName).set({
          classId,
          quizzId,
          image,
          lastStudyDay,
          nextStudyDay,
          numberOfQuestions,
          studySessions,
          quizzName,
          calendar: calendar(),
        });
      });

      // Add to category
      // Todo : add a single responsability function
      const categoryRef = db.collection('category').doc(classId);

      await categoryRef.set(
        { categoryName: classId, categoryId: uuidv4() },
        { merge: true }
      );

      await categoryRef.collection('students').doc(userId).set(
        {
          userId,
          classId,
          userName,
          userNotificationTokenId,
          userScore,
        },
        { merge: true }
      );
      logInfo(`User created | add user to ${data.classId}`);
    } catch (e) {
      logInfo(`Error in on user created reactive function ${e}`);
    }
  });
