import * as functions from 'firebase-functions';
//import * as admin from 'firebase-admin';

//const db = admin.firestore();
const logInfo = functions.logger.info;
/**
 * On user created fetch all the quizz and it to user
 *
 */
export default functions.firestore
  .document('users/{userId}')
  .onCreate((event, context) => {
    logInfo(`${context.params.userId}`);
    const { name, id, classId } = event.data();
    logInfo(`${name}, ${id}, ${classId}`);
  });
