import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Search,
  MapPin,
  Camera,
} from "lucide-react";

const categories = [
  "All spaces",
  "Photography",
  "Podcast",
  "Music",
  "Film & Video",
  "Art & Creative",
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="mx-auto max-w-360 px-5 pb-16 pt-14 sm:px-8 sm:pb-20 sm:pt-20 lg:px-12 lg:pb-24 lg:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
          {/* Left content */}
          <div className="relative z-10">
            <div className="mb-7 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              <span className="h-px w-7 bg-accent" />
              A space for every creative
            </div>

            <h1 className="max-w-2xl text-[clamp(2.8rem,6vw,5.6rem)] font-semibold leading-[1.04] tracking-[-0.055em] text-foreground">
              Find your space.
              <span className="mt-1 block font-normal italic text-accent">
                Make something
              </span>
              <span className="block">remarkable.</span>
            </h1>

            <p className="mt-7 max-w-lg text-base leading-8 text-muted sm:text-lg">
              Discover inspiring studios and creative spaces built for your
              next big idea. Find the right setting, meet your creative
              match, and get to work.
            </p>

            {/* Search form */}
            <form
              action="/studios"
              method="GET"
              className="mt-10 max-w-2xl rounded-2xl border border-border bg-surface p-3 shadow-[0_12px_40px_rgba(40,39,37,0.06)]"
            >
              <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
                <div className="min-w-0 px-2">
                  <label
                    htmlFor="studio-category"
                    className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.15em] text-muted"
                  >
                    What are you creating?
                  </label>

                  <div className="flex items-center gap-2">
                    <Camera size={17} className="shrink-0 text-accent" />

                    <select
                      id="studio-category"
                      name="category"
                      defaultValue=""
                      className="w-full min-w-0 bg-transparent py-1 text-sm font-medium text-foreground outline-none"
                    >
                      <option value="">All creative spaces</option>
                      {categories.slice(1).map((category) => (
                        <option key={category} value={category.toLowerCase()}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="min-w-0 border-border px-2 sm:border-l">
                  <label
                    htmlFor="studio-location"
                    className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.15em] text-muted"
                  >
                    Where?
                  </label>

                  <div className="flex items-center gap-2">
                    <MapPin size={17} className="shrink-0 text-accent" />

                    <input
                      id="studio-location"
                      type="text"
                      name="location"
                      placeholder="City or location"
                      className="w-full min-w-0 bg-transparent py-1 text-sm text-foreground outline-none placeholder:text-muted/70"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-background transition-colors hover:bg-primary-hover sm:min-w-32"
                >
                  <Search size={17} />
                  <span>Find a space</span>
                </button>
              </div>
            </form>

            {/* Supporting links */}
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/studios"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-accent"
              >
                Explore all studios
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
              >
                Have a space to share?
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>

          {/* Right visual */}
          <div className="relative">
            <div className="relative min-h-95 overflow-hidden rounded-3xl bg-surface-muted sm:min-h-125 lg:min-h-147.5">
              <div
                role="img"
                aria-label="Sunlit creative photography studio with professional equipment"
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85')",
                }}
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-black/5" />

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-9">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <span className="mb-3 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#d7b18c]" />
                      Room to create
                    </span>

                    <h2 className="max-w-sm text-2xl font-medium leading-tight tracking-tight sm:text-3xl">
                      The right space changes everything.
                    </h2>
                  </div>

                  <Link
                    href="/studios"
                    aria-label="Explore creative studios"
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/50 bg-white/10 backdrop-blur-sm transition-colors hover:bg-white hover:text-foreground"
                  >
                    <ArrowUpRight size={21} />
                  </Link>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 left-5 right-5 z-0 h-20 rounded-2xl bg-accent/10 blur-2xl sm:left-10 sm:right-10" />
          </div>
        </div>

        {/* Bottom note */}
        <div className="mt-16 flex flex-col gap-4 border-t border-border pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
            Made for the people who make things.
          </p>

          <p className="text-sm text-muted">
            Photography · Film · Music · Podcasts · Art
          </p>
        </div>
      </div>
    </section>
  );
}