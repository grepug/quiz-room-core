import WebSocket, { Server } from 'ws';
import {
  Message,
  QuizRoom,
  User,
  mockQuestions,
  MessageType,
} from 'quiz-room-core';

const server = new Server({ port: 5200, host: '0.0.0.0' });

let room: QuizRoom;

let storedWs: Record<string, WebSocket> = {};

server.on('connection', function (ws) {
  if (!room) {
    room = new QuizRoom({
      questions: mockQuestions,
      emitMessage: handleEmitMessage,
      SHOW_ANSWER_CORRECT_DELAY: 3000,
      SHOW_NEXT_QUESTION_DELAY: 3000,
      saveMessage: true,
    });
  }

  room.config.onUserJoin = handleAddUser;

  function handleAddUser(user: User) {
    storedWs[user.id] = ws;
    console.log('storedWs', Object.keys(storedWs));

    const restoreMessages = room.getRestoreMessages();

    notifyUsers();

    if (restoreMessages) {
      handleEmitMessage(restoreMessages, user);
    }
  }

  function notifyUsers() {
    const message = new Message({
      type: MessageType.nofityUsers,
      content: JSON.stringify(Object.values(room.users)),
    });

    handleEmitMessage(message);
  }

  function handleEmitMessage(message: Message, user?: User) {
    try {
      const messageString = JSON.stringify(message);

      if (user) {
        const ws = storedWs[user.id];

        ws.send(messageString);
      } else {
        Object.values(storedWs).forEach((ws) => ws.send(messageString));
      }
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

  ws.on('close', (_) => {
    const [userId] = Object.entries(storedWs).filter(
      ([_, _ws]) => _ws === ws
    )[0];

    room.handleUserLeave(userId);

    notifyUsers();
  });
});
