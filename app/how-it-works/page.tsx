import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Search,
  SlidersHorizontal,
  CalendarCheck,
  CheckCircle2,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Discover a space",
    description:
      "Explore photography, music, podcast, film, and other creative studios. Use categories to narrow your search and find spaces that suit your project.",
    icon: Search,
    detail: "Browse studios by category",
  },
  {
    number: "02",
    title: "Compare your options",
    description:
      "Review studio photos, facilities, hourly rates, location, and other important details before deciding where to bring your idea to life.",
    icon: SlidersHorizontal,
    detail: "Choose the right environment",
  },
  {
    number: "03",
    title: "Send a booking request",
    description:
      "Choose your preferred date and time, provide the necessary details, and submit your booking request to the studio owner.",
    icon: CalendarCheck,
    detail: "Request your preferred schedule",
  },
  {
    number: "04",
    title: "Get ready to create",
    description:
      "Keep track of your booking from your account and follow its status as the studio owner reviews your request.",
    icon: CheckCircle2,
    detail: "Stay updated in one place",
  },
];

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-[#f5f1ea] text-[#282725] dark:bg-[#171a18] dark:text-[#f3f0e9]">
      {/* Intro */}
      <section className="border-b border-[#e7e0d6] dark:border-[#39413b]">
        <div className="mx-auto max-w-7xl px-5 pb-16 pt-16 sm:px-8 sm:pb-20 sm:pt-20 lg:px-12 lg:pb-24 lg:pt-24">
          <div className="max-w-3xl">
            <div className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#a45d42] dark:text-[#d59a7e]">
              <span className="h-px w-8 bg-current" />
              A simple way to get started
            </div>

            <h1 className="text-4xl font-semibold leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl">
              From finding a space
              <span className="block font-normal italic text-[#a45d42] dark:text-[#d59a7e]">
                to creating something meaningful.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-[#77736d] dark:text-[#b8c0b9] sm:text-lg">
              StudioSpace makes it easier to discover creative environments
              and connect with the people who make those spaces available.
              Here is how the process works.
            </p>

            <Link
              href="/studios"
              className="mt-9 inline-flex min-h-12 items-center gap-3 rounded-lg bg-[#233b35] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#304d43] dark:bg-[#a9c2b3] dark:text-[#202622] dark:hover:bg-[#c0d4c8]"
            >
              Explore studios
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mb-12 flex flex-col gap-4 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.17em] text-[#a45d42] dark:text-[#d59a7e]">
              The process
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Four steps. More room to create.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-[#77736d] dark:text-[#b8c0b9]">
            Whether you are planning a shoot, recording a podcast, or working
            on a new project, getting started is straightforward.
          </p>
        </div>

        <div className="grid gap-0 md:grid-cols-2">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <article
                key={step.number}
                className={`flex gap-5 border-t border-[#e0d9ce] py-8 dark:border-[#39413b] sm:gap-7 sm:py-10 ${
                  index % 2 === 0
                    ? "md:pr-10"
                    : "md:border-l md:pl-10 md:pr-2"
                }`}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e9e3d9] text-[#233b35] dark:bg-[#303a34] dark:text-[#c0d4c8]">
                  <Icon size={21} strokeWidth={1.7} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold tracking-[0.16em] text-[#a45d42] dark:text-[#d59a7e]">
                    STEP {step.number}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-lg text-sm leading-7 text-[#77736d] dark:text-[#b8c0b9]">
                    {step.description}
                  </p>
                  <div className="mt-5 inline-flex items-center gap-2 text-xs font-medium text-[#233b35] dark:text-[#c0d4c8]">
                    <CheckCircle2 size={15} />
                    {step.detail}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Owner section */}
      <section className="bg-[#eee9e0] dark:bg-[#202622]">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 px-5 py-14 sm:px-8 sm:py-16 lg:flex-row lg:items-center lg:justify-between lg:px-12">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.17em] text-[#a45d42] dark:text-[#d59a7e]">
              Have a creative space?
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Let more creators discover it.
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#77736d] dark:text-[#b8c0b9]">
              Share your studio, present its features, and manage booking
              requests through StudioSpace.
            </p>
          </div>

          <Link
            href="/add-studio"
            className="inline-flex min-h-12 w-fit shrink-0 items-center gap-3 rounded-lg bg-[#8f4933] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#713824]"
          >
            List your space
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}
