export type QuestionShowIf = {
  questionId: string;
  equals: string;
};

type QuestionBase = {
  id: string;
  title: string;
  required: boolean;
  showIf?: QuestionShowIf;
};

export type TextQuestion = QuestionBase & {
  type: "text";
  placeholder?: string;
};

export type RadioQuestion = QuestionBase & {
  type: "radio";
  options: string[];
};

export type CheckboxQuestion = QuestionBase & {
  type: "checkbox";
  options: string[];
};

export type RatingQuestion = QuestionBase & {
  type: "rating";
  min?: number;
  max?: number;
};

export type SurveyQuestion = TextQuestion | RadioQuestion | CheckboxQuestion | RatingQuestion;

export type SurveySchema = {
  questions: SurveyQuestion[];
};

export type Survey = {
  id: string;
  title: string;
  description: string;
  schema: SurveySchema;
};

export type SurveyListItem = Pick<Survey, "id" | "title" | "description">;

export type SurveyAnswerValue = string | string[] | number | undefined;

export type SurveyAnswers = Record<string, SurveyAnswerValue>;

export type SurveyResponsePayload = {
  answers: Record<string, string | string[] | number>;
};