import { User } from './models/User';
import { Message, MessageType } from './models/Message';
import { uuid } from 'quiz-room-utils';

export interface RoomConfig {
  emitMessage?: (msg: Message) => void;
  onUserJoin?: (user: User) => void;
  onUserLeave?: (userId: string) => void;
  saveMessage?: boolean;
}

export class Room {
  id = uuid();
  users: Record<string, User> = {};

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

  handleUserLeave(userId: string) {
    const user = this.users[userId];

    delete this.users[userId];

    this.config.onUserLeave?.(userId);

    this.emitMessage(
      new Message({
        type: MessageType.sys_userLeft,
        user,
        content: `${user.name} left`,
      })
    );
  }

  getInitMessage() {
    if (!this.messages.length) return;

    return new Message({
      type: MessageType.init,
      content: JSON.stringify(this.messages),
    });
  }

  protected emitMessage(msg: Message) {
    this.config.emitMessage?.(msg);

    if (this.config.saveMessage) {
      if (msg.shouldSave) {
        this.messages.push(msg);
      }
    }
  }

  protected handleDefaultMessage(msg: Message) {
    this.emitMessage(msg);
  }

  // 用户注册
  private addUser(user?: User) {
    if (!user) return;

    this.users[user.id] = user;

    this.config.onUserJoin?.(user);

    this.emitMessage(
      new Message({
        type: MessageType.sys_userJoined,
        user,
        content: `${user.name} joined`,
      })
    );

    return user;
  }
}
