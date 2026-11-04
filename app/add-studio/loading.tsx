import { LoaderCircle } from "lucide-react";

export default function AddStudioLoading() {
  return (
    <main className="min-h-screen bg-[#f5f1ea] px-5 py-16 dark:bg-[#171a18] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 h-4 w-40 animate-pulse rounded bg-[#233b35]/10 dark:bg-white/10" />

        <div className="mb-12 space-y-4">
          <div className="h-3 w-36 animate-pulse rounded bg-[#a45d42]/20" />
          <div className="h-12 max-w-xl animate-pulse rounded bg-[#233b35]/10 dark:bg-white/10" />
          <div className="h-4 max-w-lg animate-pulse rounded bg-[#233b35]/10 dark:bg-white/10" />
        </div>

        <div className="flex min-h-64 items-center justify-center border-t border-[#233b35]/10 dark:border-white/10">
          <div className="flex items-center gap-3 text-sm text-[#66736d] dark:text-[#b3beb8]">
            <LoaderCircle className="h-5 w-5 animate-spin text-[#a45d42]" />
            Preparing your studio form...
          </div>
        </div>
      </div>
    </main>
  );
}