import WebSocket from 'ws';
import { Message, MessageType, User, Role } from 'quiz-room-core';
import { sleep } from 'quiz-room-utils';

const users = Array.from(Array(50)).map((_, i) => `user-${i}`);

const webSockets = users.map((name) => {
  const ws = new WebSocket('http://quiz-room.nat300.top/ws');
  const user = new User({ name, role: Role.user });

  ws.onopen = () => {
    console.log(`connection open: ${user.name}`);

    sendMessage(
      ws,
      user,
      new Message({
        type: MessageType.join,
        user,
      })
    );
  };

  return {
    ws,
    user,
  };
});

main();

async function main() {
  for (const [i, { ws, user }] of webSockets.entries()) {
    await sleep(1000);

    sendMessage(ws, user, `测试-${i}`);
  }
}

function sendMessage(ws: WebSocket, user: User, msg: Message | string) {
  if (typeof msg === 'string') {
    msg = new Message({ content: msg, type: MessageType.default, user });
  }
  ws.send(JSON.stringify(msg));
}
