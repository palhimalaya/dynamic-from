"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type ToastMessage = {
  title: string;
  description: string;
};

const TOAST_MESSAGES: Record<string, ToastMessage> = {
  "survey-created": {
    title: "Survey created",
    description: "Your new survey is now saved and available in the admin dashboard.",
  },
  "survey-updated": {
    title: "Survey updated",
    description: "Your changes were saved and the latest data is now being shown.",
  },
};

export function RouteToast() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const toastKey = searchParams.get("toast");
  const toast = toastKey ? TOAST_MESSAGES[toastKey] ?? null : null;

  useEffect(() => {
    if (!toastKey || !toast) {
      return;
    }

    const timeout = window.setTimeout(() => {
      const nextParams = new URLSearchParams(searchParams.toString());
      nextParams.delete("toast");
      const nextUrl = nextParams.toString() ? `${pathname}?${nextParams.toString()}` : pathname;
      router.replace(nextUrl);
    }, 3500);

    return () => window.clearTimeout(timeout);
  }, [pathname, router, searchParams, toast, toastKey]);

  if (!toast) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 w-[calc(100vw-2rem)] max-w-sm rounded-2xl border border-emerald-200 bg-white p-4 shadow-[0_24px_80px_rgba(15,23,42,0.16)] sm:right-6 sm:top-6 sm:w-full">
      <p className="text-sm font-semibold text-emerald-700">{toast.title}</p>
      <p className="mt-1 text-sm leading-6 text-slate-600">{toast.description}</p>
    </div>
  );
}
