import { Question, Answer } from '..';

export function convertCSVToQuestions(csvString: string): Question[] {
  return csvString
    .trim()
    .split(/\n/)
    .map((line) => {
      const [title, answerContent] = line.split(',').filter(Boolean);

      const answer = new Answer({ content: answerContent });

      const question = new Question({
        title,
        answer,
        score: 1,
      });

      question.answer = answer;

      return question;
    });
}

export function converJSONToQuestions(
  json: {
    题目: string;
    答案: string;
  }[]
): Question[] {
  return json.map((el) => {
    const [title, answerContent] = [el.题目, el.答案];

    const answer = new Answer({ content: answerContent });

    const question = new Question({
      title,
      answer,
      score: 1,
    });

    question.answer = answer;

    return question;
  });
}
