import * as admin from 'firebase-admin';
import { Request, Response } from 'express';
import { Post } from 'firebase-backend';

const db = admin.firestore();
export default new Post(async (request: Request, response: Response) => {
  const { id, classId, name } = request.body;

  const classe = await db
    .collection('quizz')
    .doc(name)
    .set({ id, classId, name }, { merge: true });

  response.status(201).send({ classe });
});
