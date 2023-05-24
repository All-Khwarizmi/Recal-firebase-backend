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

    const quizzMap = new Map();
    quizzMap.set('test', 'value');

    quizzList.docs.forEach(async (doc) => {
      const {
        userId,
        quizzName,
        userName,
        lastStudyDay,
        nextStudyDay,
        notificationTokenId,
        status,
      } = doc.data();

      if (quizzMap.has(userId)) {
        const cacheDoc = quizzMap.get(userId);
        logInfo(`Cachedoc: ${JSON.stringify(cacheDoc)}`);
        cacheDoc['quizzes'].push(quizzName);
      } else {
        const docObj = {
          userName,
          notificationTokenId,
          quizzes: [quizzName],
        };
        logInfo(`Docobj: ${JSON.stringify(docObj)}`);
        quizzMap.set(userId, docObj);
        await testRef.doc(userId).set({ docObj }, { merge: true });
      }

      logInfo(`Here is the doc ${userId},
          ${quizzName},
          ${userName},
          ${lastStudyDay},
          ${nextStudyDay},
          ${notificationTokenId},
          ${status}`);
      logInfo(`Here is the map${quizzMap}`);
    });
    logInfo(`List size: ${quizzList.size}`);
    logInfo(`List is empty: ${quizzList.empty}`);
    response.send(quizzMap);
  } catch (e) {
    logInfo(`Error in test endpoint: ${e}`);
    response.status(500).send(`Error in test endpoint: ${e}`);
  }
});
