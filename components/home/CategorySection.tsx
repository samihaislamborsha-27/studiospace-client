import Link from "next/link";
import {
  ArrowUpRight,
  Camera,
  Clapperboard,
  Mic2,
  Music2,
  Palette,
  ArrowRight,
} from "lucide-react";

const categories = [
  {
    number: "01",
    title: "Photography",
    description: "Studios for portraits, products, and visual stories.",
    icon: Camera,
  },
  {
    number: "02",
    title: "Film & Video",
    description: "Production spaces for your next visual project.",
    icon: Clapperboard,
  },
  {
    number: "03",
    title: "Podcast",
    description: "Purpose-built spaces for conversations and audio.",
    icon: Mic2,
  },
  {
    number: "04",
    title: "Music",
    description: "Rehearsal and recording spaces for every sound.",
    icon: Music2,
  },
  {
    number: "05",
    title: "Art & Creative",
    description: "Room to experiment, make, and bring ideas to life.",
    icon: Palette,
  },
];

export default function CategorySection() {
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-360 px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              <span className="h-px w-7 bg-accent" />
              Find your kind of space
            </div>

            <h2 className="max-w-xl text-3xl font-semibold leading-tight tracking-[-0.04em] text-foreground sm:text-4xl lg:text-5xl">
              Made for the way
              <span className="font-normal italic text-accent">
                {" "}you create.
              </span>
            </h2>

            <p className="mt-4 max-w-lg text-sm leading-7 text-muted sm:text-base">
              Every creative project needs the right environment.
              Explore spaces designed around what you do best.
            </p>
          </div>

          <Link
            href="/studios"
            className="group inline-flex w-fit shrink-0 items-center gap-2 border-b border-foreground/30 pb-2 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            Explore all spaces
            <ArrowUpRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>

        <div className="grid border-l border-t border-border sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.title}
                href={`/studios?category=${encodeURIComponent(category.title)}`}
                className="group relative flex min-h-60 flex-col justify-between border-b border-r border-border p-6 transition-colors duration-300 hover:bg-background sm:min-h-64 sm:p-7"
              >
                <div className="flex items-start justify-between">
                  <span className="text-xs font-medium tracking-wider text-muted">
                    {category.number}
                  </span>

                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-primary transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-background">
                    <Icon size={19} strokeWidth={1.6} />
                  </span>
                </div>

                <div className="mt-12">
                  <h3 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                    {category.title}
                  </h3>

                  <p className="mt-2 min-h-12 text-sm leading-6 text-muted">
                    {category.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground transition-colors group-hover:text-accent">
                      Discover spaces
                    </span>

                    <ArrowRight
                      size={16}
                      className="text-muted transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent"
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}