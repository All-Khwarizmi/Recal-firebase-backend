// import { initializeApp } from 'firebase-admin/app';
import { Request, Response } from 'express';
import { Post } from 'firebase-backend';
import * as admin from 'firebase-admin';
// initializeApp();

export default new Post(async (request: Request, response: Response) => {
  console.log(request.body['name']);
  const name = request.body['name'];
  const id = request.body['id'];
  const classId = request.body['classId'];

  const user = await admin
    .firestore()
    .collection('users')
    .doc(id)
    .set({ id, classId, name }, { merge: true });

  response.send(`${JSON.stringify(user)}`);
});
