import Link from "next/link";
import {
  ArrowUpRight,
  Mail,
  MapPin,
  Camera,
  Globe,
  AtSign,
} from "lucide-react";

const exploreLinks = [
  { label: "Explore all studios", href: "/studios" },
  { label: "Photography studios", href: "/studios?category=photography" },
  { label: "Podcast studios", href: "/studios?category=podcast" },
  { label: "Music studios", href: "/studios?category=music" },
];

const companyLinks = [
  { label: "About StudioSpace", href: "/about" },
  { label: "How it works", href: "/how-it-works" },
  { label: "List your space", href: "/add-studio" },
  { label: "Contact us", href: "/contact" },
];

const socialLinks = [
  { label: "Instagram", icon: Camera },
  { label: "Facebook", icon: Globe },
  { label: "LinkedIn", icon: AtSign },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#e7e0d6] bg-[#fff] text-[#282725] dark:border-[#39413b] dark:bg-[#202622] dark:text-[#f3f0e9]">
      <div className="mx-auto max-w-360 px-5 pb-8 pt-14 sm:px-8 sm:pt-16 lg:px-12 lg:pt-20">
        <div className="grid gap-11 border-b border-[#e7e0d6] pb-12 dark:border-[#39413b] md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] lg:gap-10 lg:pb-14">
          {/* Brand */}
          <div className="max-w-sm">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#233b35] text-lg font-bold text-[#f5f1ea] dark:bg-[#a9c2b3] dark:text-[#202622]">
                S.
              </span>

              <span className="text-xl font-semibold tracking-tight text-[#282725] dark:text-[#f3f0e9]">
                StudioSpace
              </span>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-7 text-[#77736d] dark:text-[#b8c0b9]">
              A place for every creative idea. Discover inspiring spaces,
              connect with creators, and bring your next project to life.
            </p>

            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map(({ label, icon: Icon }) => (
                <span
                  key={label}
                  title={label}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e7e0d6] text-[#77736d] dark:border-[#465149] dark:text-[#b8c0b9]"
                >
                  <Icon size={17} />
                </span>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-semibold text-[#282725] dark:text-[#f3f0e9]">
              Explore
            </h3>

            <ul className="mt-5 space-y-4">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#77736d] transition-colors hover:text-[#8f4933] dark:text-[#b8c0b9] dark:hover:text-[#e0ad91]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-[#282725] dark:text-[#f3f0e9]">
              Company
            </h3>

            <ul className="mt-5 space-y-4">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#77736d] transition-colors hover:text-[#8f4933] dark:text-[#b8c0b9] dark:hover:text-[#e0ad91]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-[#282725] dark:text-[#f3f0e9]">
              Get in touch
            </h3>

            <p className="mt-5 text-sm leading-7 text-[#77736d] dark:text-[#b8c0b9]">
              Have a question or a space to share? We would love to hear from
              you.
            </p>

            <a
              href="mailto:hello@studiospace.com"
              className="mt-5 inline-flex max-w-full items-center gap-2 rounded-lg border border-[#e7e0d6] bg-[#f4f0e9] px-3.5 py-3 text-sm font-semibold text-[#282725] transition-colors hover:border-[#a45d42] hover:text-[#8f4933] dark:border-[#465149] dark:bg-[#303a34] dark:text-[#f3f0e9] dark:hover:border-[#d59a7e] dark:hover:text-[#e0ad91]"
            >
              <Mail size={16} className="shrink-0" />
              <span className="break-all">hello@studiospace.com</span>
              <ArrowUpRight size={14} className="shrink-0" />
            </a>

            <div className="mt-4 flex items-center gap-2 text-sm text-[#77736d] dark:text-[#b8c0b9]">
              <MapPin size={16} className="shrink-0" />
              <span>Made for creators, everywhere.</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-3 pt-7 text-xs text-[#77736d] dark:text-[#b8c0b9] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 StudioSpace. All rights reserved.</p>
          <p>Made for ideas, spaces, and the people behind them.</p>
        </div>
      </div>
    </footer>
  );
}
