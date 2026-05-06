"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";

import type { RadioQuestion as RadioQuestionType, SurveyAnswers } from "@/lib/survey-types";

type RadioQuestionProps = {
  question: RadioQuestionType;
  register: UseFormRegister<SurveyAnswers>;
  errors: FieldErrors<SurveyAnswers>;
};

export function RadioQuestion({ question, register, errors }: RadioQuestionProps) {
  const error = errors[question.id];

  return (
    <fieldset className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
      <div className="flex items-center justify-between gap-3">
        <legend className="text-lg font-semibold text-slate-950">{question.title}</legend>
        {question.required ? <span className="text-xs font-medium text-rose-600">Required</span> : null}
      </div>
      <div className="mt-4 space-y-3">
        {question.options.map((option) => (
          <label
            key={option}
            className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <input
              type="radio"
              value={option}
              {...register(question.id, {
                required: question.required ? "Please select an option." : false,
              })}
              className="h-4 w-4 border-slate-300 text-slate-950 focus:ring-slate-950"
            />
            <span className="text-sm font-medium text-slate-700">{option}</span>
          </label>
        ))}
      </div>
      {error?.message ? <p className="mt-3 text-sm text-rose-600">{error.message as string}</p> : null}
    </fieldset>
  );
}