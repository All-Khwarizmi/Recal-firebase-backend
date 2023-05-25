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
  // Take care of updating studySessions array (object destructuring)

  try {
    const { userId, quizzName, studyDay, userName, userNotificationTokenId } =
      request.body;

    const nextRecallDay = getNextRecallDay(studyDay);

    logInfo(
      `Executing in Quizz Done endpoint. The last study day was ${studyDay} and the next one is ${nextRecallDay}`
    );
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

        await db.collection('generalTodoQuizzes').doc().set(
          {
            userId,
            quizzName,
            userName,
            lastStudyDay: Timestamp.now(),
            nextStudyDay: calendar[nextRecallDay!],
            userNotificationTokenId,
            status: 'scheduled',
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
        response.status(500).send(`Error in quizzDone endpoint: ${e}`);
      }
    } else {
      await quizzRef.set(
        {
          lastStudyDay: Timestamp.now(),
          // TODO : change this to futur date from calendar
          nextStudyDay: Timestamp.now(),
          studySessions: [Timestamp.now()],
        },
        { merge: true }
      );

      // Adding todoQuizz on general collection

      await db.collection('generalTodoQuizzes').doc().set(
        {
          userId,
          quizzName,
          userName,
          lastStudyDay: Timestamp.now(),
          nextStudyDay: Timestamp.now(),
          userNotificationTokenId,
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
