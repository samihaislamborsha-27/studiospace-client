import { Suspense } from "react";
import type { Metadata } from "next";
import ExploreStudios from "@/components/studios/ExploreStudios";

export const metadata: Metadata = {
  title: "Explore Studios",
  description:
    "Discover creative studios for photography, filmmaking, podcasting, music and more.",
};

function ExploreStudiosFallback() {
  return (
    <main className="min-h-screen bg-[#f5f1ea] px-4 py-16 dark:bg-[#171a18] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl animate-pulse">
        <div className="h-3 w-32 bg-[#dcd8cf] dark:bg-white/10" />
        <div className="mt-5 h-10 w-72 max-w-full bg-[#dcd8cf] dark:bg-white/10" />
        <div className="mt-4 h-4 w-96 max-w-full bg-[#dcd8cf] dark:bg-white/10" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="h-80 bg-[#e8e3da] dark:bg-white/5" />
          ))}
        </div>
      </div>
    </main>
  );
}

export default function StudiosPage() {
  return (
    <Suspense fallback={<ExploreStudiosFallback />}>
      <ExploreStudios />
    </Suspense>
  );
}
