import { Message, MessageType, MessageProps, User } from 'quiz-room-core';
import { ReactNode } from 'react';

interface QuizMessageProps extends MessageProps {}

interface MessageRenderProps {
  name: string;
  type: 'received' | 'sent';
  first: boolean;
  last: boolean;
  tail: boolean;
  text?: ReactNode;
  image?: string;
}

export class QuizMessage extends Message {
  prevMessage?: QuizMessage;
  nextMessage?: QuizMessage;

  constructor(props: QuizMessageProps) {
    super(props);
  }

  isSameSender(msg?: QuizMessage) {
    return (
      msg &&
      (Boolean(this.user?.isEqual(msg.user)) || (this.isSystem && msg.isSystem))
    );
  }

  get isFirst() {
    return !this.isSameSender(this.prevMessage);
  }

  get isLast() {
    return !this.isSameSender(this.nextMessage);
  }

  getRenderProps(me: User): MessageRenderProps {
    const isSent = this.user?.id === me.id;

    let text: ReactNode = this.content;
    if (this.isSystem) {
      text = <span style={{ color: 'blue' }}>{text}</span>;
    } else if (this.user?.isAdmin && !isSent) {
      text = <span style={{ color: 'red' }}>{text}</span>;
    }

    return {
      text,
      name: this.isSystem
        ? 'System'
        : this.user?.isAdmin
        ? `${this.user.name} (admin)`
        : this.user?.name ?? '',
      type: !isSent ? 'received' : 'sent',
      image: this.imageURL,
      first: this.isFirst,
      last: this.isLast,
      tail: !this.nextMessage,
    };
  }

  toJSON(): MessageProps {
    return super.toJSON();
  }
}
