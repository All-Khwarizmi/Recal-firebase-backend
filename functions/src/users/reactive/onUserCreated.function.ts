import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

export default functions.firestore
  .document('users/{userId}')
  .onCreate(async (userSnapshot, context) => {
    const data = userSnapshot.data();
    const category = await db
      .collection('category')
      .doc(data.classId)
      .collection('students')
      .doc(data.id)
      .set(
        {
          id: data.id,
          classId: data.classId,
          name: data.name,
          notificationTokenId: data.notificationTokenId,
        },
        { merge: true }
      );
    functions.logger.info(
      `User created | add user to ${category} ${data.classId}`
    );
    console.log(`User created | add user to ${category} ${data.classId}`);
  });
