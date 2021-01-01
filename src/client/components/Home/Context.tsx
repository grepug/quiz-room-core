import { createMyContext } from 'utils/index';
import { QuizRoom, Message, User } from 'core';
import { useEffect, useRef, useState } from 'react';
import { MessageType } from 'core';

function useQuiz(_: {}) {
  const room = useRef<QuizRoom>();
  const [messages, setMessages] = useState<Message[]>([]);

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
    messages,
    addUser,
    sendUserMessage,
  };
}

export const { Provider, useContext } = createMyContext<
  Parameters<typeof useQuiz>[0],
  ReturnType<typeof useQuiz>
>(useQuiz);
