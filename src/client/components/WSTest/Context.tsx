import { createMyContext } from 'quiz-room-utils/createMyContext';
import { Message, MessageType, User, Role } from 'quiz-room-core';
import { useEffect, useRef, useState } from 'react';

function useWSTest(_: {}) {
  const [messages, setMessages] = useState<Message[]>([]);

  const tmpUserName = useRef<string>();
  const [user, setUser] = useState<User>();
  const ws = useRef(new window.WebSocket('ws://localhost:5200'));

  useEffect(() => {
    ws.current.addEventListener('message', handleMessage);

    return () => {
      ws.current.removeEventListener('message', handleMessage);
    };

    function handleMessage(event: MessageEvent<any>) {
      const message = new Message(JSON.parse(event.data));

      switch (message.type) {
        case MessageType.userJoined:
          if (tmpUserName.current === message.user?.name) {
            setUser(message.user);
          }
          break;
        case MessageType.default:
        case MessageType.system:
          setMessages((msgs) => msgs.concat(message));
          break;
      }
    }
  }, []);

  function join(name: string, role = Role.user) {
    const user = new User({ name, role });

    tmpUserName.current = user.name;

    sendMessage(
      new Message({
        type: MessageType.join,
        content: '',
        user,
      })
    );
  }

  function sendMessage(message: Message) {
    ws.current.send(JSON.stringify(message));
  }

  return {
    join,
    user,
    setUser,
    messages,
    sendMessage,
  };
}

export const {
  Context: { Consumer },
  Provider,
  useContext,
} = createMyContext<
  Parameters<typeof useWSTest>[0],
  ReturnType<typeof useWSTest>
>(useWSTest);
