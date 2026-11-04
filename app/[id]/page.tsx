"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Users,
  Star,
  Clock3,
  ShieldCheck,
  Check,
  Camera,
} from "lucide-react";

import type { Studio } from "@/lib/studios";
import { getStudioById } from "@/services/studioService";
import BookingForm from "@/components/studios/BookingForm";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

export default function StudioDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadStudio = async () => {
      setLoading(true);
      setError("");

      try {
        const result = await getStudioById(id);

        if (!active) return;

        if (!result) {
          setError("This studio could not be found.");
        } else {
          setStudio(result);
        }
      } catch {
        if (active) setError("Unable to load this studio right now.");
      } finally {
        if (active) setLoading(false);
      }
    };

    if (id) loadStudio();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f8f5] px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="h-5 w-32 rounded bg-[#e4e9e3]" />
          <div className="mt-7 h-80 rounded-3xl bg-[#e4e9e3] sm:h-80" />
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_390px]">
            <div className="space-y-4">
              <div className="h-9 w-2/3 rounded bg-[#e4e9e3]" />
              <div className="h-4 w-1/3 rounded bg-[#e4e9e3]" />
              <div className="h-28 rounded-2xl bg-[#e4e9e3]" />
            </div>
            <div className="h-110 rounded-2xl bg-[#e4e9e3]" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !studio) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f7f8f5] px-5">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf1eb] text-[#315d45]">
            <Camera size={25} />
          </div>
          <h1 className="mt-5 text-2xl font-semibold text-[#24372d]">
            Studio unavailable
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#78857c]">
            {error || "This studio may have been removed or is no longer available."}
          </p>
          <Link
            href="/studios"
            className="mt-6 inline-flex h-11 items-center rounded-xl bg-[#315d45] px-5 text-sm font-semibold text-white hover:bg-[#254b37]"
          >
            Explore studios
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f8f5] px-4 pb-16 pt-7 sm:px-6 lg:pt-10">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/studios"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#68776e] transition hover:text-[#315d45]"
        >
          <ArrowLeft size={16} />
          Back to explore
        </Link>

        <div className="relative mt-6 h-70 overflow-hidden rounded-2xl bg-[#e5eae4] sm:h-97.5 lg:h-120">
          {studio.image ? (
            <Image
              src={studio.image}
              alt={studio.title}
              fill
              priority
              unoptimized
              sizes="(max-width: 768px) 100vw, 1200px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[#839087]">
              <Camera size={42} />
            </div>
          )}

          <div className="absolute inset-0 bg-linear-to-t from-black/55 via-transparent to-transparent" />

          <div className="absolute bottom-5 left-5 right-5 text-white sm:bottom-8 sm:left-8">
            <span className="inline-flex rounded-full border border-white/30 bg-black/20 px-3 py-1 text-xs font-medium backdrop-blur-sm">
              {studio.category}
            </span>
            <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              {studio.title}
            </h1>
            <p className="mt-2 flex items-center gap-2 text-sm text-white/85">
              <MapPin size={15} />
              {studio.location}
            </p>
          </div>
        </div>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_390px]">
          <div className="min-w-0 space-y-8">
            <section className="flex flex-wrap gap-x-7 gap-y-4 border-b border-[#e3e8e1] pb-6">
              <div className="flex items-center gap-2 text-sm text-[#66766b]">
                <Users size={17} className="text-[#55745f]" />
                Up to {studio.capacity} guests
              </div>

              <div className="flex items-center gap-2 text-sm text-[#66766b]">
                <Star size={17} className="fill-[#e3a83e] text-[#e3a83e]" />
                {studio.rating > 0
                  ? `${studio.rating.toFixed(1)} (${studio.reviewCount} reviews)`
                  : "New listing"}
              </div>

              <div className="flex items-center gap-2 text-sm text-[#66766b]">
                <Clock3 size={17} className="text-[#55745f]" />
                {formatCurrency(studio.hourlyRate)} / hour
              </div>
            </section>

            <section>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#809087]">
                About this space
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#25382e]">
                A space made for your next production
              </h2>
              <p className="mt-4 whitespace-pre-line text-[15px] leading-8 text-[#68776e]">
                {studio.overview}
              </p>
            </section>

            <section className="border-t border-[#e3e8e1] pt-7">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#809087]">
                Studio facilities
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-[#25382e]">
                Amenities & equipment
              </h2>

              {studio.amenities.length ? (
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {studio.amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-3 rounded-xl border border-[#e5eae4] bg-white px-4 py-3 text-sm text-[#56675c]"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#edf4ed] text-[#477052]">
                        <Check size={15} />
                      </span>
                      {amenity}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-[#87938b]">
                  No amenities have been listed yet.
                </p>
              )}
            </section>

            <section className="border-t border-[#e3e8e1] pt-7">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#809087]">
                Hosted by
              </p>
              <div className="mt-4 flex items-center gap-4 rounded-2xl border border-[#e5eae4] bg-white p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eaf1eb] text-lg font-semibold text-[#315d45]">
                  {(studio.ownerName || "H").charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-[#293c31]">
                    {studio.ownerName || "Studio host"}
                  </h3>
                  <p className="mt-1 text-sm text-[#87938b]">
                    StudioSpace host
                  </p>
                </div>
                <div className="ml-auto hidden items-center gap-2 text-xs text-[#69806e] sm:flex">
                  <ShieldCheck size={17} />
                  Host listing
                </div>
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-24">
            <BookingForm studio={studio} />
          </aside>
        </div>
      </div>
    </main>
  );
}