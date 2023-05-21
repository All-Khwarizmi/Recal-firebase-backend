import * as admin from 'firebase-admin';
import { Response, Request } from 'express';
import { Post } from 'firebase-backend';

const db = admin.firestore();

export default new Post(async (request: Request, response: Response) => {
  const { quizzName, question, correctAnswer, answers, classId, id } =
    request.body;

  const questionCreation = await db
    .collection('quizz')
    .doc(quizzName)
    .collection('questions')
    .doc(id)
    .set(
      { question, correctAnswer, answers, quizzName, classId },
      { merge: true }
    );

  response.status(201).send({ questionCreation });
});
