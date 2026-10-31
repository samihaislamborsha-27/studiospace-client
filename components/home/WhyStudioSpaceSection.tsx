import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Compass,
  Wallet,
  CalendarCheck,
  Layers3,
} from "lucide-react";

const benefits = [
  {
    number: "01",
    title: "Spaces worth discovering",
    description:
      "Explore thoughtfully presented creative spaces, each with its own character, atmosphere, and possibilities.",
    icon: Compass,
  },
  {
    number: "02",
    title: "Know what you're paying",
    description:
      "See hourly rates, security deposits, and important studio details before making your booking decision.",
    icon: Wallet,
  },
  {
    number: "03",
    title: "A simpler way to book",
    description:
      "Find a suitable space, submit your booking request, and keep track of your booking in one place.",
    icon: CalendarCheck,
  },
  {
    number: "04",
    title: "Room for every kind of idea",
    description:
      "From photography and filmmaking to music and podcasting, discover spaces for different creative pursuits.",
    icon: Layers3,
  },
];

export default function WhyStudioSpaceSection() {
  return (
    <section className="overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div className="flex flex-col justify-between">
            <div>
              <div className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                <span className="h-px w-7 bg-accent" />
                A better way to create
              </div>

              <h2 className="max-w-xl text-4xl font-semibold leading-[1.12] tracking-tighter text-foreground sm:text-5xl lg:text-6xl">
                Creativity needs
                <span className="block font-normal italic text-accent">
                  the right space.
                </span>
              </h2>

              <p className="mt-7 max-w-md text-base leading-8 text-muted">
                Finding a place to bring your ideas to life shouldn't be
                complicated. StudioSpace brings creative spaces and the
                people who need them closer together.
              </p>
            </div>

            <div className="relative mt-12 overflow-hidden rounded-2xl bg-[#233b35] p-7 text-[#f5f1ea] sm:p-9 lg:mt-16">
              <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full border border-white/10" />
              <div className="absolute -right-5 -top-9 h-32 w-32 rounded-full border border-white/10" />

              <p className="relative text-xs font-semibold uppercase tracking-[0.17em] text-white/55">
                The StudioSpace idea
              </p>

              <p className="relative mt-5 max-w-sm text-2xl font-medium leading-relaxed tracking-tight sm:text-3xl">
                Less time searching.
                <span className="block font-normal italic text-[#d5a68b]">
                  More time creating.
                </span>
              </p>

              <Link
                href="/studios"
                className="relative mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-[#d5a68b]"
              >
                Find your space
                <ArrowUpRight size={17} />
              </Link>
            </div>
          </div>

          <div className="border-t border-border">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <article
                  key={benefit.number}
                  className="group grid gap-4 border-b border-border py-7 sm:grid-cols-[52px_1fr_auto] sm:items-start sm:gap-6 sm:py-9"
                >
                  <span className="pt-1 text-xs font-semibold tracking-wider text-accent">
                    {benefit.number}
                  </span>

                  <div>
                    <h3 className="text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-accent sm:text-xl">
                      {benefit.title}
                    </h3>

                    <p className="mt-3 max-w-lg text-sm leading-7 text-muted">
                      {benefit.description}
                    </p>

                    <div className="mt-4 flex items-center gap-2 text-xs font-medium text-muted">
                      <Check size={14} className="text-accent" />
                      Designed around creative needs
                    </div>
                  </div>

                  <div className="hidden h-11 w-11 items-center justify-center rounded-full border border-border text-primary transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-background sm:flex">
                    <Icon size={19} strokeWidth={1.6} />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
