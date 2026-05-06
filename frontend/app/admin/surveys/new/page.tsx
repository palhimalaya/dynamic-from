"use client";

import { useRouter } from "next/navigation";

import { SurveyEditor } from "@/components/SurveyEditor";
import { createSurvey } from "@/lib/api";
import type { SurveySchema } from "@/lib/survey-types";

export default function CreateSurveyPage() {
  const router = useRouter();

  const handleSubmit = async (data: {
    title: string;
    description: string;
    schema: SurveySchema;
  }) => {
    await createSurvey(data);
    router.push("/admin?toast=survey-created");
  };

  return (
    <main className="min-h-screen px-6 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Create</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">New Survey</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Build a new survey by adding questions and configuring options.
          </p>
        </div>

        <SurveyEditor onSubmit={handleSubmit} />
      </div>
    </main>
  );
}
