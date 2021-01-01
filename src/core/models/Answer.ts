import { uuid } from 'utils/uuid';
import { Question } from './Question';
import { User } from './User';

interface AnswerProps {
  question: Question;
  content: string;
  user?: User;
}

export class Answer implements AnswerProps {
  id = uuid();

  question: Question;
  content: string;

  user?: User;

  constructor(props: AnswerProps) {
    this.question = props.question;
    this.content = props.content;
    this.user = props.user;
  }

  get isCorrect() {
    if (!this.user) return true;

    return this.question.answer.content === this.content.trim();
  }
}
