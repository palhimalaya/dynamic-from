"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";

import type { SurveyAnswers, TextQuestion as TextQuestionType } from "@/lib/survey-types";

type TextQuestionProps = {
  question: TextQuestionType;
  register: UseFormRegister<SurveyAnswers>;
  errors: FieldErrors<SurveyAnswers>;
};

export function TextQuestion({ question, register, errors }: TextQuestionProps) {
  const error = errors[question.id];

  return (
    <label className="block rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Text</span>
        {question.required ? <span className="text-xs font-medium text-rose-600">Required</span> : null}
      </div>
      <div className="mt-3 text-lg font-semibold text-slate-950">{question.title}</div>
      <input
        type="text"
        placeholder={question.placeholder ?? "Type your answer..."}
        {...register(question.id, {
          required: question.required ? "This field is required." : false,
        })}
        className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
      />
      {error?.message ? <p className="mt-3 text-sm text-rose-600">{error.message as string}</p> : null}
    </label>
  );
}