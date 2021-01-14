import { User, UserProps } from './models/User';
import { Message, MessageType } from './models/Message';
import { uuid } from 'quiz-room-utils';

export interface RoomConfig {
  emitMessage?: (msg: Message) => void;
  onUserJoin?: (user: User) => void;
  onUserLeave?: (userId: string) => void;
  onSaveMessage?: (message: Message) => void;
  saveMessage?: boolean;
  messages?: Message[];
}

export interface RoomProps {
  id: string;
  config: RoomConfig;
}

export class Room {
  id = uuid();
  users = new Map<string, User>([]);

  static fromJSON(props: RoomProps) {
    let room = new Room(props.config);
    room.id = props.id;

    return room;
  }

  constructor(public config: RoomConfig) {}

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
    const user = this.users.get(userId);

    if (!user) return;

    this.users.delete(userId);

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
    if (!this.config.messages?.length) return;

    const messages = this.config.messages.slice(-30) ?? [];

    return new Message({
      type: MessageType.init,
      content: JSON.stringify(messages),
    });
  }

  protected toJSON(): RoomProps {
    return {
      id: this.id,
      config: this.config,
    };
  }

  protected emitMessage(msg: Message) {
    this.config.emitMessage?.(msg);

    if (this.config.saveMessage) {
      if (msg.shouldSave) {
        this.config.messages?.push(msg);
        this.config.onSaveMessage?.(msg);
      }
    }
  }

  protected handleDefaultMessage(msg: Message) {
    this.emitMessage(msg);
  }

  // 用户注册
  private addUser(user?: User) {
    if (!user) return;

    this.users.set(user.id, user);

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
