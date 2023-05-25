import * as admin from 'firebase-admin';
import { Request, Response } from 'express';
import { Post } from 'firebase-backend';
import QuizzCreator from '../../utils/quizzCreator';
import { logInfo } from '../..';

const db = admin.firestore();
export default new Post(async (request: Request, response: Response) => {
  try {
    const { quizzId, classId, quizzName, userNotificationTokenId } =
      request.body;

    logInfo(`Executing endpoint fn "create quizz"`);

    const newQuizz = new QuizzCreator(
      quizzName,
      classId,
      quizzId,
      userNotificationTokenId
    );
    const quizz = newQuizz.create();

    await db.collection('quizz').doc(quizzName).set(quizz, { merge: true });

    response.status(201).send(`Quiz ${quizzName} created successfully`);
    
  } catch (e) {
    logInfo(`Error in createQuiz endpoint ${e}`);
    response.status(500).send(`Error in createQuiz endpoint ${e}`);
  }
});
