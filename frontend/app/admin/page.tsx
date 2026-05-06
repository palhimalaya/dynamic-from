import Link from "next/link";

import { getSurveys } from "@/lib/api";

export default async function AdminPage() {
  let surveys: Awaited<ReturnType<typeof getSurveys>> | null = null;
  let errorMessage = "";

  try {
    surveys = await getSurveys({ cache: "no-store" });
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : "Unable to load surveys.";
  }

  return (
    <main className="min-h-screen px-6 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <section className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-10">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Admin</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-950">Dashboard</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Create, edit, and manage surveys. View analytics and responses.
              </p>
            </div>
            <Link
              href="/admin/surveys/new"
              className="inline-flex items-center rounded-full bg-slate-950 px-6 py-3 text-sm font-medium text-white shadow-[0_12px_30px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              Create Survey
            </Link>
          </div>
        </section>

        {/* Surveys List */}
        <section className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-10">
          <h2 className="text-xl font-semibold text-slate-950">Surveys</h2>

          {errorMessage ? (
            <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
              {errorMessage}
            </div>
          ) : surveys && surveys.length > 0 ? (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
                  <tr>
                    <th className="pb-3 pl-0 pr-3">Title</th>
                    <th className="pb-3 px-3">Description</th>
                    <th className="pb-3 px-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {surveys.map((survey) => (
                    <tr key={survey.id} className="hover:bg-slate-50">
                      <td className="py-4 pl-0 pr-3 font-medium text-slate-950">{survey.title}</td>
                      <td className="py-4 px-3 text-slate-600">{survey.description}</td>
                      <td className="py-4 px-3">
                        <div className="flex flex-wrap gap-2">
                          <Link
                            href={`/admin/surveys/${survey.id}/analytics`}
                            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
                          >
                            Analytics
                          </Link>
                          <Link
                            href={`/admin/surveys/${survey.id}/edit`}
                            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
                          >
                            Edit
                          </Link>
                          <Link
                            href={`/s/${survey.id}`}
                            className="inline-flex items-center rounded-full bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800"
                          >
                            Preview
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-slate-600">
              No surveys created yet.{" "}
              <Link href="/admin/surveys/new" className="font-medium text-slate-950 hover:underline">
                Create your first survey
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
