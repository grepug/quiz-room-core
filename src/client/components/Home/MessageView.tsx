import { useEffect, useRef } from 'react';
import { useContext } from './Context';
import { MessageItem } from './MessageItem';
import { Message } from 'quiz-room-core';

export function MessageView({ messages }: { messages: Message[] }) {
  const ref = useRef<HTMLDivElement | null>();

  useEffect(() => {
    ref.current?.scrollTo({
      behavior: 'smooth',
      top: ref.current.scrollHeight,
    });
  }, [messages]);

  return (
    <div
      ref={(r) => (ref.current = r)}
      style={{
        width: '100%',
        height: 500,
        border: '1px solid',
        padding: 24,
        overflow: 'auto',
      }}
    >
      {messages.map((el) => (
        <MessageItem key={el.id} msg={el} />
      ))}
    </div>
  );
}
