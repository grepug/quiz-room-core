import { createMyContext } from 'quiz-room-utils/createMyContext';
import {
  Message,
  MessageType,
  User,
  Role,
  MessageProps,
  UserProps,
} from 'quiz-room-core';
import { useEffect, useRef, useState } from 'react';
import { message } from 'antd';
import { QuizMessage } from './models/QuizMessage';

const admins = ['kai', 'qq'];
const LS_ME_INFO_KEY = 'me_info';
const isClient = () => typeof window !== 'undefined';

function initUser(): User | undefined {
  if (isClient()) {
    const ls = localStorage.getItem(LS_ME_INFO_KEY);

    if (ls) {
      return JSON.parse(ls);
    }
  }
}

function useApp(_: {}) {
  const [messages, setMessages] = useState<QuizMessage[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const tmpUserId = useRef<string>();
  const [user, setUser] = useState<User>();
  const ws = useRef<WebSocket>();

  useEffect(() => {
    if (isClient()) {
      if (user) {
        localStorage.setItem(LS_ME_INFO_KEY, JSON.stringify(user));
      } else {
        const user = initUser() ?? new User();
        const userName = prompt('Input Your Name', user?.name)?.trim();

        if (userName) {
          user.name = userName;
          user.role = admins.includes(userName) ? Role.admin : Role.user;

          join(user);
        }
      }
    }
  }, [user]);

  function handleMessage(event: MessageEvent<any>) {
    const rawData: string = event.data;
    const message = new QuizMessage(JSON.parse(rawData));

    console.log('messsage', message, rawData);

    switch (message.type) {
      case MessageType.init:
        const messagesProps: MessageProps[] = JSON.parse(message.content!);
        const messages = messagesProps.map(Message.fromJSON);

        const quizMessages = messages.map((el) => new QuizMessage(el));
        linkQuizMessages(quizMessages);

        setMessages(quizMessages);
        break;
      case MessageType.nofityUsers:
        const usersProps: UserProps[] = JSON.parse(message.content ?? '[]');
        const users = usersProps.map((el) => new User(el));
        setUsers(users);

        break;
      case MessageType.default:
      case MessageType.system:
      case MessageType.userJoined:
        const isUserJoined = message.type === MessageType.userJoined;
        const isMeJoined =
          isUserJoined && tmpUserId.current === message.user?.id;

        if (isMeJoined) {
          setUser(message.user);

          break;
        }

        setMessages((msgs) => {
          const lastMsg: QuizMessage | undefined = msgs[msgs.length - 1];
          message.prevMessage = lastMsg;

          if (lastMsg) {
            lastMsg.nextMessage = message;
          }

          if (isUserJoined) {
            message.type = MessageType.system;
            message.content = `${message.user?.name} joined`;
          }

          return msgs.concat(message);
        });
        break;
    }
  }

  function join(user: User) {
    let connection = getConnection();
    ws.current = connection;

    connection.onmessage = handleMessage;

    connection.onopen = () => {
      tmpUserId.current = user.id;

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
    users,
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
  return new window.WebSocket('ws://192.168.0.117:5200');
}

function linkQuizMessages(messages: QuizMessage[]) {
  for (const [i, msg] of messages.entries()) {
    const prev: QuizMessage | undefined = messages[i - 1];
    const next: QuizMessage | undefined = messages[i + 1];

    msg.prevMessage = prev;
    msg.nextMessage = next;
  }
}
