"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import type { SurveyQuestion, SurveySchema } from "@/lib/survey-types";

type SurveyEditorProps = {
  initialData?: {
    title: string;
    description: string;
    schema: SurveySchema;
  };
  onSubmit: (data: { title: string; description: string; schema: SurveySchema }) => Promise<void>;
  isLoading?: boolean;
};

function createQuestionId() {
  return `q_${crypto.randomUUID().slice(0, 8)}`;
}

function createNewQuestion(): SurveyQuestion {
  return {
    id: createQuestionId(),
    type: "text",
    title: "New Question",
    required: false,
  };
}

function isChoiceQuestion(
  question: SurveyQuestion | undefined,
): question is SurveyQuestion & { type: "radio" | "checkbox"; options: string[] } {
  return Boolean(question && (question.type === "radio" || question.type === "checkbox"));
}

function getDefaultConditionValue(question: SurveyQuestion | undefined) {
  if (!question) {
    return "";
  }

  if (isChoiceQuestion(question)) {
    return question.options.find((option) => option.trim().length > 0) ?? "";
  }

  return "";
}

export function SurveyEditor({ initialData, onSubmit, isLoading }: SurveyEditorProps) {
  const [questions, setQuestions] = useState<SurveyQuestion[]>(initialData?.schema.questions ?? []);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
    },
  });

  const updateQuestion = (index: number, field: string, value: unknown) => {
    setQuestions((current) => current.map((question, questionIndex) => {
      if (questionIndex !== index) {
        return question;
      }

      return {
        ...question,
        [field]: value,
      } as SurveyQuestion;
    }));
  };

  const updateQuestionType = (index: number, type: SurveyQuestion["type"]) => {
    setQuestions((current) =>
      current.map((question, questionIndex) => {
        if (questionIndex !== index) {
          return question;
        }

        const { options, ...rest } = question as SurveyQuestion & { options?: string[] };
        void options;

        if (type === "radio" || type === "checkbox") {
          return {
            ...rest,
            type,
            options:
              isChoiceQuestion(question) && question.options.length > 0 ? question.options : ["", ""],
          } as SurveyQuestion;
        }

        return {
          ...rest,
          type,
        } as SurveyQuestion;
      }),
    );
  };

  const updateQuestionCondition = (
    index: number,
    showIf: SurveyQuestion["showIf"],
  ) => {
    updateQuestion(index, "showIf", showIf);
  };

  const addQuestion = () => {
    setQuestions((current) => [...current, createNewQuestion()]);
  };

  const removeQuestion = (index: number) => {
    setQuestions((current) => {
      const removedQuestion = current[index];
      const remaining = current.filter((_, questionIndex) => questionIndex !== index);

      if (!removedQuestion) {
        return remaining;
      }

      return remaining.map((question) => {
        if (question.showIf?.questionId !== removedQuestion.id) {
          return question;
        }

        return {
          ...question,
          showIf: undefined,
        };
      });
    });
  };

  const handleFormSubmit = handleSubmit(async (formData) => {
    if (questions.length === 0) {
      setError("Add at least one question to the survey.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await onSubmit({
        title: formData.title,
        description: formData.description,
        schema: { questions },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save survey");
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <form onSubmit={handleFormSubmit} className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">Survey Details</h2>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Title</span>
            <input
              type="text"
              {...register("title", { required: "Title is required" })}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:bg-white"
              placeholder="e.g., Developer Survey"
            />
            {errors.title?.message && <p className="mt-1 text-xs text-rose-600">{errors.title.message as string}</p>}
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Description</span>
            <textarea
              {...register("description")}
              rows={3}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:bg-white"
              placeholder="Describe what this survey is about..."
            />
          </label>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-950">Questions</h2>
          <button
            type="button"
            onClick={addQuestion}
            className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Add Question
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {questions.length === 0 ? (
            <p className="text-center text-sm text-slate-500">No questions added yet. Click &quot;Add Question&quot; to start.</p>
          ) : (
            questions.map((question, index) => {
              const availableConditionQuestions = questions.slice(0, index);
              const conditionSourceQuestion = question.showIf
                ? availableConditionQuestions.find((candidate) => candidate.id === question.showIf?.questionId)
                : undefined;
              const resolvedConditionSource = conditionSourceQuestion ?? availableConditionQuestions[0];
              const conditionOptions = isChoiceQuestion(resolvedConditionSource)
                ? resolvedConditionSource.options.filter((option) => option.trim().length > 0)
                : [];
              const canAddCondition = availableConditionQuestions.length > 0;
              const hasCondition = Boolean(question.showIf);

              return (
                <div key={question.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <input
                        type="text"
                        value={question.title}
                        onChange={(e) => updateQuestion(index, "title", e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-950 outline-none focus:border-slate-400"
                        placeholder="Question text"
                      />

                      <select
                        value={question.type}
                        onChange={(e) => updateQuestionType(index, e.target.value as SurveyQuestion["type"])}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-slate-400"
                      >
                        <option value="text">Text</option>
                        <option value="radio">Radio</option>
                        <option value="checkbox">Checkbox</option>
                        <option value="rating">Rating</option>
                      </select>

                      {(question.type === "radio" || question.type === "checkbox") && (
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-slate-600">Options</label>
                          <div className="space-y-2">
                            {((question.options ?? []) as string[]).map((option, optionIndex) => (
                              <div key={optionIndex} className="flex gap-2">
                                <input
                                  type="text"
                                  value={option}
                                  onChange={(e) => {
                                    const newOptions = [...((question.options ?? []) as string[])];
                                    newOptions[optionIndex] = e.target.value;
                                    updateQuestion(index, "options", newOptions);
                                  }}
                                  className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-slate-400"
                                  placeholder="Option text"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newOptions = ((question.options ?? []) as string[]).filter(
                                      (_, currentIndex) => currentIndex !== optionIndex,
                                    );
                                    updateQuestion(index, "options", newOptions);
                                  }}
                                  className="text-sm font-medium text-rose-600 hover:text-rose-700"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const newOptions = [...((question.options ?? []) as string[]), ""];
                              updateQuestion(index, "options", newOptions);
                            }}
                            className="text-sm font-medium text-slate-600 hover:text-slate-950"
                          >
                            + Add Option
                          </button>
                        </div>
                      )}

                      {canAddCondition ? (
                        <div className="rounded-2xl border border-slate-200 bg-white p-4">
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="text-sm font-semibold text-slate-800">Conditional logic</p>
                              <p className="mt-1 text-xs leading-5 text-slate-500">
                                Show this question only when an earlier answer matches.
                              </p>
                            </div>

                            {hasCondition ? (
                              <button
                                type="button"
                                onClick={() => updateQuestionCondition(index, undefined)}
                                className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-950"
                              >
                                Remove condition
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  const sourceQuestion = resolvedConditionSource;
                                  if (!sourceQuestion) {
                                    return;
                                  }

                                  updateQuestionCondition(index, {
                                    questionId: sourceQuestion.id,
                                    equals: getDefaultConditionValue(sourceQuestion),
                                  });
                                }}
                                className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
                              >
                                Add condition
                              </button>
                            )}
                          </div>

                          {question.showIf ? (
                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                              <label className="block">
                                <span className="text-xs font-medium text-slate-600">When question</span>
                                <select
                                  value={question.showIf.questionId}
                                  onChange={(e) => {
                                    const sourceQuestion = availableConditionQuestions.find(
                                      (candidate) => candidate.id === e.target.value,
                                    );

                                    if (!sourceQuestion) {
                                      return;
                                    }

                                    updateQuestionCondition(index, {
                                      questionId: sourceQuestion.id,
                                      equals: getDefaultConditionValue(sourceQuestion),
                                    });
                                  }}
                                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-slate-400"
                                >
                                  {availableConditionQuestions.map((candidate) => (
                                    <option key={candidate.id} value={candidate.id}>
                                      {candidate.title || candidate.id}
                                    </option>
                                  ))}
                                </select>
                              </label>

                              <label className="block">
                                <span className="text-xs font-medium text-slate-600">Answer is</span>
                                {isChoiceQuestion(resolvedConditionSource) && conditionOptions.length > 0 ? (
                                  <select
                                    value={question.showIf.equals}
                                    onChange={(e) => {
                                      updateQuestionCondition(index, {
                                        questionId: question.showIf!.questionId,
                                        equals: e.target.value,
                                      });
                                    }}
                                    className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-slate-400"
                                  >
                                    {conditionOptions.map((option, idx) => (
                                      <option key={`${option}-${idx}`} value={option}>
                                        {option}
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  <input
                                    type="text"
                                    value={question.showIf.equals}
                                    onChange={(e) => {
                                      updateQuestionCondition(index, {
                                        questionId: question.showIf!.questionId,
                                        equals: e.target.value,
                                      });
                                    }}
                                    className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-slate-400"
                                    placeholder="Type the exact answer to match"
                                  />
                                )}
                              </label>
                            </div>
                          ) : null}
                        </div>
                      ) : null}

                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={question.required}
                            onChange={(e) => updateQuestion(index, "required", e.target.checked)}
                            className="h-4 w-4"
                          />
                          <span className="text-xs font-medium text-slate-600">Required</span>
                        </label>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeQuestion(index)}
                      className="text-sm font-medium text-rose-600 transition hover:text-rose-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {error && <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{error}</div>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting || isLoading}
          className="rounded-full bg-slate-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Saving..." : "Save Survey"}
        </button>
      </div>
    </form>
  );
}
