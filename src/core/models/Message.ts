import { uuid } from 'utils/uuid';
import { User } from './User';

export enum MessageType {
  join = 'join',
  userJoin = 'userJoin',
  default = 'default',
  system = 'system',
}

export enum AdminMessageType {
  startQuiz = 'startQuiz',
  revealAnswer = 'revealAnswer',
  stopQuiz = 'stopQuiz',
}

export interface MessageProps {
  type: MessageType;
  content: string;
  user?: User;
}

export class Message implements MessageProps {
  id = uuid();
  type: MessageType;
  content: string;
  user?: User;

  constructor(props: MessageProps) {
    this.type = props.type;
    this.content = props.content;
    this.user = props.user;
  }

  get isSystem() {
    return this.user == null;
  }

  getAdminMessageType() {
    if (!this.user?.isAdmin) return undefined;

    const content = this.content as AdminMessageType;
    if (AdminMessageType[content] == null) return undefined;

    return content;
  }
}
