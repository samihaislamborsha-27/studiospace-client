import Link from "next/link";
import {
  ArrowUpRight,
  Camera,
  Music2,
  Mic2,
  Clapperboard,
  Heart,
} from "lucide-react";

const creativeFields = [
  { label: "Photography", icon: Camera },
  { label: "Music", icon: Music2 },
  { label: "Podcasting", icon: Mic2 },
  { label: "Film and video", icon: Clapperboard },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f5f1ea] text-[#282725] dark:bg-[#171a18] dark:text-[#f3f0e9]">
      {/* Hero */}
      <section className="border-b border-[#e7e0d6] dark:border-[#39413b]">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16 lg:px-12 lg:py-24">
          <div>
            <div className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#a45d42] dark:text-[#d59a7e]">
              <span className="h-px w-8 bg-current" />
              About StudioSpace
            </div>

            <h1 className="max-w-2xl text-4xl font-semibold leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl">
              Every creative idea
              <span className="block font-normal italic text-[#a45d42] dark:text-[#d59a7e]">
                deserves a place.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-[#77736d] dark:text-[#b8c0b9] sm:text-lg">
              StudioSpace brings creative people and inspiring workspaces
              closer together. We make it easier to discover studios, compare
              possibilities, and find an environment where ideas can grow.
            </p>

            <Link
              href="/studios"
              className="mt-9 inline-flex min-h-12 items-center gap-3 rounded-lg bg-[#233b35] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#304d43] dark:bg-[#a9c2b3] dark:text-[#202622] dark:hover:bg-[#c0d4c8]"
            >
              Find your space
              <ArrowUpRight size={17} />
            </Link>
          </div>

          <div className="relative min-h-72 overflow-hidden rounded-2xl bg-[#233b35] sm:min-h-96 lg:min-h-120">
            <div
              role="img"
              aria-label="A bright creative workspace with natural light"
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=85')",
              }}
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#14231f]/75 via-[#14231f]/10 to-transparent" />
            <div className="absolute bottom-7 left-7 right-7 sm:bottom-9 sm:left-9">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/75">
                A space for possibility
              </p>
              <p className="mt-2 max-w-sm text-2xl font-medium leading-snug text-white sm:text-3xl">
                Find the setting that helps your next idea take shape.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-12 lg:py-24">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.17em] text-[#a45d42] dark:text-[#d59a7e]">
            What brings us together
          </p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            Making creative spaces easier to find.
          </h2>
        </div>

        <div className="space-y-5 text-sm leading-8 text-[#77736d] dark:text-[#b8c0b9] sm:text-base">
          <p>
            Finding the right workspace can be one of the first challenges
            behind a creative project. The right equipment, atmosphere,
            location, and facilities all matter.
          </p>
          <p>
            StudioSpace provides a shared place where studio owners can
            present their spaces and creators can explore options that fit
            their needs. Our goal is to make discovery and booking easier to
            understand, from the first search to the booking request.
          </p>
          <p>
            We believe good spaces help good ideas move forward. That is the
            simple idea behind StudioSpace.
          </p>
        </div>
      </section>

      {/* Creative categories */}
      <section className="bg-[#eee9e0] dark:bg-[#202622]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.17em] text-[#a45d42] dark:text-[#d59a7e]">
              Made for different disciplines
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              One place. Many ways to create.
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#77736d] dark:text-[#b8c0b9]">
              Explore environments for the work you want to make, from
              photography sessions to music production and beyond.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
            {creativeFields.map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="flex min-h-36 flex-col justify-between border border-[#ded7cc] bg-[#f8f5ef] p-5 dark:border-[#39413b] dark:bg-[#262e29] sm:min-h-44 sm:p-6"
              >
                <Icon
                  size={24}
                  strokeWidth={1.6}
                  className="text-[#8f4933] dark:text-[#d59a7e]"
                />
                <span className="text-sm font-semibold text-[#282725] dark:text-[#f3f0e9] sm:text-base">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="flex flex-col gap-7 border-b border-[#e0d9ce] pb-12 dark:border-[#39413b] sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-[#a45d42] dark:text-[#d59a7e]">
              <Heart size={17} />
              <span className="text-xs font-semibold uppercase tracking-[0.16em]">
                Start creating
              </span>
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Your next project starts with the right space.
            </h2>
          </div>

          <Link
            href="/studios"
            className="inline-flex min-h-12 w-fit shrink-0 items-center gap-3 rounded-lg bg-[#8f4933] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#713824]"
          >
            Browse studios
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}
