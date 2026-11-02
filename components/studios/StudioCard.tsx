import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, Star, Users } from "lucide-react";
import type { Studio } from "@/lib/studios";

type StudioCardProps = {
  studio: Studio;
};

export default function StudioCard({ studio }: StudioCardProps) {
  return (
    <article className="group min-w-0 overflow-hidden border border-[#233b35]/10 bg-white/70 transition duration-300 hover:-translate-y-1 hover:border-[#a45d42]/40 dark:border-white/10 dark:bg-white/[0.03]">
      <Link
        href={`/studios/${studio.id}`}
        aria-label={`View ${studio.title}`}
        className="block"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-[#e5e0d7] dark:bg-white/10">
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

          {studio.featured && (
            <span className="absolute left-4 top-4 bg-[#f5f1ea] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#233b35]">
              Featured
            </span>
          )}

          <span className="absolute bottom-4 left-4 bg-[#233b35] px-3 py-1.5 text-xs font-medium text-white">
            {studio.category}
          </span>
        </div>
      </Link>

      <div className="p-5 sm:p-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="flex min-w-0 items-center gap-1.5 text-xs text-[#66736d] dark:text-[#b3beb8]">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#a45d42]" />
            <span className="truncate">{studio.location}</span>
          </span>

          <span className="flex shrink-0 items-center gap-1 text-xs text-[#66736d] dark:text-[#b3beb8]">
            <Star className="h-3.5 w-3.5 fill-[#a45d42] text-[#a45d42]" />
            {studio.rating > 0 ? studio.rating.toFixed(1) : "New"}
            {studio.reviewCount > 0 && ` (${studio.reviewCount})`}
          </span>
        </div>

        <Link href={`/studios/${studio.id}`} className="group/title">
          <h3 className="line-clamp-1 font-serif text-xl text-[#233b35] transition group-hover/title:text-[#a45d42] dark:text-[#f5f1ea] sm:text-2xl">
            {studio.title}
          </h3>
        </Link>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#233b35]/10 pt-4 dark:border-white/10">
          <div className="flex items-center gap-1.5 text-xs text-[#66736d] dark:text-[#b3beb8]">
            <Users className="h-3.5 w-3.5" />
            Up to {studio.capacity} people
          </div>

          <p className="shrink-0 text-sm font-semibold text-[#233b35] dark:text-[#f5f1ea]">
            ৳{studio.hourlyRate.toLocaleString("en-BD")}
            <span className="ml-1 text-xs font-normal text-[#66736d] dark:text-[#b3beb8]">
              / hr
            </span>
          </p>
        </div>

        <Link
          href={`/studios/${studio.id}`}
          className="mt-5 flex items-center justify-between border-t border-[#233b35]/10 pt-4 text-sm font-semibold text-[#a45d42] dark:border-white/10"
        >
          View studio details
          <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
        </Link>
      </div>
    </article>
  );
}