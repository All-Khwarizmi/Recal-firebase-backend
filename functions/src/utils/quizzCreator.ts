import { faker } from '@faker-js/faker';
import { CalendarReturn } from './memoTypes';
import { calendar } from './recallHelpers';

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
  nextStudyDay: number = Date.now();
  lastStudyDay: number | null = null;
  numberOfquestions?: number;
  studySessions: Array<number> = [];
  calendar: CalendarReturn = calendar();

  create(): Object {
    return {
      name: this.name,
      image: this.image,
      classId: this.classId,
      id: this.id,
      nextStudyDay: this.nextStudyDay,
      lastStudyDay: this.lastStudyDay,
      numberOfquestions: this.numberOfquestions ?? 0,
      studySessions: this.studySessions,
      calendar: this.calendar,
    };
  }
}
