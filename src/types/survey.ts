export type QuestionType =
  | "text"
  | "radio"
  | "checkbox"
  | "rating";

export interface ConditionalLogic {
  questionId: string;
  equals: string;
}

export interface Question {
  id: string;
  type: QuestionType;

  title: string;

  required: boolean;

  options?: string[];

  showIf?: ConditionalLogic;
}

export interface SurveySchema {
  questions: Question[];
}