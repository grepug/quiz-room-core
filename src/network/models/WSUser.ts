import { User } from 'quiz-room-core';
import WebSocket from 'ws';

export class WSUser {
  user: User;
  ws: WebSocket;

  constructor(props?: Partial<WSUser>) {
    Object.assign(this, props);
  }
}
