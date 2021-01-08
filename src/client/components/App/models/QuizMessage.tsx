import { Message, MessageType, MessageProps, User } from 'quiz-room-core';
import { CSSProperties, ReactNode } from 'react';

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
    if (!msg) {
      return false;
    }

    if (this.isSystem || msg.isSystem) {
      return this.isSystem && msg.isSystem;
    }

    return Boolean(this.user?.isEqual(msg.user));
  }

  get isFirst() {
    return !this.isSameSender(this.prevMessage);
  }

  get isLast() {
    return !this.isSameSender(this.nextMessage);
  }

  getRenderProps(me: User): MessageRenderProps {
    const isSent = this.user?.id === me.id && !this.isSystem;

    let text: ReactNode = this.content;

    if (this.isSystem) {
      text = <WrapText color="blue" text={text} />;
    } else if (this.user?.isAdmin && !isSent) {
      text = <WrapText color="red" text={text} />;
    }

    return {
      text,
      name: this.isSystem
        ? 'System'
        : this.user?.isAdmin
        ? `${this.user.name} (host)`
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

function WrapText(props: { text?: ReactNode; color?: string }) {
  const style: CSSProperties = { color: props.color };

  if (typeof props.text !== 'string') {
    return <span style={style}>{props.text}</span>;
  }

  const ps = props.text?.split('\n') ?? [];

  return (
    <div style={style}>
      {ps.map((el, i) => (
        <div key={i}>{el}</div>
      ))}
    </div>
  );
}
