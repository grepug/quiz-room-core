import { uuid } from 'quiz-room-utils';
import { Question } from './Question';
import { User } from './User';

export interface AnswerProps {
  content: string;
  question?: Question;
  user?: User;
}

export class Answer implements AnswerProps {
  id = uuid();
  content: string;
  question?: Question;
  user?: User;
  createdAt = new Date().toISOString();

  static fromJSON(props: AnswerProps, question?: Question) {
    const answer = new Answer(props);

    if (props.question) {
      question = question || new Question(props.question);

      answer.question = question;
      question.answer = answer;
    }

    return answer;
  }

  constructor(props: AnswerProps) {
    this.question = props.question;
    this.content = props.content;
    this.user = props.user;
  }

  get isCorrect() {
    if (!this.user) return true;

    return (
      this.question?.answer.content.toLowerCase() ===
      this.content.trim().toLowerCase()
    );
  }
}
