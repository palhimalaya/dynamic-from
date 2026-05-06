"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navigation() {
  const pathname = usePathname();

  const isAdmin = pathname.startsWith("/admin");

  return (
    <nav className="border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8">
        <Link href="/" className="text-lg font-semibold text-slate-950">
          Survey Builder
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition ${
              pathname === "/" ? "text-slate-950" : "text-slate-600 hover:text-slate-950"
            }`}
          >
            Browse
          </Link>

          <Link
            href="/admin"
            className={`text-sm font-medium transition ${
              isAdmin ? "text-slate-950" : "text-slate-600 hover:text-slate-950"
            }`}
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}
