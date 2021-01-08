import { QuizRoom, mockQuestions, Message, MessageProps } from 'quiz-room-core';
import { readJSON, ensureDir, writeJSON } from 'fs-extra';

export async function createRoom() {
  let messages: Message[] = [];

  try {
    const messagesProps: MessageProps[] = await readJSON('res/messages.json');

    messages = messagesProps.map(Message.fromJSON);
  } catch (e) {
    console.error(e);
  }

  const room = new QuizRoom({
    questions: mockQuestions,
    SHOW_ANSWER_CORRECT_DELAY: 3000,
    SHOW_NEXT_QUESTION_DELAY: 3000,
    saveMessage: true,
    onSaveMessage: saveMessage,
    messages,
  });

  async function saveMessage() {
    await ensureDir('res');
    await writeJSON(`res/messages.json`, messages);
  }

  return room;
}
