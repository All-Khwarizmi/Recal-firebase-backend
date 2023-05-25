import * as admin from 'firebase-admin';
import { Response, Request } from 'express';
import { Post } from 'firebase-backend';
import { logInfo } from '../..';

const db = admin.firestore();

export default new Post(async (request: Request, response: Response) => {
  try {
    logInfo(`Executing in endpoint Create Question`);
    const { quizzName, question, correctAnswer, answers, classId, questionId } =
      request.body;

    await db
      .collection('quizz')
      .doc(quizzName)
      .collection('questions')
      .doc(questionId)
      .set(
        { question, correctAnswer, answers, quizzName, classId, questionId },
        { merge: true }
      );

    response.status(201).send(`Question created successfully`);
  } catch (e) {
    logInfo(`Error in endpoint Create Question ${e}`);
    response.status(500).send(`Error in endpoint Create Question ${e}`);
  }
});
