import { uuid } from 'quiz-room-utils';
import { Answer } from './Answer';

export enum Role {
  user,
  admin,
}

export interface UserProps {
  id: string;
  name: string;
  role: Role;
}

export class User implements UserProps {
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

  toJSON(): UserProps {
    return {
      id: this.id,
      name: this.name,
      role: this.role,
    };
  }
}
