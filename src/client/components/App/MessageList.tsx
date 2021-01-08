import { Message } from 'framework7-react';
import { useContext } from './Context';

export function MessageList() {
  const ctx = useContext()!;

  if (!ctx.user) {
    return null;
  }

  console.log('messages', ctx.messages);

  return (
    <>
      {ctx.messages.map((el) => {
        const p = el.getRenderProps(ctx.user!) as any;

        return <Message key={el.id} {...p}></Message>;
      })}
    </>
  );
}
