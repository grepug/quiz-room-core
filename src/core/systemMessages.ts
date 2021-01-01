import { User } from './models/User';
import { Message, MessageType } from './models/Message';
import { Question } from './models/Question';

export const systemMessage = {
  newQuestionMsg(question: Question) {
    return new Message({
      type: MessageType.system,
      content: question.title,
    });
  },
  revealAnswerMsg(question: Question) {
    return new Message({
      type: MessageType.system,
      content: question.answer.content,
    });
  },
  answerCorrectMsg(user: User) {
    return new Message({
      type: MessageType.system,
      content: `${user.name} is Correct!`,
    });
  },
  loadingNextQuestionMsg() {
    return new Message({
      type: MessageType.system,
      content: 'next question will show up in 5 seconds',
    });
  },
};
