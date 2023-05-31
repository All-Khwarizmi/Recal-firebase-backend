import { faker } from '@faker-js/faker';
import { CalendarReturn } from './memoTypes';
import { calendar } from './recallHelpers';
import { Timestamp } from 'firebase-admin/firestore';

export default class QuizzCreator {
  constructor(
    quizzName: string,
    classId: string,
    quizzId: string,
    userNotificationTokenId: string
  ) {
    this.quizzName = quizzName;
    this.classId = classId;
    this.quizzId = quizzId;
    this.userNotificationTokenId = userNotificationTokenId;
  }

  quizzName: string;
  image: string = faker.image.url({});
  classId: string;
  userNotificationTokenId: string;
  quizzId: string;
  nextStudyDay: Timestamp = Timestamp.now();
  lastStudyDay: Timestamp | null = null;
  numberOfquestions?: number;
  studySessions: Array<Timestamp> = [];
  calendar: CalendarReturn = calendar();
  repetitions: number = 0;
  previousInterval: number = 0;
  previousEaseFactor: number = 2.5;

  create(): Object {
    return {
      quizzName: this.quizzName,
      image: this.image,
      classId: this.classId,
      quizzId: this.quizzId,
      nextStudyDay: this.nextStudyDay,
      lastStudyDay: this.lastStudyDay,
      numberOfQuestions: this.numberOfquestions ?? 0,
      studySessions: this.studySessions,
      calendar: this.calendar,
      userNotificationTokenId: this.userNotificationTokenId,
      repetitions: this.repetitions,
      previousInterval: this.previousInterval,
      previousEaseFactor: this.previousEaseFactor,
    };
  }
}
