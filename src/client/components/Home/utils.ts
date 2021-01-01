import { Question, Answer } from 'core';

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
