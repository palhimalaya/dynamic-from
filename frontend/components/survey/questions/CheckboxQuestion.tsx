"use client";

import type { FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";

import type { CheckboxQuestion as CheckboxQuestionType, SurveyAnswers } from "@/lib/survey-types";

type CheckboxQuestionProps = {
  question: CheckboxQuestionType;
  watch: UseFormWatch<SurveyAnswers>;
  setValue: UseFormSetValue<SurveyAnswers>;
  errors: FieldErrors<SurveyAnswers>;
};

export function CheckboxQuestion({ question, watch, setValue, errors }: CheckboxQuestionProps) {
  const error = errors[question.id];
  const selectedValues = (watch(question.id) as string[] | undefined) ?? [];

  const toggleOption = (option: string) => {
    const isSelected = selectedValues.includes(option);
    const nextValues = isSelected
      ? selectedValues.filter((value) => value !== option)
      : [...selectedValues, option];

    setValue(question.id, nextValues, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  return (
    <fieldset className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
      <div className="flex items-center justify-between gap-3">
        <legend className="text-lg font-semibold text-slate-950">{question.title}</legend>
        {question.required ? <span className="text-xs font-medium text-rose-600">Required</span> : null}
      </div>
      <div className="mt-4 space-y-3">
        {question.options.map((option) => {
          const checked = selectedValues.includes(option);

          return (
            <button
              key={option}
              type="button"
              onClick={() => toggleOption(option)}
              className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                checked
                  ? "border-slate-950 bg-slate-950 text-white"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white"
              }`}
            >
              <span className="text-sm font-medium">{option}</span>
              <span className="text-xs font-medium uppercase tracking-[0.18em]">{checked ? "Selected" : "Add"}</span>
            </button>
          );
        })}
      </div>
      {question.required && selectedValues.length === 0 ? (
        <p className="mt-3 text-sm text-rose-600">Select at least one option.</p>
      ) : error?.message ? (
        <p className="mt-3 text-sm text-rose-600">{error.message as string}</p>
      ) : null}
    </fieldset>
  );
}