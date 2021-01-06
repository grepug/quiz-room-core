import { Message, MessageType, MessageProps, User } from 'quiz-room-core';

interface QuizMessageProps extends MessageProps {}

interface MessageRenderProps {
  name: string;
  type: 'received' | 'sent';
  first: boolean;
  last: boolean;
  tail: boolean;
  text?: string;
  image?: string;
}

export class QuizMessage extends Message {
  prevMessage?: QuizMessage;
  nextMessage?: QuizMessage;

  constructor(props: QuizMessageProps) {
    super(props);
  }

  getRenderProps(me: User): MessageRenderProps {
    return {
      text: this.content,
      name: this.user?.name ?? 'System',
      type: this.user?.id !== me.id ? 'received' : 'sent',
      image: this.imageURL,
      first: !this.user?.isEqual(this.prevMessage?.user),
      last: !this.user?.isEqual(this.nextMessage?.user),
      tail: !this.nextMessage,
    };
  }

  toJSON(): MessageProps {
    return super.toJSON();
  }
}
