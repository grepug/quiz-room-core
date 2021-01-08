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
  role = Role.user;

  constructor(props?: Partial<UserProps>) {
    Object.assign(this, props);
  }

  get isAdmin() {
    return this.role === Role.admin;
  }

  isEqual(user?: User) {
    return user?.id === this.id;
  }

  toJSON(): UserProps {
    return {
      id: this.id,
      name: this.name,
      role: this.role,
    };
  }
}
