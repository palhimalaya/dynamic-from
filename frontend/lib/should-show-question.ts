import type { SurveyAnswers, SurveyQuestion } from "@/lib/survey-types";

export function shouldShowQuestion(question: SurveyQuestion, answers: SurveyAnswers) {
  if (!question.showIf) {
    return true;
  }

  const dependentAnswer = answers[question.showIf.questionId];

  if (Array.isArray(dependentAnswer)) {
    return dependentAnswer.includes(question.showIf.equals);
  }

  if (dependentAnswer === undefined || dependentAnswer === null) {
    return false;
  }

  return String(dependentAnswer) === question.showIf.equals;
}

export function createDefaultAnswers(questions: SurveyQuestion[]) {
  return questions.reduce<Record<string, string | string[] | number>>((accumulator, question) => {
    if (question.type === "checkbox") {
      accumulator[question.id] = [];
      return accumulator;
    }

    accumulator[question.id] = "";
    return accumulator;
  }, {});
}