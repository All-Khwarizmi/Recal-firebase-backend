import * as functions from 'firebase-functions';
// import * as admin from 'firebase-admin';
import { logInfo } from '..';

// const db = admin.firestore();

export default functions.pubsub.schedule(' * * * * *').onRun(() => {
  logInfo(`This is a message from the pubsub function`);
});
