import { sleep } from 'quiz-room-utils';
import { Answer, AnswerProps } from './models/Answer';
import { AdminMessageType, Message } from './models/Message';
import { Question } from './models/Question';
import { Room, RoomConfig, RoomProps } from './Room';
import { systemMessage as sm } from './systemMessages';

enum QuizState {
  preparing,
  ongoing_answering,
  ongoing_correctly_answered,
  ongoing_loading_next,
  completed,
}

interface QuizRoomConfig extends RoomConfig {
  questions: Question[];
  SHOW_ANSWER_CORRECT_DELAY: number;
  SHOW_NEXT_QUESTION_DELAY: number;
}

export interface QuizRoomProps extends RoomProps {
  config: QuizRoomConfig;
  correctAnswers: AnswerProps[];
  curQuestionIndex: number;
  state: QuizState;
}

export class QuizRoom extends Room {
  correctAnswers: Answer[] = [];

  curQuestionIndex = 0;
  state = QuizState.preparing;

  private get curQuestion() {
    return this.config.questions[this.curQuestionIndex];
  }

  static fromJSON(props: QuizRoomProps) {
    const room = Room.fromJSON(props);
    const quizRoom = new QuizRoom(props.config);

    quizRoom.id = room.id;
    quizRoom.config = props.config;
    quizRoom.correctAnswers = props.correctAnswers.map((el) =>
      Answer.fromJSON(el)
    );
    quizRoom.curQuestionIndex = props.curQuestionIndex;
    quizRoom.state = props.state;

    return quizRoom;
  }

  constructor(public config: QuizRoomConfig) {
    super(config);
  }

  // override
  handleDefaultMessage(msg: Message) {
    super.handleDefaultMessage(msg);

    this.handleAdminMessage(msg) || this.handleUserMessage(msg);
  }

  toJSON(): QuizRoomProps {
    return {
      ...super.toJSON(),
      config: this.config,
      correctAnswers: this.correctAnswers,
      curQuestionIndex: this.curQuestionIndex,
      state: this.state,
    };
  }

  private handleAdminMessage(msg: Message) {
    const type = msg.getAdminMessageType();

    switch (type) {
      case AdminMessageType.start:
        console.log('started!');

        this.start();
        break;
      case AdminMessageType.show:
        this.revealCorrectAnswer();
        break;
      case AdminMessageType.stop:
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
        user: msg.user,
        question: this.curQuestion,
        content: msg.content?.trim() ?? '',
      });

      if (answer.isCorrect) {
        try {
          this.state = QuizState.ongoing_correctly_answered;
          // 当有人答对，延迟提示答案正确
          await this.sleepAndEnsureState(this.config.SHOW_ANSWER_CORRECT_DELAY);
          this.emitMessage(
            sm.answerCorrectMsg(
              msg.user,
              answer.question?.answer.content ?? answer.content,
              this.curQuestionIndex
            )
          );
          this.state = QuizState.ongoing_loading_next;
          this.correctAnswers.push(answer);
          await this.sleepAndEnsureState(500);
          await this.nextQuestion();
        } catch {}
      }
    } else if (this.state === QuizState.ongoing_loading_next) {
    } else if (this.state === QuizState.completed) {
    }
  }

  private async nextQuestion(opts?: { initial?: boolean }) {
    const questionCount = this.config.questions.length;
    // 最后一道题了
    if (this.curQuestionIndex === questionCount - 1) {
      this.complete();

      return;
    }

    if (!opts?.initial) {
      this.curQuestionIndex += 1;
    }

    this.emitMessage(sm.loadingNextQuestionMsg());

    await this.sleepAndEnsureState(this.config.SHOW_NEXT_QUESTION_DELAY);

    this.state = QuizState.ongoing_answering;
    this.emitNewQuestion();
  }

  private emitNewQuestion() {
    this.emitMessage(
      sm.newQuestionMsg(this.curQuestion, this.curQuestionIndex)
    );
  }

  private start() {
    this.curQuestionIndex = 0;
    this.correctAnswers = [];
    this.state = QuizState.ongoing_answering;
    this.emitMessage(sm.quizStartMsg());
    this.nextQuestion({ initial: true });
  }

  private revealCorrectAnswer() {
    if (this.state !== QuizState.ongoing_answering) return;

    this.state = QuizState.ongoing_loading_next;
    this.emitMessage(sm.revealAnswerMsg(this.curQuestion));

    this.nextQuestion();
  }

  private complete() {
    this.state = QuizState.completed;

    this.emitMessage(sm.quizCompletedMsg(this.getResultString()));
  }

  private getResultString(): string {
    let result: Record<string, number> = {};

    const correctAnswers = this.correctAnswers.filter((el) =>
      this.users.get(el.user?.id ?? '')
    );

    for (const answer of correctAnswers) {
      const id = answer.user!.id;
      const prevScore = result[id] || 0;

      result[id] = prevScore + 1;
    }

    const getName = (id: string) => this.users.get(id)?.name;

    return Object.entries(result)
      .sort(([_, x], [__, y]) => y - x)
      .filter(([id]) => getName(id))
      .map(([id, score], i) => `${i + 1}. ${getName(id)}: ${score}`)
      .join('\n');
  }

  private async sleepAndEnsureState(delay: number) {
    await sleep(delay);

    if (this.state === QuizState.completed) throw '';
  }
}
