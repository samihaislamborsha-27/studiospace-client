import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  MapPin,
  Star,
  Clock3,
} from "lucide-react";

const featuredStudios = [
  {
    id: "studio-01",
    name: "The Natural Light Studio",
    category: "Photography",
    location: "Dhaka, Bangladesh",
    price: "৳1,500",
    unit: "/ hour",
    rating: "4.9",
    reviews: 28,
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Warm and naturally lit photography studio",
    tag: "Popular choice",
  },
  {
    id: "studio-02",
    name: "Frame House Studio",
    category: "Film & Video",
    location: "Dhaka, Bangladesh",
    price: "৳2,000",
    unit: "/ hour",
    rating: "4.8",
    reviews: 19,
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Modern creative production workspace",
    tag: "Creative space",
  },
  {
    id: "studio-03",
    name: "The Sound Room",
    category: "Music & Podcast",
    location: "Dhaka, Bangladesh",
    price: "৳1,200",
    unit: "/ hour",
    rating: "4.9",
    reviews: 34,
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Professional recording studio with audio equipment",
    tag: "Highly rated",
  },
];

export default function FeaturedStudiosSection() {
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-360 px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        {/* Heading */}
        <div className="flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              <span className="h-px w-7 bg-accent" />
              Spaces worth discovering
            </div>

            <h2 className="max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.045em] text-foreground sm:text-4xl lg:text-5xl">
              A few places to
              <span className="font-normal italic text-accent">
                {" "}get inspired.
              </span>
            </h2>

            <p className="mt-4 max-w-lg text-sm leading-7 text-muted sm:text-base">
              Explore creative spaces selected to help turn your next
              project into something remarkable.
            </p>
          </div>

          <Link
            href="/studios"
            className="group inline-flex w-fit shrink-0 items-center gap-2 border-b border-foreground/30 pb-2 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            Explore all studios
            <ArrowUpRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>

        {/* Studio cards */}
        <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {featuredStudios.map((studio) => (
            <article
              key={studio.id}
              className="group min-w-0"
            >
              <Link
                href={`/studios/${studio.id}`}
                aria-label={`View ${studio.name}`}
                className="relative block aspect-4/3 overflow-hidden rounded-xl bg-surface-muted"
              >
                <div
                  role="img"
                  aria-label={studio.imageAlt}
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{
                    backgroundImage: `url("${studio.image}")`,
                  }}
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-black/5" />

                <span className="absolute left-4 top-4 rounded-full border border-white/30 bg-black/20 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
                  {studio.tag}
                </span>

                <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#233b35] transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight size={19} />
                </span>
              </Link>

              <div className="pt-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
                    {studio.category}
                  </span>

                  <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-foreground">
                    <Star size={14} fill="currentColor" className="text-[#b9874c]" />
                    {studio.rating}
                    <span className="font-normal text-muted">
                      ({studio.reviews})
                    </span>
                  </span>
                </div>

                <Link
                  href={`/studios/${studio.id}`}
                  className="mt-2 block w-fit"
                >
                  <h3 className="text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-accent">
                    {studio.name}
                  </h3>
                </Link>

                <div className="mt-3 flex items-center gap-1.5 text-sm text-muted">
                  <MapPin size={15} className="shrink-0" />
                  {studio.location}
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                  <div>
                    <span className="text-lg font-semibold tracking-tight text-foreground">
                      {studio.price}
                    </span>
                    <span className="ml-1 text-xs text-muted">
                      {studio.unit}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted">
                    <Clock3 size={14} />
                    Hourly booking
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom link */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/studios"
            className="group inline-flex items-center gap-3 rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition-all hover:border-primary hover:bg-primary hover:text-background"
          >
            Discover more spaces
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}