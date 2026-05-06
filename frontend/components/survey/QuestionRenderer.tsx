"use client";

import type { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";

import type { SurveyAnswers, SurveyQuestion } from "@/lib/survey-types";

import { CheckboxQuestion } from "@/components/survey/questions/CheckboxQuestion";
import { RadioQuestion } from "@/components/survey/questions/RadioQuestion";
import { RatingQuestion } from "@/components/survey/questions/RatingQuestion";
import { TextQuestion } from "@/components/survey/questions/TextQuestion";

type QuestionRendererProps = {
  question: SurveyQuestion;
  register: UseFormRegister<SurveyAnswers>;
  setValue: UseFormSetValue<SurveyAnswers>;
  watch: UseFormWatch<SurveyAnswers>;
  errors: FieldErrors<SurveyAnswers>;
};

export function QuestionRenderer({ question, register, setValue, watch, errors }: QuestionRendererProps) {
  switch (question.type) {
    case "text":
      return <TextQuestion question={question} register={register} errors={errors} />;
    case "radio":
      return <RadioQuestion question={question} register={register} errors={errors} />;
    case "checkbox":
      return <CheckboxQuestion question={question} watch={watch} setValue={setValue} errors={errors} />;
    case "rating":
      return <RatingQuestion question={question} register={register} watch={watch} errors={errors} />;
    default:
      return null;
  }
}