import { Server } from 'ws';
import { Message, QuizRoom } from 'quiz-room-core';
const server = new Server({ port: 5200 });

let room: QuizRoom;

server.on('connection', function (ws) {
  if (!room) {
    room = new QuizRoom({
      emitMessage: handleEmitMessage,
      SHOW_ANSWER_CORRECT_DELAY: 3000,
      SHOW_NEXT_QUESTION_DELAY: 3000,
    });
  }

  function handleEmitMessage(message: Message) {
    if (!message.user) return;

    try {
      const messageString = JSON.stringify(message);
      console.log(messageString);

      ws.send(messageString);
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
