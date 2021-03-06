import { uuid } from 'quiz-room-utils';
import { Question } from './Question';
import { User } from './User';

interface AnswerProps {
  content: string;
  question?: Question;
  user?: User;
}

export class Answer implements AnswerProps {
  id = uuid();
  content: string;
  question?: Question;
  user?: User;

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
