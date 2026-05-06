"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { UseFormWatch } from "react-hook-form";

import type { RatingQuestion as RatingQuestionType, SurveyAnswers } from "@/lib/survey-types";

type RatingQuestionProps = {
  question: RatingQuestionType;
  register: UseFormRegister<SurveyAnswers>;
  watch: UseFormWatch<SurveyAnswers>;
  errors: FieldErrors<SurveyAnswers>;
};

export function RatingQuestion({ question, register, watch, errors }: RatingQuestionProps) {
  const error = errors[question.id];
  const min = question.min ?? 1;
  const max = question.max ?? 5;
  const ratingOptions = Array.from({ length: max - min + 1 }, (_, index) => min + index);
  const selectedValue = watch(question.id);

  return (
    <fieldset className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
      <div className="flex items-center justify-between gap-3">
        <legend className="text-lg font-semibold text-slate-950">{question.title}</legend>
        {question.required ? <span className="text-xs font-medium text-rose-600">Required</span> : null}
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        {ratingOptions.map((value) => (
          <label
            key={value}
            className={`flex h-12 w-12 cursor-pointer items-center justify-center rounded-2xl border text-sm font-semibold transition ${
              Number(selectedValue) === value
                ? "border-slate-950 bg-slate-950 text-white shadow-sm shadow-slate-950/20"
                : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-400 hover:bg-white"
            }`}
          >
            <input
              type="radio"
              value={value}
              {...register(question.id, {
                required: question.required ? "Choose a rating." : false,
                validate: (selectedValue) => {
                  const rating = Number(selectedValue);

                  if (Number.isNaN(rating)) {
                    return "Choose a rating.";
                  }

                  if (rating < min || rating > max) {
                    return `Rating must be between ${min} and ${max}.`;
                  }

                  return true;
                },
                setValueAs: (selectedValue) => (selectedValue === "" ? undefined : Number(selectedValue)),
              })}
              className="sr-only"
            />
            <span>{value}</span>
          </label>
        ))}
      </div>
      {error?.message ? <p className="mt-3 text-sm text-rose-600">{error.message as string}</p> : null}
    </fieldset>
  );
}