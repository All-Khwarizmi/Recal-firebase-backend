import * as admin from 'firebase-admin';
import { Request, Response } from 'express';
import { Post } from 'firebase-backend';
import QuizzCreator from '../../utils/quizzCreator';
import { logInfo } from '../..';

const db = admin.firestore();
export default new Post(async (request: Request, response: Response) => {
  const { id, classId, name, notificationTokenId } = request.body;

  logInfo(`Executing endpoint fn "create quizz"`);

  const newQuizz = new QuizzCreator(name, classId, id, notificationTokenId);
  const quizz = newQuizz.create();
  
  try {
    
    const quizzDb = await db
      .collection('quizz')
      .doc(name)
      .set(quizz, { merge: true });
    logInfo(quizzDb);
  } catch (e) {
    logInfo(`Error in createQuiz endpoint ${e}`);
  }

  response.status(201).send({ quizz });
});
