import { uuid } from 'utils/uuid';
import { Answer } from './Answer';

export enum Role {
  user,
  admin,
}

export class User {
  id = uuid();
  name = '';
  answers: Answer[] = [];
  role = Role.user;

  constructor(props?: Partial<User>) {
    Object.assign(this, props);
  }

  get correctAnswerCount() {
    return this.answers.filter((el) => el.isCorrect).length;
  }

  get isAdmin() {
    return this.role === Role.admin;
  }
}
