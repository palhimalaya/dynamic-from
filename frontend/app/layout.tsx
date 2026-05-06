import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Navigation } from "@/components/Navigation";
import { RouteToast } from "@/components/RouteToast";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Survey Builder",
  description: "Modern survey administration and response experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[radial-gradient(circle_at_top,_#eff6ff_0%,_#f8fafc_32%,_#ffffff_72%)] text-slate-950">
        <Navigation />
        <RouteToast />
        {children}
      </body>
    </html>
  );
}

