import { faker } from '@faker-js/faker';
import { CalendarReturn } from './memoTypes';
import { calendar } from './recallHelpers';
import { Timestamp } from 'firebase-admin/firestore';

export default class QuizzCreator {
  constructor(name: string, classId: string, id: string) {
    this.name = name;
    this.classId = classId;
    this.id = id;
  }

  name: string;
  image: string = faker.image.url({});
  classId: string;
  id: string;
  nextStudyDay: Timestamp = Timestamp.now();
  lastStudyDay: Timestamp | null = null;
  numberOfquestions?: number;
  studySessions: Array<Timestamp> = [];
  calendar: CalendarReturn = calendar();

  create(): Object {
    return {
      name: this.name,
      image: this.image,
      classId: this.classId,
      id: this.id,
      nextStudyDay: this.nextStudyDay,
      lastStudyDay: this.lastStudyDay,
      numberOfQuestions: this.numberOfquestions ?? 0,
      studySessions: this.studySessions,
      calendar: this.calendar,
    };
  }
}
