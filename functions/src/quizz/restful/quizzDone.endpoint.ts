import * as admin from 'firebase-admin';
import { logInfo } from '../..';
import { Post } from 'firebase-backend';
import { Request, Response } from 'express';
import { getNextRecallDay } from '../../utils/recallHelpers';
import { Timestamp } from 'firebase-admin/firestore';

const db = admin.firestore();

/**
 * Endpoint to update a user quizz sub-collection
 *
 * */
export default new Post(async (request: Request, response: Response) => {
  // Todo :
  // need more args : userNotificationToken, classId, userName
  // need helper to determine when to take quizz again
  // Take care of updating studySessions array (object destructuring)
  const { userId, quizzName, studyDay, notificationTokenId, userName } =
    request.body;

  const nextRecallDay = getNextRecallDay(studyDay);

  logInfo(
    `Executing in onQuizzDone endpoint. The last study day was ${studyDay} and the next one is ${nextRecallDay}`
  );

  try {
    // Update user quizzTodo sub collection

    // Getting doc ref
    const quizzRef = db
      .collection('users')
      .doc(userId)
      .collection('todoQuizz')
      .doc(quizzName);

    // Getting doc
    const quizz = await quizzRef.get();

    // Updating/creating doc
    if (quizz.exists) {
      try {
        const { studySessions, calendar } = quizz.data()!;
        const newStudySessionsArr = [...studySessions, Timestamp.now()];

        await quizzRef.set(
          {
            lastStudyDay: Timestamp.now(),
            studySessions: newStudySessionsArr,
            nextStudyDay: calendar[nextRecallDay!],
          },
          { merge: true }
        );

        // Updating todoQuizz on general collection

        await db
          .collection('generalTodoQuizzes')
          .doc(userId)
          .collection('generalTodoQuizz')
          .doc(quizzName)
          .set(
            {
              lastStudyDay: Timestamp.now(),
              nextStudyDay: calendar[nextRecallDay!],
            },
            { merge: true }
          );

        response
          .status(201)
          .send(
            `Updating user ${userName} todo quizz ${quizzName}. StudySessions? = true`
          );
      } catch (e) {
        logInfo(
          `Error in QuizzDone endpoint. There's no studySessions array. Creating one...  ${e}`
        );
      }
    } else {
      await quizzRef.set(
        {
          lastStudyDay: Timestamp.now(),
          nextStudyDay: Timestamp.now(),
          studySessions: ['recallOne'],
        },
        { merge: true }
      );

      // Adding todoQuizz on general collection

      await db
        .collection('generalTodoQuizzes')
        .doc(userId)
        .collection('generalTodoQuizz')
        .doc(quizzName)
        .set(
          {
            userId,
            quizzName,
            userName,
            lastStudyDay: Timestamp.now(),
            nextStudyDay: Timestamp.now(),
            notificationTokenId,
            status: 'scheduled',
          },
          { merge: true }
        );

      response
        .status(201)
        .send(`Creating user ${userName} todo quizz ${quizzName}.`);
    }
  } catch (e) {
    logInfo(`Error in quizzDone endpoint: ${e}`);
    response.status(500).send(`Error in quizzDone endpoint: ${e}`);
  }
});
