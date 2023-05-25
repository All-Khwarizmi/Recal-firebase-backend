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
    logInfo(
      `Executing reactive fn "on User Created that should fetch all quizzes from a matching class and update users"`
    );

    const { name, userId, classId, score, notificationTokenId } =
      userSnapshot.data();
    logInfo(`${name}, ${userId}, ${classId}`);
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
        userId,
        image,
        lastStudyDay,
        nextStudyDay,
        numberOfQuestions,
        studySessions,
        quizName,
      } = doc.data();
      userSnapshot.ref.collection('todoQuizz').doc(doc.data().quizzName).set({
        classId,
        userId,
        image,
        lastStudyDay,
        nextStudyDay,
        numberOfQuestions,
        studySessions,
        quizName,
        calendar: calendar(),
      });
    });

    // Add to category
    // Todo : add a single responsability function
    const categoryRef = db.collection('category').doc(classId);

    await categoryRef.set({ name: classId, categoryId: uuidv4() }, { merge: true });

    await categoryRef.collection('students').doc(userId).set(
      {
        userId,
        classId,
        name,
        notificationTokenId,
        score,
      },
      { merge: true }
    );
    logInfo(`User created | add user to ${data.classId}`);
  });
