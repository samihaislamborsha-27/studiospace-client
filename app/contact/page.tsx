import Link from "next/link";
import { ArrowUpRight, Mail, MessageCircle } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-[65vh] bg-[#f5f1ea] text-[#282725] dark:bg-[#171a18] dark:text-[#f3f0e9]">
      <section className="mx-auto max-w-5xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="max-w-2xl">
          <div className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#a45d42] dark:text-[#d59a7e]">
            <span className="h-px w-8 bg-current" />
            Contact StudioSpace
          </div>

          <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Let us hear from you.
          </h1>

          <p className="mt-6 text-base leading-8 text-[#77736d] dark:text-[#b8c0b9]">
            Have a question about finding a studio, listing your space, or
            using StudioSpace? Get in touch by email and tell us how we can
            help.
          </p>
        </div>

        <div className="mt-12 border-y border-[#e0d9ce] py-8 dark:border-[#39413b] sm:py-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e9e3d9] text-[#233b35] dark:bg-[#303a34] dark:text-[#c0d4c8]">
                <Mail size={21} />
              </span>
              <div>
                <h2 className="text-lg font-semibold">Email us</h2>
                <p className="mt-1 text-sm leading-6 text-[#77736d] dark:text-[#b8c0b9]">
                  For general questions and support.
                </p>
                <a
                  href="mailto:hello@studiospace.com"
                  className="mt-2 inline-block break-all text-sm font-semibold text-[#8f4933] hover:underline dark:text-[#d59a7e]"
                >
                  hello@studiospace.com
                </a>
              </div>
            </div>

            <a
              href="mailto:hello@studiospace.com?subject=StudioSpace%20enquiry"
              className="inline-flex min-h-12 w-fit items-center gap-3 rounded-lg bg-[#233b35] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#304d43] dark:bg-[#a9c2b3] dark:text-[#202622] dark:hover:bg-[#c0d4c8]"
            >
              Send an email
              <ArrowUpRight size={17} />
            </a>
          </div>
        </div>

        <div className="mt-8 flex items-start gap-3 text-sm leading-7 text-[#77736d] dark:text-[#b8c0b9]">
          <MessageCircle size={18} className="mt-1 shrink-0" />
          <p>
            Looking for a creative space? You can also{" "}
            <Link
              href="/studios"
              className="font-semibold text-[#8f4933] hover:underline dark:text-[#d59a7e]"
            >
              explore available studios
            </Link>{" "}
            directly.
          </p>
        </div>
      </section>
    </main>
  );
}
