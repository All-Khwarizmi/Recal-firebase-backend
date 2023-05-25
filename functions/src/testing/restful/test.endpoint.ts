import { Request, Response } from 'express';
import { Get } from 'firebase-backend';
import * as admin from 'firebase-admin';
import { logInfo } from '../..';
import { Timestamp } from 'firebase-admin/firestore';

const db = admin.firestore();

export default new Get(async (request: Request, response: Response) => {
  logInfo(`Executing in Test endpoint. `);
  try {
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
    response.send('ok');
  } catch (e) {
    logInfo(`Error in test endpoint: ${e}`);
    response.status(500).send(`Error in test endpoint: ${e}`);
  }
});
