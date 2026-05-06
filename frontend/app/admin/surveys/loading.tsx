export default function Loading() {
  return (
    <main className="min-h-screen px-6 py-10 sm:px-8 lg:px-12">
      <section className="mx-auto max-w-6xl space-y-6 rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-10">
        <div className="space-y-3">
          <div className="h-4 w-24 animate-pulse rounded-full bg-slate-200" />
          <div className="h-9 w-48 animate-pulse rounded-2xl bg-slate-200" />
          <div className="h-4 w-96 max-w-full animate-pulse rounded-full bg-slate-200" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <div className="h-3 w-20 animate-pulse rounded-full bg-slate-200" />
              <div className="mt-4 h-6 w-3/4 animate-pulse rounded-full bg-slate-200" />
              <div className="mt-3 h-4 w-full animate-pulse rounded-full bg-slate-200" />
              <div className="mt-2 h-4 w-5/6 animate-pulse rounded-full bg-slate-200" />
              <div className="mt-6 h-11 w-36 animate-pulse rounded-full bg-slate-200" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}