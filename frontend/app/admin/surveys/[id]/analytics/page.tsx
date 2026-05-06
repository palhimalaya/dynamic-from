import { getSurveyAnalytics, getSurvey } from "@/lib/api";

type AnalyticsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AnalyticsPage({ params }: AnalyticsPageProps) {
  const { id } = await params;
  let survey = null;
  let analytics = null;
  let error = "";

  try {
    [survey, analytics] = await Promise.all([getSurvey(id, { cache: "no-store" }), getSurveyAnalytics(id)]);
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load analytics";
  }

  if (error || !survey) {
    return (
      <main className="min-h-screen px-6 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-rose-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-rose-500">Error</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">Could not load analytics</h1>
          <p className="mt-4 text-sm leading-6 text-slate-600">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <section className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Analytics</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">{survey.title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{survey.description}</p>
        </section>

        {/* Stats */}
        {analytics ? (
          <section className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Total Responses</p>
            <p className="mt-3 text-4xl font-bold text-slate-950">{analytics.totalResponses}</p>
          </section>
        ) : null}

        {/* Question Stats */}
        {analytics?.questions && analytics.questions.length > 0 ? (
          <section className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-10">
            <h2 className="text-xl font-semibold text-slate-950">Question Responses</h2>

            <div className="mt-6 space-y-8">
              {analytics.questions.map((question) => (
                <div key={question.questionId} className="border-t border-slate-200 pt-8 first:border-t-0 first:pt-0">
                  <h3 className="font-medium text-slate-950">{question.title}</h3>
                  <p className="mt-1 text-xs text-slate-500 capitalize">{question.type}</p>

                  {question.type === "radio" || question.type === "checkbox" ? (
                    <div className="mt-4 space-y-3">
                      {Object.entries(question.counts).length > 0 ? (
                        Object.entries(question.counts).map(([option, count]) => {
                          const percentage = Math.round((count / analytics.totalResponses) * 100);
                          return (
                            <div key={option} className="flex items-center gap-4">
                              <span className="w-32 text-sm font-medium text-slate-700">{option}</span>
                              <div className="flex-1">
                                <div className="h-2 rounded-full bg-slate-200">
                                  <div
                                    className="h-2 rounded-full bg-slate-950 transition-all"
                                    style={{ width: `${Math.max(percentage, 5)}%` }}
                                  />
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-right">
                                <span className="w-12 text-sm font-semibold text-slate-950">{count}</span>
                                <span className="w-10 text-xs text-slate-500">{percentage}%</span>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-sm text-slate-500">No responses yet</p>
                      )}
                    </div>
                  ) : question.type === "rating" ? (
                    <div className="mt-4">
                      <div className="text-4xl font-bold text-slate-950">{question.average.toFixed(1)}</div>
                      <p className="mt-1 text-sm text-slate-600">Average rating</p>
                    </div>
                  ) : question.type === "text" ? (
                    <div className="mt-4 space-y-2">
                      {question.responses.length > 0 ? (
                        <ul className="space-y-2">
                          {question.responses.slice(0, 5).map((response, idx) => (
                            <li key={idx} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">
                              &quot;{response}&quot;
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-slate-500">No text responses</p>
                      )}
                      {question.responses.length > 5 && (
                        <p className="text-xs text-slate-500">+{question.responses.length - 5} more responses</p>
                      )}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className="rounded-[2rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-slate-600">
            No response data available yet. Share the survey to start collecting responses.
          </section>
        )}
      </div>
    </main>
  );
}
