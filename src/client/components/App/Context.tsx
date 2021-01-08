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
import { QuizMessage } from './models/QuizMessage';
import { toast } from './toast';

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

enum AppState {
  notConnected = 'notConnected',
  connecting = 'connecting',
  error = 'error',
  closed = 'closed',
}

function useApp(_: {}) {
  const [messages, setMessages] = useState<QuizMessage[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const tmpUserId = useRef<string>();
  const [user, setUser] = useState<User>();
  const [ws, setWS] = useState<WebSocket>();

  const tempUser = useRef<User>();

  useEffect(() => {
    if (!isClient()) return;

    if (user) {
      localStorage.setItem(LS_ME_INFO_KEY, JSON.stringify(user));
    } else {
      handleLogin();
    }
  }, [user]);

  useEffect(() => {
    if (ws) {
      let didCancel = false;

      ws.onmessage = handleMessage;

      ws.onopen = () => {
        tmpUserId.current = tempUser.current?.id;

        sendMessage(
          new Message({
            type: MessageType.join,
            content: '',
            user: tempUser.current,
          })
        );

        ws.onopen = null;
      };

      ws.onclose = (e) => {
        toast('You are offline, reconnecting...');

        if (!didCancel) {
          handleLogin();
        }
      };

      ws.onerror = (e) => {
        toast('cannot establish connection!');

        // ws.close();
      };

      return () => {
        didCancel = true;

        ws.onmessage = null;
        ws.onopen = null;
        ws.onclose = null;
        ws.onerror = null;
      };
    }
  }, [ws, user]);

  async function handleLogin() {
    tempUser.current = undefined;
    setUser(undefined);
    setMessages([]);
    setUsers([]);
    ws?.close();
    setWS(undefined);

    setTimeout(() => {
      const user = initUser() ?? new User();

      const userName = prompt(
        'To Login Please Input Your Name',
        user?.name
      )?.trim();

      if (userName) {
        user.name = userName;
        user.role = admins.includes(userName) ? Role.admin : Role.user;

        join(user);
      }
    }, 1000);
  }

  function handleMessage(event: MessageEvent<any>) {
    const rawData: string = event.data;
    const message = new QuizMessage(JSON.parse(rawData));

    // console.log('messsage', message);
    console.log('users', users);

    switch (message.type) {
      case MessageType.init:
        const messagesProps: MessageProps[] = JSON.parse(message.content!);
        const messages = messagesProps.map(Message.fromJSON);
        const quizMessages = messages.map((el) => new QuizMessage(el));
        linkQuizMessages(quizMessages);
        setMessages(quizMessages);
        return;
      case MessageType.nofityUsersChange:
        const usersProps: UserProps[] = JSON.parse(message.content ?? '[]');
        const users = usersProps.map((el) => new User(el));
        setUsers(users);
        return;
    }

    if (message.isSystem || message.type === MessageType.default) {
      const isUserJoined = message.type === MessageType.sys_userJoined;
      const isMeJoined = isUserJoined && tmpUserId.current === message.user?.id;

      if (isMeJoined) {
        setUser(message.user);
        tmpUserId.current = undefined;
      }

      setMessages((msgs) => {
        const lastMsg: QuizMessage | undefined = msgs[msgs.length - 1];
        message.prevMessage = lastMsg;

        if (lastMsg) {
          lastMsg.nextMessage = message;
        }

        return msgs.concat(message);
      });
    }
  }

  function join(user: User) {
    let connection = getConnection();
    setWS(connection);
    tempUser.current = user;
  }

  function sendMessage(msg: Message | string) {
    if (typeof msg === 'string') {
      msg = new Message({ content: msg, type: MessageType.default, user });
    }
    ws?.send(JSON.stringify(msg));
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
  return new window.WebSocket('ws://quiz-room.nat300.top/ws');
}

function linkQuizMessages(messages: QuizMessage[]) {
  for (const [i, msg] of messages.entries()) {
    const prev: QuizMessage | undefined = messages[i - 1];
    const next: QuizMessage | undefined = messages[i + 1];

    msg.prevMessage = prev;
    msg.nextMessage = next;
  }
}
