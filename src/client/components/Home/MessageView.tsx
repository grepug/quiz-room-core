import { useContext } from './Context';
import { MessageItem } from './MessageItem';

export function MessageView() {
  const ctx = useContext()!;

  return (
    <div
      style={{
        width: '100%',
        height: '500px',
        border: '1px solid',
      }}
    >
      {ctx.messages.map((el) => (
        <MessageItem key={el.id} name={el.user?.name} content={el.content} />
      ))}
    </div>
  );
}
