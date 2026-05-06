"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { SurveyEditor } from "@/components/SurveyEditor";
import { getSurvey, updateSurvey } from "@/lib/api";
import type { SurveySchema } from "@/lib/survey-types";

type EditSurveyPageProps = {
  params: Promise<{ id: string }>;
};

export default function EditSurveyPage({ params }: EditSurveyPageProps) {
  const router = useRouter();
  const [survey, setSurvey] = useState<{ title: string; description: string; schema: SurveySchema } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [surveyId, setSurveyId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { id } = await params;
        setSurveyId(id);
        const data = await getSurvey(id, { cache: "no-store" });
        setSurvey({
          title: data.title,
          description: data.description,
          schema: data.schema,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load survey");
      } finally {
        setLoading(false);
      }
    })();
  }, [params]);

  const handleSubmit = async (data: { title: string; description: string; schema: SurveySchema }) => {
    if (!surveyId) return;
    await updateSurvey(surveyId, data);
    router.push("/admin?toast=survey-updated");
  };

  if (loading) {
    return (
      <main className="min-h-screen px-6 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <div className="space-y-3">
            <div className="h-4 w-24 animate-pulse rounded-full bg-slate-200" />
            <div className="h-9 w-48 animate-pulse rounded-2xl bg-slate-200" />
            <div className="h-4 w-96 animate-pulse rounded-full bg-slate-200" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !survey) {
    return (
      <main className="min-h-screen px-6 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-rose-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-rose-500">Error</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">Could not load survey</h1>
          <p className="mt-4 text-sm leading-6 text-slate-600">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Edit</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">{survey.title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">Update the survey details and questions.</p>
        </div>

        <SurveyEditor initialData={survey} onSubmit={handleSubmit} />
      </div>
    </main>
  );
}
