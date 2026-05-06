import { notFound } from "next/navigation";

import { SurveyForm } from "@/components/survey/SurveyForm";
import { ApiError, getSurvey } from "@/lib/api";

type SurveyViewProps = {
  title: string;
  description: string;
  survey: Awaited<ReturnType<typeof getSurvey>>;
};

function SurveyView({ title, description, survey }: SurveyViewProps) {
  return (
    <main className="min-h-screen px-6 py-10 sm:px-8 lg:px-12">
      <section className="mx-auto max-w-4xl rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-10">
        <div className="mb-8 space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Survey</p>
          <h1 className="text-3xl font-semibold text-slate-950 sm:text-4xl">{title}</h1>
          <p className="max-w-3xl text-sm leading-6 text-slate-600">{description}</p>
        </div>

        <SurveyForm survey={survey} />
      </section>
    </main>
  );
}

function SurveyErrorView({ message }: { message: string }) {
  return (
    <main className="min-h-screen px-6 py-10 sm:px-8 lg:px-12">
      <section className="mx-auto max-w-3xl rounded-[2rem] border border-rose-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-rose-500">Error</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">Could not load this survey</h1>
        <p className="mt-4 text-sm leading-6 text-slate-600">{message}</p>
      </section>
    </main>
  );
}

type SurveyPageProps = {
  params: Promise<{ id: string }>;
};

export default async function SurveyPage({ params }: SurveyPageProps) {
  const { id } = await params;

  let survey: Awaited<ReturnType<typeof getSurvey>> | null = null;
  let errorMessage = "";

  try {
    survey = await getSurvey(id, { cache: "no-store" });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }

    errorMessage = error instanceof Error ? error.message : "Unable to load survey.";
  }

  if (errorMessage) {
    return <SurveyErrorView message={errorMessage} />;
  }

  if (!survey) {
    notFound();
  }

  return <SurveyView title={survey.title} description={survey.description} survey={survey} />;
}