export default function Loading() {
  return (
    <main className="min-h-screen px-6 py-10 sm:px-8 lg:px-12">
      <section className="mx-auto max-w-4xl rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-10">
        <div className="space-y-3">
          <div className="h-4 w-20 animate-pulse rounded-full bg-slate-200" />
          <div className="h-10 w-2/3 animate-pulse rounded-2xl bg-slate-200" />
          <div className="h-4 w-full animate-pulse rounded-full bg-slate-200" />
          <div className="h-4 w-5/6 animate-pulse rounded-full bg-slate-200" />
        </div>
        <div className="mt-10 space-y-4">
          <div className="h-28 animate-pulse rounded-3xl bg-slate-100" />
          <div className="h-28 animate-pulse rounded-3xl bg-slate-100" />
          <div className="h-28 animate-pulse rounded-3xl bg-slate-100" />
          <div className="h-12 w-40 animate-pulse rounded-full bg-slate-200" />
        </div>
      </section>
    </main>
  );
}