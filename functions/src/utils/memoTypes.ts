import { Timestamp } from 'firebase-admin/firestore';

export interface CalendarReturn {
  recallOne: Timestamp;
  recallTwo: Timestamp;
  recallThree: Timestamp;
  recallFour: Timestamp;
  recallFive: Timestamp;
  recallSix: Timestamp;
  recallSeven: Timestamp;
  recallEight: Timestamp;
  recallNine: Timestamp;
  recallTen: Timestamp;
}
export type Calendar = () => CalendarReturn;

export type IsMemoTimeReturn = {
  difference: number;
  isMemotime: boolean;
};

export type IsMemoTime = (memoDate: MemoDateData) => IsMemoTimeReturn;

export interface MemoDateData {
  lastRecallDay: Timestamp;
  nextRecallDay: Timestamp;
  calendar: CalendarReturn;
}
export type MemoDateFn = () => MemoDateData;

export type MemoParser = (memoDateStr: string) => MemoDateData;
