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
  /// Change logic cause quizz must exist and what's needs to be checked is the presence in general todoQuizz collection 

  try {
    const {
      userId,
      quizzName,
      nextStudyDay,
      userName,
      userNotificationTokenId,
      repetitions,
      previousInterval,
      previousEaseFactor,
    } = request.body;

   // const nextRecallDay = getNextRecallDay(studyDay);

    logInfo(
      `Executing in Quizz Done endpoint. The next one is ${nextStudyDay}`
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
        const { studySessions } = quizz.data()!;
        const newStudySessionsArr = [...studySessions, Timestamp.now()];
        
        await quizzRef.set(
          {
            lastStudyDay: Timestamp.now(),
            studySessions: newStudySessionsArr,
            nextStudyDay: Timestamp.fromDate(new Date(nextStudyDay)),
            previousEaseFactor,
            previousInterval,
            repetitions,
          },
          { merge: true }
        );

        // Updating todoQuizz on general collection
        await db
          .collection('generalTodoQuizzes')
          .doc()
          .set(
            {
              userId,
              quizzName,
              userName,
              lastStudyDay: Timestamp.now(),
              nextStudyDay: Timestamp.fromDate(new Date(nextStudyDay)),
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
          // TODO : change this to future date from calendar
          nextStudyDay: Timestamp.fromDate(new Date(nextStudyDay)),
          studySessions: [Timestamp.now()],
        },
        { merge: true }
      );

      // Adding todoQuizz to general collection
      await db
        .collection('generalTodoQuizzes')
        .doc()
        .set(
          {
            userId,
            quizzName,
            userName,
            lastStudyDay: Timestamp.now(),
            nextStudyDay: Timestamp.fromDate(new Date(nextStudyDay)),
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
