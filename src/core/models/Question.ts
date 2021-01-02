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

  constructor(props: QuestionProps) {
    this.title = props.title;
    this.answer = props.answer;
  }
}
