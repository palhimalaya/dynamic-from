import Link from "next/link";

import { getSurveys } from "@/lib/api";

type SurveyListViewProps = {
  surveys: Awaited<ReturnType<typeof getSurveys>>;
};

function SurveyListView({ surveys }: SurveyListViewProps) {
  return (
    <main className="min-h-screen px-6 py-10 sm:px-8 lg:px-12">
      <section className="mx-auto max-w-6xl space-y-8 rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-10">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Admin</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">Surveys</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Browse all surveys from the backend and open one to fill it out.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
          >
            Back to home
          </Link>
        </header>

        {surveys.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {surveys.map((survey) => (
              <article
                key={survey.id}
                className="flex h-full flex-col rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 shadow-sm shadow-slate-200/60"
              >
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Survey</p>
                  <h2 className="mt-3 text-xl font-semibold text-slate-950">{survey.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{survey.description}</p>
                </div>
                <Link
                  href={`/s/${survey.id}`}
                  className="mt-6 inline-flex items-center justify-center rounded-full bg-slate-950 px-4 py-3 text-sm font-medium text-white shadow-[0_12px_30px_rgba(15,23,42,0.14)] transition hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  Open survey
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-slate-600">
            No surveys were returned from the backend.
          </div>
        )}
      </section>
    </main>
  );
}

type SurveyListErrorProps = {
  message: string;
};

function SurveyListError({ message }: SurveyListErrorProps) {
  return (
    <main className="min-h-screen px-6 py-10 sm:px-8 lg:px-12">
      <section className="mx-auto max-w-3xl rounded-[2rem] border border-rose-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-rose-500">Error</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">Could not load surveys</h1>
        <p className="mt-4 text-sm leading-6 text-slate-600">{message}</p>
        <Link
          href="/admin/surveys"
          className="mt-8 inline-flex items-center rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Try again
        </Link>
      </section>
    </main>
  );
}

export default async function AdminSurveysPage() {
  let surveys: Awaited<ReturnType<typeof getSurveys>> | null = null;
  let errorMessage = "";

  try {
    surveys = await getSurveys({ cache: "no-store" });
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : "Unable to load surveys.";
  }

  if (errorMessage) {
    return <SurveyListError message={errorMessage} />;
  }

  return <SurveyListView surveys={surveys ?? []} />;
}