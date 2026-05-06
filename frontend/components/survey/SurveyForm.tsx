"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { QuestionRenderer } from "@/components/survey/QuestionRenderer";
import { submitSurveyResponse } from "@/lib/api";
import { createDefaultAnswers, shouldShowQuestion } from "@/lib/should-show-question";
import type { Survey, SurveyAnswers } from "@/lib/survey-types";

type SurveyFormProps = {
  survey: Survey;
};

export function SurveyForm({ survey }: SurveyFormProps) {
  const [submissionState, setSubmissionState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submissionMessage, setSubmissionMessage] = useState("");

  const defaultValues = useMemo(() => createDefaultAnswers(survey.schema.questions), [survey.schema.questions]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SurveyAnswers>({
    defaultValues,
    shouldUnregister: true,
    mode: "onTouched",
  });

  const answers = watch();

  const visibleQuestions = useMemo(
    () => survey.schema.questions.filter((question) => shouldShowQuestion(question, answers)),
    [answers, survey.schema.questions],
  );

  const onSubmit = handleSubmit(async (formValues) => {
    setSubmissionState("submitting");
    setSubmissionMessage("");

    const payload = Object.entries(formValues).reduce<Record<string, string | string[] | number>>(
      (accumulator, [key, value]) => {
        if (value === undefined || value === "" || (Array.isArray(value) && value.length === 0)) {
          return accumulator;
        }

        accumulator[key] = value as string | string[] | number;
        return accumulator;
      },
      {},
    );

    try {
      await submitSurveyResponse(survey.id, { answers: payload });
      setSubmissionState("success");
      setSubmissionMessage("Your response was submitted successfully.");
    } catch (error) {
      setSubmissionState("error");
      setSubmissionMessage(
        error instanceof Error ? error.message : "We could not submit your response right now.",
      );
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {visibleQuestions.map((question) => (
        <QuestionRenderer
          key={question.id}
          question={question}
          register={register}
          setValue={setValue}
          watch={watch}
          errors={errors}
        />
      ))}

      {submissionMessage ? (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            submissionState === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          {submissionMessage}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={submissionState === "submitting"}
        className="inline-flex items-center rounded-full bg-slate-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submissionState === "submitting" ? "Submitting..." : "Submit response"}
      </button>
    </form>
  );
}