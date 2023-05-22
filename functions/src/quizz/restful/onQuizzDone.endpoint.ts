import * as admin from 'firebase-admin';
import { logInfo } from '../..';
import { Post } from 'firebase-backend';
import { Request, Response } from 'express';

const db = admin.firestore();

/**
 * Endpoint to update a user quizz sub-collection
 *
 * */
export default new Post(async (request: Request, response: Response) => {
  const { userId, quizzName, studyDay } = request.body;

  logInfo(
    `Executing in onQuizzDone endpoint. The last study day was ${studyDay}`
  );
  
  try {
    try {
      const quizzRef = db
        .collection('users')
        .doc(userId)
        .collection('todoQuizz')
        .doc(quizzName);

      logInfo(`quizzRef = ${quizzRef}`);
      const res = await db.runTransaction(async (t) => {
        const doc = await t.get(quizzRef);
        if (doc.data()!.studySessions) {
          const newStudySessionsArr = [
            ...doc.data()!['studySessions'],
            'jeudi',
          ];
          logInfo(`Study session array not undefined = ${newStudySessionsArr}`);
          await t.update(quizzRef, { studySessions: newStudySessionsArr });
        }
      });
      response.status(201).send(res);
    } catch (e) {
      logInfo(
        `Error in onQuizzDone endpoint. Try adding a single day in array ${e}`
      );
      const userQuizzUpdated = await db
        .collection('users')
        .doc(userId)
        .collection('todoQuizz')
        .doc(quizzName)
        .set(
          {
            lastStudyDay: Date.now(),
            nextStudyDay: Date.now(),
            studySessions: ['mardi'],
          },
          { merge: true }
        );
      response.status(201).send(userQuizzUpdated);
    }
  } catch (e) {
    logInfo(`Error in onQuizzDone endpoint: ${e}`);
    response.status(500).send(`Error in onQuizzDone endpoint: ${e}`);
  }
});
