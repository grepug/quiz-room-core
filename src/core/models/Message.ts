import { uuid } from 'quiz-room-utils';
import { User, UserProps } from './User';

export enum MessageType {
  join = 'join',
  userJoin = 'userJoin',
  default = 'default',
  system = 'system',
  userJoined = 'userJoined',
  useLeft = 'userLeft',
  init = 'init',
  nofityUsersChange = 'notifyUsersChange',
}

export enum AdminMessageType {
  start = 'start',
  show = 'show',
  stop = 'stop',
}

export interface MessageProps {
  type: MessageType;
  content?: string;
  id?: string;
  user?: UserProps;
  imageURL?: string;
}

export class Message implements MessageProps {
  id = uuid();
  type: MessageType;
  content?: string;
  user?: User;
  imageURL?: string;

  static fromJSON({ user, ...props }: MessageProps): Message {
    let message = new Message(props);

    if (user) {
      message.user = new User(user);
    }

    return message;
  }

  constructor(props: MessageProps) {
    this.type = props.type;
    this.content = props.content;

    if (props.user) {
      this.user = new User(props.user);
    }
  }

  get isSystem() {
    return this.type === MessageType.system;
  }

  get shouldSave() {
    return [MessageType.default, MessageType.system].includes(this.type);
  }

  isEqual(message?: Message) {
    return message?.id === this.id;
  }

  getAdminMessageType() {
    if (!this.user?.isAdmin) return undefined;

    const content = this.content as AdminMessageType;
    if (AdminMessageType[content] == null) return undefined;

    return content;
  }

  toJSON(): MessageProps {
    return {
      id: this.id,
      type: this.type,
      content: this.content,
      user: this.user,
    };
  }
}
