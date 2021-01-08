import WebSocket, { Server } from 'ws';
import express from 'express';
import http from 'http';
import { Message, User, MessageType } from 'quiz-room-core';
import path from 'path';
import { createRoom } from './createRoom';

const app = express();

const httpServer = http.createServer(app);

app.use(express.static(path.join(__dirname, '../client/out')));

const server = new Server({ server: httpServer });

httpServer.listen(5200, '0.0.0.0');

main();

async function main() {
  let storedWs: Record<string, WebSocket> = {};

  const room = await createRoom();

  server.on('connection', function (ws) {
    room.config.onUserJoin = handleAddUser;
    room.config.emitMessage = handleEmitMessage;

    ws.on('message', handleWSMessage);

    ws.once('close', (_) => {
      const pair = Object.entries(storedWs).find(([_, _ws]) => _ws === ws);

      if (pair) {
        const [userId] = pair;

        room.handleUserLeave(userId);
        delete storedWs[userId];

        notifyUsersChange();

        ws.off('message', handleWSMessage);
      }
    });

    function handleAddUser(user: User) {
      storedWs[user.id] = ws;
      console.log('storedWs', Object.keys(storedWs));

      const initMessage = room.getInitMessage();

      notifyUsersChange();

      if (initMessage) {
        handleEmitMessage(initMessage, user);
      }
    }

    function notifyUsersChange() {
      console.log('userLength', room.users);

      const message = new Message({
        type: MessageType.nofityUsersChange,
        content: JSON.stringify(Array.from(room.users)),
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

    function handleWSMessage(messageString: string) {
      try {
        const msgProps = JSON.parse(messageString);
        const message = new Message(msgProps);

        room.handleIncomingMessage(message);
      } catch (e) {
        console.log(e);
      }
    }
  });
}
