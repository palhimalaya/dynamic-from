import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen px-6 py-10 sm:px-8 lg:px-12">
      <section className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Not found</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">Survey not found</h1>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          The survey you requested does not exist or is no longer available.
        </p>
        <Link
          href="/admin/surveys"
          className="mt-8 inline-flex items-center rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Back to surveys
        </Link>
      </section>
    </main>
  );
}