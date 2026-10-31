import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";

const benefits = [
  "Present your studio to a creative audience",
  "Share your rates, amenities, and availability",
  "Manage booking requests in one place",
];

export default function StudioOwnerSection() {
  return (
    <section className="bg-[#eee9e0] py-20 dark:bg-[#202622] sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid overflow-hidden rounded-2xl bg-[#233b35] lg:grid-cols-[1.05fr_0.95fr]">
          <div
            role="img"
            aria-label="Creative photography studio with professional lighting equipment"
            className="relative min-h-80 bg-cover bg-center sm:min-h-105 lg:min-h-142.5"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=85')",
            }}
          >
            <div className="absolute inset-0 bg-linear-to-t from-[#14231f]/60 via-transparent to-transparent" />
            <div className="absolute bottom-7 left-7 right-7 sm:bottom-9 sm:left-9">
              <span className="inline-block border border-white/40 px-4 py-2 text-xs font-medium tracking-[0.12em] text-white">
                FOR CREATIVE SPACE OWNERS
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-center px-7 py-12 text-[#f5f1ea] sm:px-10 sm:py-16 lg:px-14 xl:px-16">
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#d5a68b]">
              Your space. Your story.
            </p>

            <h2 className="max-w-lg text-4xl font-semibold leading-[1.12] tracking-tight sm:text-5xl xl:text-[58px]">
              Have a space
              <span className="block font-normal italic text-[#d5a68b]">
                worth sharing?
              </span>
            </h2>

            <p className="mt-7 max-w-md text-sm leading-8 text-white/70 sm:text-base">
              Every creative space has something unique to offer. Bring
              yours to StudioSpace and help creators find the right
              environment for their next idea.
            </p>

            <div className="mt-9 space-y-4">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-3">
                  <Check
                    size={17}
                    className="mt-1 shrink-0 text-[#d5a68b]"
                  />
                  <span className="text-sm leading-6 text-white/85">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <Link
                href="/register"
                className="group inline-flex items-center gap-4 bg-[#f5f1ea] px-6 py-4 text-sm font-semibold text-[#233b35] transition-colors hover:bg-[#d5a68b]"
              >
                List your studio
                <ArrowUpRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </Link>
            </div>

            <p className="mt-5 text-xs text-white/45">
              Give your creative space the visibility it deserves.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
