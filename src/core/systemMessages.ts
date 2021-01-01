import { User } from './models/User';
import { Message, MessageType } from './models/Message';
import { Question } from './models/Question';

export const systemMessage = {
  quizStartMsg: () => createSystemMessage('Game Started!'),
  quizCompletedMsg: (resultString: string) =>
    createSystemMessage(`Game Completed!\n${resultString}`),
  newQuestionMsg: (question: Question) => createSystemMessage(question.title),
  revealAnswerMsg: (question: Question) =>
    createSystemMessage(question.answer.content),
  answerCorrectMsg: (user: User) =>
    createSystemMessage(`${user.name} is Correct!`),
  loadingNextQuestionMsg: () =>
    createSystemMessage('next question will show up in 5 seconds'),
  loadingDontHurry: () => createSystemMessage(`I'm loading, don't hurry!!!`),
};

function createSystemMessage(content: string): Message {
  return new Message({
    type: MessageType.system,
    content,
  });
}
