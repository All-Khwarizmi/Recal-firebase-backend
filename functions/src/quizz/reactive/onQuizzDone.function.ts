import * as functions from 'firebase-functions';
import { logInfo } from '../..';
// import * as admin from 'firebase-admin';

/**
 * Update general todos collection on quizz done trigger
 *  */
export default functions.firestore
  .document('users/{userId}/todoQuizz/{todoQuizzId}')
  .onWrite((event, context) => {
    logInfo(`Executing reactive fn "on Quizz Done Update GeneralTodos"`);

    // Destructuring event data
    logInfo(event.after.data());

    // Create/update general quizz collection

    try {
    } catch (e) {
      logInfo(`Error in on Quizz Done Update GeneralTodos" reactive fn: ${e}`);
    }
  });
