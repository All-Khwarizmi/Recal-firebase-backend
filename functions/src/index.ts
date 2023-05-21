import { FunctionParser } from 'firebase-backend';
import { initializeApp } from 'firebase-admin/app';

initializeApp();
exports = new FunctionParser({ rootPath: __dirname, exports, verbose: true })
  .exports;
