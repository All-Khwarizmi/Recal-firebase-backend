import { Request, Response } from 'express';
import { Post } from 'firebase-backend';
import * as admin from 'firebase-admin';
import { logInfo } from '../..';

export default new Post(async (reququest: Request, response: Response) => {
  try {
    const { userName, notificationTokenId, userId, classId } = reququest.body;

    await admin
      .firestore()
      .collection('users')
      .doc(userId)
      .set(
        { userId, classId, userName, notificationTokenId, userScore: 50 },
        { merge: true }
      );

    response
      .status(201)
      .send(`User ${userName} from class ${classId} created successfully`);
  } catch (e) {
    logInfo(`Error in Create User endpoint ${e}`);
    response.status(500).send(`Error in Create User endpoint ${e}`);
  }
});
