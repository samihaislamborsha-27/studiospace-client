"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Building2,
  Eye,
  MapPin,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthProvider";
import type { Studio } from "@/lib/studios";
import { deleteStudio, getMyStudios } from "@/services/studioService";

function formatCurrency(value: number) {
  return `৳${value.toLocaleString("en-BD")}`;
}

function getStatusClasses(status: string) {
  switch (status.toLowerCase()) {
    case "available":
      return "bg-[#e5f1e9] text-[#376b4b] dark:bg-[#376b4b]/20 dark:text-[#9ed0ad]";
    case "pending":
      return "bg-[#fff1d9] text-[#98651c] dark:bg-[#98651c]/20 dark:text-[#f2c77e]";
    case "unavailable":
      return "bg-[#f0e8e5] text-[#9a5541] dark:bg-[#9a5541]/20 dark:text-[#e6a995]";
    default:
      return "bg-[#ecece8] text-[#66736d] dark:bg-white/10 dark:text-[#c1c9c4]";
  }
}

function ListingCard({
  studio,
  onDelete,
  deleting,
}: {
  studio: Studio;
  onDelete: (studio: Studio) => void;
  deleting: boolean;
}) {
  const status = studio.status || "Available";

  return (
    <article className="group grid min-w-0 overflow-hidden border border-[#233b35]/10 bg-white/70 transition hover:border-[#a45d42]/35 dark:border-white/10 dark:bg-white/[0.03] lg:grid-cols-[240px_minmax(0,1fr)]">
      <Link
        href={`/studios/${studio.id}`}
        className="relative block aspect-[16/10] overflow-hidden bg-[#e5e0d7] lg:aspect-auto lg:min-h-[230px]"
        aria-label={`View ${studio.title}`}
      >
        {studio.image ? (
          <Image
            src={studio.image}
            alt={studio.title}
            fill
            unoptimized
            sizes="(max-width: 1024px) 100vw, 240px"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full min-h-48 items-center justify-center text-sm text-[#66736d]">
            No cover image
          </div>
        )}
      </Link>

      <div className="flex min-w-0 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.13em] text-[#a45d42]">
            {studio.category}
          </span>
          <span
            className={`px-2.5 py-1 text-[11px] font-semibold ${getStatusClasses(status)}`}
          >
            {status}
          </span>
          {studio.featured && (
            <span className="bg-[#f5eadf] px-2.5 py-1 text-[11px] font-semibold text-[#986044] dark:bg-[#986044]/20 dark:text-[#e5b39a]">
              Featured
            </span>
          )}
        </div>

        <Link href={`/studios/${studio.id}`} className="mt-3 w-fit max-w-full">
          <h2 className="line-clamp-2 font-serif text-2xl text-[#233b35] transition group-hover:text-[#a45d42] dark:text-[#f5f1ea] sm:text-[26px]">
            {studio.title}
          </h2>
        </Link>

        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#66736d] dark:text-[#b3beb8]">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-[#a45d42]" />
            {studio.location}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-[#a45d42]" />
            Up to {studio.capacity} people
          </span>
        </div>

        <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-t border-[#233b35]/10 pt-4 dark:border-white/10">
          <div>
            <p className="text-[11px] text-[#89938d]">Hourly rate</p>
            <p className="mt-1 text-lg font-semibold text-[#233b35] dark:text-[#f5f1ea]">
              {formatCurrency(studio.hourlyRate)}
              <span className="ml-1 text-xs font-normal text-[#66736d] dark:text-[#b3beb8]">
                / hour
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/studios/${studio.id}`}
              className="inline-flex items-center gap-1.5 border border-[#233b35]/15 px-3 py-2 text-xs font-semibold text-[#233b35] transition hover:border-[#a45d42] hover:text-[#a45d42] dark:border-white/15 dark:text-[#f5f1ea]"
            >
              <Eye className="h-3.5 w-3.5" />
              View
            </Link>

            <Link
              href={`/studios/edit/${studio.id}`}
              className="inline-flex items-center gap-1.5 bg-[#233b35] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#314d45] dark:bg-[#a45d42] dark:hover:bg-[#b96b4e]"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Link>

            <button
              type="button"
              onClick={() => onDelete(studio)}
              disabled={deleting}
              className="inline-flex items-center gap-1.5 border border-[#a45d42]/25 px-3 py-2 text-xs font-semibold text-[#a45d42] transition hover:bg-[#a45d42] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function MyListingsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadListings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyStudios();
      setStudios(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your studio listings."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace("/login?next=%2Fmy-listings");
      return;
    }

    void loadListings();
  }, [authLoading, user, router, loadListings]);

  const availableCount = useMemo(
    () =>
      studios.filter(
        (studio) => (studio.status || "").toLowerCase() === "available"
      ).length,
    [studios]
  );

  const handleDelete = async (studio: Studio) => {
    const confirmed = window.confirm(
      `Delete "${studio.title}"? This listing will be removed from your active listings.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(studio.id);
      await deleteStudio(studio.id);
      setStudios((current) =>
        current.filter((item) => item.id !== studio.id)
      );
      toast.success("Studio listing deleted.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Unable to delete this listing."
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (authLoading || (user && loading)) {
    return (
      <main className="min-h-[70vh] bg-[#f5f1ea] px-5 py-16 dark:bg-[#171a18] sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="h-3 w-32 bg-[#dcd8cf] dark:bg-white/10" />
          <div className="mt-5 h-10 w-72 max-w-full bg-[#dcd8cf] dark:bg-white/10" />
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-24 bg-[#e8e3da] dark:bg-white/5"
              />
            ))}
          </div>
          <div className="mt-8 space-y-4">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="h-56 bg-[#e8e3da] dark:bg-white/5"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#f5f1ea] text-[#233b35] dark:bg-[#171a18] dark:text-[#f5f1ea]">
      <section className="border-b border-[#233b35]/10 px-5 py-12 dark:border-white/10 sm:px-8 sm:py-16 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-7 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#a45d42]">
              Your workspace
            </p>
            <h1 className="font-serif text-4xl leading-tight sm:text-5xl">
              My Listings
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[#66736d] dark:text-[#b3beb8] sm:text-base">
              Manage your creative spaces, review their status, and keep your
              listings up to date.
            </p>
          </div>

          <Link
            href="/add-studio"
            className="inline-flex w-fit items-center justify-center gap-2 bg-[#233b35] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#314d45] dark:bg-[#a45d42] dark:hover:bg-[#b96b4e]"
          >
            <Plus className="h-4 w-4" />
            Add a studio
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mb-9 grid gap-3 sm:grid-cols-3">
          <div className="border border-[#233b35]/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#66736d] dark:text-[#b3beb8]">
                Total listings
              </p>
              <Building2 className="h-4 w-4 text-[#a45d42]" />
            </div>
            <p className="mt-3 font-serif text-3xl">{studios.length}</p>
          </div>

          <div className="border border-[#233b35]/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#66736d] dark:text-[#b3beb8]">
                Available
              </p>
              <Eye className="h-4 w-4 text-[#a45d42]" />
            </div>
            <p className="mt-3 font-serif text-3xl">{availableCount}</p>
          </div>

          <div className="border border-[#233b35]/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#66736d] dark:text-[#b3beb8]">
                Other statuses
              </p>
              <RefreshCw className="h-4 w-4 text-[#a45d42]" />
            </div>
            <p className="mt-3 font-serif text-3xl">
              {studios.length - availableCount}
            </p>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl">
              Your creative spaces
            </h2>
            <p className="mt-1 text-sm text-[#66736d] dark:text-[#b3beb8]">
              {studios.length} {studios.length === 1 ? "listing" : "listings"}
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadListings()}
            disabled={loading}
            className="inline-flex items-center gap-2 border border-[#233b35]/15 px-4 py-2.5 text-xs font-semibold transition hover:border-[#a45d42] hover:text-[#a45d42] disabled:opacity-50 dark:border-white/15"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {error ? (
          <div className="border-y border-[#a45d42]/25 py-14 text-center">
            <h3 className="font-serif text-2xl">Your listings couldn’t load</h3>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#66736d] dark:text-[#b3beb8]">
              {error}
            </p>
            <button
              type="button"
              onClick={() => void loadListings()}
              className="mt-6 inline-flex items-center gap-2 bg-[#233b35] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#314d45] dark:bg-[#a45d42]"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>
          </div>
        ) : studios.length > 0 ? (
          <div className="space-y-5">
            {studios.map((studio) => (
              <ListingCard
                key={studio.id}
                studio={studio}
                onDelete={handleDelete}
                deleting={deletingId === studio.id}
              />
            ))}
          </div>
        ) : (
          <div className="border-y border-[#233b35]/10 py-16 text-center dark:border-white/10 sm:py-20">
            <div className="mx-auto flex h-14 w-14 items-center justify-center border border-[#a45d42]/25 text-[#a45d42]">
              <Building2 className="h-6 w-6" />
            </div>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-[#a45d42]">
              A space for your next opportunity
            </p>
            <h3 className="mt-3 font-serif text-2xl sm:text-3xl">
              You haven’t listed a studio yet.
            </h3>
            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#66736d] dark:text-[#b3beb8]">
              Share your creative space with photographers, filmmakers,
              musicians, and creators looking for somewhere to work.
            </p>
            <Link
              href="/add-studio"
              className="mt-7 inline-flex items-center gap-2 bg-[#233b35] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#314d45] dark:bg-[#a45d42]"
            >
              List your first studio
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
