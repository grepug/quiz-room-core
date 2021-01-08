import { createMyContext } from 'quiz-room-utils/createMyContext';
import { Message, MessageType, User, Role } from 'quiz-room-core';
import { useRef, useState } from 'react';
import { message } from 'antd';

function useWSTest(_: {}) {
  const [messages, setMessages] = useState<Message[]>([]);

  const tmpUserName = useRef<string>();
  const [user, setUser] = useState<User>();
  const ws = useRef<WebSocket>();

  function handleMessage(event: MessageEvent<any>) {
    const message = new Message(JSON.parse(event.data));

    console.log('userJoined', message.user?.name);

    switch (message.type) {
      case MessageType.sys_userJoined:
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

  function join(name: string, role = Role.user) {
    let connection = getConnection();
    ws.current = connection;

    connection.onmessage = handleMessage;

    connection.onopen = () => {
      const user = new User({ name, role });

      tmpUserName.current = user.name;

      sendMessage(
        new Message({
          type: MessageType.join,
          content: '',
          user,
        })
      );

      connection.onopen = null;
    };

    connection.onclose = () => {
      message.error('You are offline, reconnecting...');

      setTimeout(() => {
        connection = getConnection();
      }, 3000);
    };

    connection.onerror = () => {
      message.error('cannot establish connection!');
    };
  }

  function sendMessage(message: Message) {
    ws.current?.send(JSON.stringify(message));
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

function getConnection() {
  return new window.WebSocket('ws://localhost:5200');
}
