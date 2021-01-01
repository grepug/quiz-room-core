import { sleep } from 'utils/sleep';
import { Answer } from './models/Answer';
import { AdminMessageType, Message } from './models/Message';
import { Question } from './models/Question';
import { Room } from './Room';
import { systemMessage as sm } from './systemMessages';

enum QuizState {
  preparing,
  ongoing_answering,
  ongoing_loading_next,
  completed,
}

export class QuizRoom extends Room {
  private questions: Question[] = [];
  private curQuestionIndex = 0;
  private state = QuizState.preparing;

  get curQuestion() {
    return this.questions[this.curQuestionIndex];
  }

  // override
  handleDefaultMessage(msg: Message) {
    super.handleDefaultMessage(msg);

    this.handleAdminMessage(msg.getAdminMessageType());

    this.handleUserMessage(msg);
  }

  private handleAdminMessage(type?: AdminMessageType) {
    switch (type) {
      case AdminMessageType.startQuiz:
        this.nextQuestion();
        break;
      case AdminMessageType.revealAnswer:
        this.revealCorrectAnswer();
        break;
      case AdminMessageType.stopQuiz:
        this.complete();
        break;
      default:
        return false;
    }

    return true;
  }

  private async handleUserMessage(msg: Message) {
    if (!msg.user) return;

    if (this.state === QuizState.ongoing_answering) {
      const answer = new Answer({
        question: this.curQuestion,
        content: msg.content,
      });

      if (answer.isCorrect) {
        this.state = QuizState.ongoing_loading_next;
        this.config.emitMessage(sm.answerCorrectMsg(msg.user));
        await sleep(500);
        await this.nextQuestion();
      }
    } else if (this.state === QuizState.ongoing_loading_next) {
    }
  }

  private async nextQuestion() {
    const questionCount = this.questions.length;
    // 最后一道题了
    if (this.curQuestionIndex === questionCount - 1) {
      this.complete();

      return;
    }

    // 非第一道
    if (this.curQuestionIndex > 0) {
      this.curQuestionIndex += 1;
    }

    this.config.emitMessage(sm.loadingNextQuestionMsg());

    await sleep(3000);

    this.emitNewQuestion();
  }

  private emitNewQuestion() {
    this.config.emitMessage(sm.newQuestionMsg(this.curQuestion));
  }

  private revealCorrectAnswer() {
    this.state = QuizState.ongoing_loading_next;
    this.config.emitMessage(sm.revealAnswerMsg(this.curQuestion));
    this.nextQuestion();
  }

  private complete() {
    this.state = QuizState.completed;
  }
}
