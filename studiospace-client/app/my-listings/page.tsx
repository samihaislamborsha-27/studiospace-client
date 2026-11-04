"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2, RefreshCw, MapPin } from "lucide-react";
import { toast } from "sonner";
import { getMyStudios, deleteStudio } from "@/services/studioService";
import type { Studio } from "@/lib/studios";
import { useAuth } from "@/context/AuthProvider";

export default function MyListingsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadStudios = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getMyStudios();
      setStudios(result);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to load your listings."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user) void loadStudios();
  }, [user, loadStudios]);

  const handleDelete = async (studio: Studio) => {
    const confirmed = window.confirm(
      `Delete "${studio.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeleting(studio.id);
      await deleteStudio(studio.id);
      setStudios((current) =>
        current.filter((item) => item.id !== studio.id)
      );
      toast.success("Studio listing deleted.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to delete listing."
      );
    } finally {
      setDeleting(null);
    }
  };

  if (authLoading || !user) {
    return (
      <main className="min-h-[60vh] grid place-items-center bg-[#f5f1ea] dark:bg-[#171a18]">
        <p className="text-sm text-[#64746e]">Checking your account...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f1ea] px-4 py-12 text-[#233b35] dark:bg-[#171a18] dark:text-[#f5f1ea] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 border-b border-[#dcd8cf] pb-8 dark:border-white/10 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#a45d42]">
              Owner workspace
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              My studio listings
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#64746e] dark:text-[#a8b3ad]">
              Manage your creative spaces, update their details and keep your
              listings up to date.
            </p>
          </div>

          <Link
            href="/add-studio"
            className="inline-flex h-12 items-center justify-center gap-2 bg-[#233b35] px-5 text-sm font-semibold text-white transition hover:bg-[#34564d] dark:bg-[#a45d42] dark:hover:bg-[#b76b50]"
          >
            <Plus size={17} />
            Add a studio
          </Link>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-[#64746e] dark:text-[#a8b3ad]">
            {studios.length} {studios.length === 1 ? "listing" : "listings"}
          </p>
          <button
            onClick={() => void loadStudios()}
            disabled={loading}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#34564d] hover:underline disabled:opacity-50 dark:text-[#d5e4dc]"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-80 animate-pulse bg-white/60 dark:bg-white/5"
              />
            ))}
          </div>
        ) : studios.length === 0 ? (
          <div className="mt-8 border border-dashed border-[#c9c5bb] px-6 py-20 text-center dark:border-white/15">
            <h2 className="text-xl font-semibold">No studio listings yet</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#64746e] dark:text-[#a8b3ad]">
              Your creative space will appear here after you publish your first
              listing.
            </p>
            <Link
              href="/add-studio"
              className="mt-6 inline-flex h-11 items-center gap-2 bg-[#233b35] px-5 text-sm font-semibold text-white hover:bg-[#34564d] dark:bg-[#a45d42]"
            >
              <Plus size={16} />
              Create your first listing
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((studio) => (
              <article
                key={studio.id}
                className="overflow-hidden border border-[#e3ded5] bg-white dark:border-white/10 dark:bg-[#202522]"
              >
                <Link href={`/studios/${studio.id}`} className="group block">
                  <div className="relative h-52 bg-[#e9e4da] dark:bg-[#303833]">
                    {studio.image ? (
                      <Image
                        src={studio.image}
                        alt={studio.title}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="grid h-full place-items-center text-sm text-[#64746e]">
                        No image available
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#a45d42]">
                      {studio.category}
                    </p>
                    <h2 className="mt-2 text-lg font-semibold">
                      {studio.title}
                    </h2>
                    <p className="mt-2 flex items-center gap-1.5 text-sm text-[#64746e] dark:text-[#a8b3ad]">
                      <MapPin size={14} />
                      {studio.location}
                    </p>
                    <p className="mt-4 text-sm font-semibold">
                      ৳{studio.hourlyRate.toLocaleString("en-BD")} / hour
                    </p>
                  </div>
                </Link>

                <div className="flex border-t border-[#e8e3da] dark:border-white/10">
                  <Link
                    href={`/studios/edit/${studio.id}`}
                    className="flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium hover:bg-[#f5f1ea] dark:hover:bg-white/5"
                  >
                    <Pencil size={15} />
                    Edit
                  </Link>
                  <button
                    onClick={() => void handleDelete(studio)}
                    disabled={deleting === studio.id}
                    className="flex flex-1 items-center justify-center gap-2 border-l border-[#e8e3da] py-3 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-white/10 dark:hover:bg-red-950/20"
                  >
                    <Trash2 size={15} />
                    {deleting === studio.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
