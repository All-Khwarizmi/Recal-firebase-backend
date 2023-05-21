// import { initializeApp } from 'firebase-admin/app';
import { Request, Response } from 'express';
import { Post } from 'firebase-backend';
import * as admin from 'firebase-admin';
//initializeApp();

export default new Post(async (reququest: Request, response: Response) => {
  const { name, notificationTokenId, id, classId } = reququest.body;

  const user = await admin
    .firestore()
    .collection('users')
    .doc(id)
    .set({ id, classId, name, notificationTokenId }, { merge: true });

 /*  const category = await admin
    .firestore()
    .collection('category')
    .doc(classId)
    .collection('students')
    .doc(id)
    .set({ id, classId, name, notificationTokenId }, { merge: true }); */

  response.status(201).send({ user });
});
