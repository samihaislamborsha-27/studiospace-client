import Link from "next/link";
import { ArrowUpRight, MapPin, Star, Users } from "lucide-react";
import type { Studio } from "@/lib/studios";

export default function StudioCard({ studio }: { studio: Studio }) {
  return (
    <article className="group min-w-0">
      <Link
        href={`/studios/${studio.id}`}
        className="block"
        aria-label={`View ${studio.title}`}
      >
        <div className="relative aspect-4/3 overflow-hidden bg-[#e7e0d6]">
          <div
            role="img"
            aria-label={studio.title}
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.045]"
            style={{ backgroundImage: `url("${studio.image}")` }}
          />

          <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />

          {studio.featured && (
            <span className="absolute left-4 top-4 bg-[#f5f1ea] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#233b35]">
              Featured space
            </span>
          )}

          <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f1ea] text-[#233b35] transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-[#d5a68b]">
            <ArrowUpRight size={19} />
          </span>
        </div>

        <div className="pt-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#a45d42]">
              {studio.category}
            </span>
            <span className="flex items-center gap-1 text-sm text-[#282725] dark:text-[#f3f0e9]">
              <Star size={14} fill="#c28a43" stroke="#c28a43" />
              <span className="font-semibold">{studio.rating.toFixed(1)}</span>
              <span className="text-[#77736d]">({studio.reviewCount})</span>
            </span>
          </div>

          <h3 className="mt-2 text-xl font-semibold tracking-tight text-[#282725] transition-colors group-hover:text-[#a45d42] dark:text-[#f3f0e9] sm:text-[22px]">
            {studio.title}
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#77736d] dark:text-[#aaa99f]">
            <span className="flex items-center gap-1.5">
              <MapPin size={14} />
              {studio.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Users size={14} />
              Up to {studio.capacity} people
            </span>
          </div>

          <div className="mt-5 flex items-end justify-between border-t border-[#e7e0d6] pt-4 dark:border-[#39413b]">
            <div>
              <span className="text-xl font-semibold text-[#233b35] dark:text-[#c0d4c8]">
                ৳{studio.hourlyRate.toLocaleString("en-BD")}
              </span>
              <span className="ml-1 text-xs text-[#77736d] dark:text-[#aaa99f]">
                / hour
              </span>
            </div>
            <span className="text-xs font-medium text-[#77736d] dark:text-[#aaa99f]">
              View details
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
