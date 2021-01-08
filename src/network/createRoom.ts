import {
  QuizRoom,
  QuizRoomProps,
  mockQuestions,
  Message,
} from 'quiz-room-core';
import { readJSON, ensureDir, writeJSON } from 'fs-extra';

export async function createRoom() {
  let messages: Message[] = [];
  let room: QuizRoom;

  try {
    const roomProps: QuizRoomProps = await readJSON('.cache/room.json');

    room = QuizRoom.fromJSON(roomProps);
  } catch (e) {
    room = new QuizRoom({
      questions: mockQuestions,
      SHOW_ANSWER_CORRECT_DELAY: 3000,
      SHOW_NEXT_QUESTION_DELAY: 3000,
      saveMessage: true,
      onSaveMessage: saveMessage,
      messages,
    });
  }

  return room;

  async function saveMessage() {
    await ensureDir('.cache');
    await writeJSON(`.cache/messages.json`, messages);
    await writeJSON(`.cache/room.json`, room);
  }
}
