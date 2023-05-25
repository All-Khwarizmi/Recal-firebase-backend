import * as functions from 'firebase-functions';
import { logInfo } from '..';
/* import { Timestamp } from 'firebase-admin/firestore';
import * as admin from 'firebase-admin';

 const db = admin.firestore(); */

export default functions.pubsub.schedule('0 1 * * *').onRun(async () => {
  logInfo(`This is a message from the pubsub function`);

  /*  try {
    const quizzList = await db
      .collection('generalTodoQuizzes')
      .where('nextStudyDay', '<=', Timestamp.now())
      .get();

    const testRef = db.collection('test');

    quizzList.docs.forEach(async (doc) => {
      const {
        userId,
        quizzName,
        userName,
        // lastStudyDay,
        // nextStudyDay,
        notificationTokenId,
        // status,
      } = doc.data();

      const docObj = {
        userName,
        notificationTokenId,
        quizzes: [quizzName],
      };

      await testRef.doc(userId).set(docObj, { merge: true });
    });
    logInfo(`List size: ${quizzList.size}`);
    logInfo(`List is empty: ${quizzList.empty}`);
  } catch (e) {
    logInfo(`Error in test endpoint: ${e}`);
   
  } */
});
