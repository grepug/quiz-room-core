import { User } from './models/User';
import { Message, MessageType } from './models/Message';
import { uuid } from 'quiz-room-utils';

export interface RoomConfig {
  emitMessage: (msg: Message) => void;
  onAddUser?: (user: User) => void;
  saveMessage?: boolean;
}

export class Room {
  id = uuid();
  private users: Record<string, User> = {};
  private messages: Message[] = [];

  constructor(protected config: RoomConfig) {}

  handleIncomingMessage(msg: Message) {
    switch (msg.type) {
      case MessageType.join:
        this.addUser(msg.user);
        break;
      default:
        this.handleDefaultMessage(msg);
        break;
    }
  }

  protected handleDefaultMessage(msg: Message) {
    this.config.emitMessage(msg);

    if (this.config.saveMessage) {
      this.messages.push(msg);
    }
  }

  // 用户注册
  private addUser(user?: User) {
    if (!user) return;

    if (!this.users[user.id]) {
      this.users[user.id] = user;
      this.config.onAddUser?.(user);

      this.config.emitMessage(
        new Message({ type: MessageType.userJoined, user })
      );
    }

    return user;
  }

  // 查找已注册用户
  private getUser(id: string) {
    return this.users[id];
  }
}
