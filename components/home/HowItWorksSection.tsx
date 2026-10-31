import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Search,
  CalendarCheck,
  Sparkles,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Discover your space",
    description:
      "Explore creative studios by category and location. Find places that match your vision, style, and project needs.",
    icon: Search,
    image:
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Professional photography camera and creative equipment",
    label: "Explore possibilities",
  },
  {
    number: "02",
    title: "Find your perfect fit",
    description:
      "Compare studio details, amenities, pricing, and availability before choosing the space that feels right.",
    icon: Sparkles,
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Bright and thoughtfully designed creative workspace",
    label: "Choose your environment",
  },
  {
    number: "03",
    title: "Book and create",
    description:
      "Send your booking request, confirm your plans, and get ready to bring your next creative idea to life.",
    icon: CalendarCheck,
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Professional music recording studio",
    label: "Bring ideas to life",
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-background"
    >
      <div className="mx-auto max-w-360 px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        {/* Section heading */}
        <div className="grid gap-7 lg:grid-cols-[1fr_0.65fr] lg:items-end">
          <div>
            <div className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              <span className="h-px w-7 bg-accent" />
              Simple by design
            </div>

            <h2 className="max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.045em] text-foreground sm:text-4xl lg:text-5xl">
              From looking around
              <span className="font-normal italic text-accent">
                {" "}to making it happen.
              </span>
            </h2>
          </div>

          <p className="max-w-md text-sm leading-7 text-muted sm:text-base lg:justify-self-end">
            Your next creative project deserves the right setting.
            We make finding and booking a space feel straightforward,
            so you can focus on the work that matters.
          </p>
        </div>

        {/* Three visual steps */}
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <article
                key={step.number}
                className="group min-w-0"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden rounded-xl bg-surface-muted sm:h-60 lg:h-64">
                  <div
                    role="img"
                    aria-label={step.imageAlt}
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{
                      backgroundImage: `url("${step.image}")`,
                    }}
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-black/10" />

                  <span className="absolute left-4 top-4 rounded-full border border-white/30 bg-black/20 px-3 py-1.5 text-xs font-semibold tracking-wider text-white backdrop-blur-sm">
                    STEP {step.number}
                  </span>

                  <span className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#233b35] shadow-sm">
                    <Icon size={19} strokeWidth={1.7} />
                  </span>
                </div>

                {/* Text */}
                <div className="border-b border-border pb-6 pt-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">
                    {step.label}
                  </p>

                  <h3 className="mt-3 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-muted">
                    {step.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        {/* Closing note */}
        <div className="mt-10 flex flex-col gap-5 rounded-2xl bg-[#233b35] px-6 py-7 text-[#f5f1ea] sm:flex-row sm:items-center sm:justify-between sm:px-9 sm:py-8">
          <div>
            <p className="text-lg font-medium tracking-tight sm:text-xl">
              Your next idea needs a place to begin.
            </p>
            <p className="mt-2 text-sm leading-6 text-white/65">
              Find a space that brings your creative vision closer.
            </p>
          </div>

          <Link
            href="/studios"
            className="group inline-flex w-fit shrink-0 items-center gap-3 rounded-full bg-[#f5f1ea] px-5 py-3 text-sm font-semibold text-[#233b35] transition-colors hover:bg-white"
          >
            Explore studios
            <ArrowUpRight
              size={17}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}