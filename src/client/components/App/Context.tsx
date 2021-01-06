import { createMyContext } from 'quiz-room-utils/createMyContext';
import { Message, MessageType, User, Role, MessageProps } from 'quiz-room-core';
import { useRef, useState } from 'react';
import { message } from 'antd';
import { QuizMessage } from './models/QuizMessage';

function useApp(_: {}) {
  const [messages, setMessages] = useState<QuizMessage[]>([]);

  const tmpUserName = useRef<string>();
  const [user, setUser] = useState<User>();
  const ws = useRef<WebSocket>();

  function handleMessage(event: MessageEvent<any>) {
    const rawData: string = event.data;
    const message = new QuizMessage(JSON.parse(rawData));

    console.log('messsage', message, rawData);

    switch (message.type) {
      case MessageType.userJoined:
        if (tmpUserName.current === message.user?.name) {
          setUser(message.user);
        }
        break;
      case MessageType.restoreMessages:
        const messagesProps: MessageProps[] = JSON.parse(message.content!);
        const messages = messagesProps.map(Message.fromJSON);

        const quizMessages = messages.map((el) => new QuizMessage(el));
        linkQuizMessages(quizMessages);

        setMessages(quizMessages);
        break;
      case MessageType.default:
      case MessageType.system:
        setMessages((msgs) => {
          const lastMsg: QuizMessage | undefined = msgs[msgs.length - 1];
          message.prevMessage = lastMsg;
          if (lastMsg) {
            lastMsg.nextMessage = message;
          }

          return msgs.concat(message);
        });
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

  function sendMessage(msg: Message | string) {
    if (typeof msg === 'string') {
      msg = new Message({ content: msg, type: MessageType.default, user });
    }

    ws.current?.send(JSON.stringify(msg));
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
} = createMyContext<Parameters<typeof useApp>[0], ReturnType<typeof useApp>>(
  useApp
);

function getConnection() {
  return new window.WebSocket('ws://192.168.31.171:5200');
}

function linkQuizMessages(messages: QuizMessage[]) {
  for (const [i, msg] of messages.entries()) {
    const prev: QuizMessage | undefined = messages[i - 1];
    const next: QuizMessage | undefined = messages[i + 1];

    msg.prevMessage = prev;
    msg.nextMessage = next;
  }
}
