import { User } from './models/User';
import { Message, MessageType } from './models/Message';
import { Question } from './models/Question';

export const systemMessage = {
  quizStartMsg: () => createSystemMessage('Game Started!'),
  quizCompletedMsg: (resultString: string) =>
    createSystemMessage(`Game Over!\n-----\nResult:\n-----\n${resultString}`),
  quizShowCurrentScore: (resultString: string) =>
    createSystemMessage(`Current Scores:\n-----\n${resultString}`),
  newQuestionMsg: (question: Question, index: number) =>
    createSystemMessage(`Q${index + 1}: ${question.title}`),
  revealAnswerMsg: (question: Question, index: number) =>
    createSystemMessage(
      `Q${index + 1}\nThe answer is ${question.answer.content}`
    ),
  answerCorrectMsg: (user: User, answer: string, index: number) =>
    createSystemMessage(
      `Q${index + 1}:\n${user.name} is Correct!\nThe answer is ${answer}`
    ),
  loadingNextQuestionMsg: () =>
    createSystemMessage('Next question will show up in 5 seconds'),
  loadingDontHurry: () => createSystemMessage(`I'm loading, don't hurry!!!`),
};

function createSystemMessage(content: string): Message {
  return new Message({
    type: MessageType.system,
    content,
  });
}
