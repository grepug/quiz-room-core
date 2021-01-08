import { uuid } from 'quiz-room-utils';
import { Answer } from './Answer';

interface QuestionProps {
  title: string;
  answer: Answer;
  score: number;
}

export class Question implements QuestionProps {
  id = uuid();
  title: string;
  answer: Answer;
  score = 1;

  userAnswers: Answer[] = [];

  static fromJSON(props: QuestionProps) {
    const question = new Question(props);

    if (props.answer) {
      const answer = new Answer(props.answer);
      question.answer = answer;
    }

    return question;
  }

  constructor(props: QuestionProps) {
    this.title = props.title;
    this.answer = props.answer;
  }
}
