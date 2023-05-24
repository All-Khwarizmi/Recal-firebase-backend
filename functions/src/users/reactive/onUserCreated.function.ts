import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { calendar } from '../../utils/recallHelpers';

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
    const { name, id, classId } = userSnapshot.data();
    logInfo(`${name}, ${id}, ${classId}`);
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
        id,
        image,
        lastStudyDay,
        nextStudyDay,
        numberOfQuestions,
        studySessions,
        name,
      } = doc.data();
      userSnapshot.ref.collection('todoQuizz').doc(doc.data().name).set({
        classId,
        id,
        image,
        lastStudyDay,
        nextStudyDay,
        numberOfQuestions,
        studySessions,
        name,
        calendar: calendar(),
      });
    });

    // Add to category
    // Todo : add a single responsability function

    await db
      .collection('category')
      .doc(classId)
      .collection('students')
      .doc(id)
      .set(
        {
          id: data.id,
          classId: data.classId,
          name: data.name,
          notificationTokenId: data.notificationTokenId,
        },
        { merge: true }
      );
    logInfo(`User created | add user to ${data.classId}`);
  });
