import { createMyContext } from 'quiz-room-utils/createMyContext';
import { QuizRoom, Message, User, Role } from 'core';
import { useEffect, useRef, useState } from 'react';
import { MessageType } from 'core';
import { questions } from 'quiz-room-core/data/questions';

function initUsers(): User[] {
  const users = [...Array(18)].map(
    (_, i) => new User({ name: `user-${i + 1}` })
  );

  users[0].role = Role.admin;

  return users;
}

function useQuiz(_: {}) {
  const room = useRef<QuizRoom>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [users] = useState<User[]>(initUsers);

  useEffect(() => {
    room.current = new QuizRoom({
      questions,
      emitMessage: handleEmitSystemMessage,
      SHOW_ANSWER_CORRECT_DELAY: 3000,
      SHOW_NEXT_QUESTION_DELAY: 3000,
      saveMessage: true,
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

export const {
  Provider,
  useContext,
  Context: { Consumer },
} = createMyContext<Parameters<typeof useQuiz>[0], ReturnType<typeof useQuiz>>(
  useQuiz
);
