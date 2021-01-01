import { createMyContext } from 'utils/index';
import { QuizRoom, Message, User, Role } from 'core';
import { useEffect, useRef, useState } from 'react';
import { MessageType } from 'core';

function initUsers(): User[] {
  const users = [1, 2, 3, 4, 5, 6, 7, 8].map(
    (el) => new User({ name: `user-${el}` })
  );

  users[0].role = Role.admin;

  return users;
}

function useQuiz(_: {}) {
  const room = useRef<QuizRoom>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>(initUsers);

  useEffect(() => {
    room.current = new QuizRoom({
      emitMessage: handleEmitSystemMessage,
    });

    return () => {
      room.current = undefined;
    };
  }, []);

  function handleEmitSystemMessage(msg: Message) {
    setMessages((msgs) => msgs.concat(msg));
  }

  function sendUserMessage(msg: Message) {
    setMessages((msgs) => {
      room.current?.handleDefaultMessage(msg);

      return msgs.concat(msg);
    });
  }

  function addUser(user: User) {
    const msg = new Message({
      type: MessageType.join,
      content: '',
      user,
    });

    room.current?.handleIncomingMessage(msg);
  }

  return {
    room,
    users,
    messages,
    addUser,
    sendUserMessage,
  };
}

export const { Provider, useContext } = createMyContext<
  Parameters<typeof useQuiz>[0],
  ReturnType<typeof useQuiz>
>(useQuiz);
