import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, MapPin, Star } from "lucide-react";
import { getFeaturedStudios } from "@/services/studioService";
import type { Studio } from "@/lib/studios";

export default async function FeaturedStudiosSection() {
  let studios: Studio[] = [];

  try {
    studios = await getFeaturedStudios();
  } catch (error) {
    console.error("Featured studios could not be loaded:", error);
  }

  return (
    <section className="bg-[#f5f1ea] px-5 py-16 text-[#233b35] dark:bg-[#171a18] dark:text-[#f5f1ea] sm:px-8 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#a45d42]">
              Spaces worth discovering
            </p>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl">
              Featured studios
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-[#66736d] dark:text-[#b3beb8]">
              Thoughtfully equipped spaces, ready to bring your next creative
              project to life.
            </p>
          </div>

          <Link
            href="/studios"
            className="inline-flex w-fit items-center gap-2 border-b border-[#a45d42] pb-2 text-sm font-semibold transition hover:gap-3"
          >
            Explore all studios
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {studios.length > 0 ? (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {studios.slice(0, 6).map((studio) => (
              <Link
                key={studio.id}
                href={`/studios/${studio.id}`}
                className="group min-w-0"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-[#e5e0d7] dark:bg-white/10">
                  {studio.image ? (
                    <Image
                      src={studio.image}
                      alt={studio.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-[#66736d]">
                      Studio image unavailable
                    </div>
                  )}

                  <span className="absolute left-4 top-4 bg-[#f5f1ea] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#233b35]">
                    {studio.category}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4 border-b border-[#233b35]/15 py-5 dark:border-white/15">
                  <div className="min-w-0">
                    <h3 className="truncate font-serif text-xl transition group-hover:text-[#a45d42] sm:text-2xl">
                      {studio.title}
                    </h3>

                    <p className="mt-2 flex items-center gap-1.5 text-xs text-[#66736d] dark:text-[#b3beb8]">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{studio.location}</span>
                    </p>
                  </div>

                  <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 transition group-hover:-translate-y-1 group-hover:translate-x-1" />
                </div>

                <div className="flex items-center justify-between gap-3 pt-4 text-sm">
                  <span className="font-semibold">
                    ৳{studio.hourlyRate.toLocaleString("en-BD")}
                    <span className="ml-1 text-xs font-normal text-[#66736d] dark:text-[#b3beb8]">
                      / hour
                    </span>
                  </span>

                  <span className="flex items-center gap-1 text-xs text-[#66736d] dark:text-[#b3beb8]">
                    <Star className="h-3.5 w-3.5 fill-[#a45d42] text-[#a45d42]" />
                    {studio.rating > 0 ? studio.rating.toFixed(1) : "New"}
                    {studio.reviewCount > 0 && ` (${studio.reviewCount})`}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="border-y border-[#233b35]/10 py-14 text-center dark:border-white/10">
            <h3 className="font-serif text-2xl">
              New spaces are on the way.
            </h3>

            <p className="mt-3 text-sm text-[#66736d] dark:text-[#b3beb8]">
              Featured studios will appear here as hosts publish their spaces.
            </p>

            <Link
              href="/studios"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#a45d42] hover:underline"
            >
              Browse all studios
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}