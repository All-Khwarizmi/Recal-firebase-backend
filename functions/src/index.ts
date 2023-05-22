import { FunctionParser } from 'firebase-backend';
import { initializeApp } from 'firebase-admin/app';
import * as functions from 'firebase-functions'

initializeApp();

export const logInfo = functions.logger.info

exports = new FunctionParser({ rootPath: __dirname, exports, verbose: true })
  .exports;


