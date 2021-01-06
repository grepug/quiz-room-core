import WebSocket, { Server } from 'ws';
import {
  Message,
  QuizRoom,
  User,
  mockQuestions,
  MessageType,
} from 'quiz-room-core';

const server = new Server({ port: 5200 });

let room: QuizRoom;

let storedWs: Record<string, WebSocket> = {};

server.on('connection', function (ws) {
  if (!room) {
    room = new QuizRoom({
      questions: mockQuestions,
      emitMessage: handleEmitMessage,
      SHOW_ANSWER_CORRECT_DELAY: 3000,
      SHOW_NEXT_QUESTION_DELAY: 3000,
    });
  }

  room.config.onAddUser = handleAddUser;

  function handleAddUser(user: User) {
    storedWs[user.name] = ws;
    console.log('storedWs', Object.keys(storedWs));
  }

  function handleEmitMessage(message: Message) {
    if (message.type === MessageType.system) {
      console.log('message', message);
    }

    try {
      const messageString = JSON.stringify(message);

      Object.values(storedWs).forEach((ws) => ws.send(messageString));
    } catch {
      console.log('msg error');
    }
  }

  ws.on('message', (wsMsg: string) => {
    try {
      const msgProps = JSON.parse(wsMsg);
      const message = new Message(msgProps);

      room.handleIncomingMessage(message);
    } catch (e) {
      console.log(e);
    }
  });
});
