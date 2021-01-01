import { useEffect, useRef } from 'react';
import { useContext } from './Context';
import { MessageItem } from './MessageItem';

export function MessageView() {
  const ctx = useContext()!;
  const ref = useRef<HTMLDivElement | null>();

  useEffect(() => {
    ref.current?.scrollTo({
      behavior: 'smooth',
      top: ref.current.scrollHeight,
    });
  }, [ctx.messages]);

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
      {ctx.messages.map((el) => (
        <MessageItem key={el.id} msg={el} />
      ))}
    </div>
  );
}
