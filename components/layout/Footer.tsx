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
  { label: "How it works", href: "/#how-it-works" },
  { label: "List your space", href: "/register" },
  { label: "Contact us", href: "/contact" },
];

const socialLinks = [
  { label: "Instagram", icon: Camera },
  { label: "Facebook", icon: Globe },
  { label: "LinkedIn", icon: AtSign },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-360 px-5 pb-8 pt-16 sm:px-8 lg:px-12 lg:pt-20">
        <div className="grid gap-12 border-b border-border pb-14 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] lg:gap-10">
          {/* Brand */}
          <div className="max-w-sm">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-lg font-bold text-background">
                S.
              </span>

              <span className="text-xl font-semibold tracking-tight text-foreground">
                StudioSpace
              </span>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-7 text-muted">
              A place for every creative idea. Discover inspiring spaces,
              connect with creators, and bring your next project to life.
            </p>

            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map(({ label, icon: Icon }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-primary hover:bg-primary hover:text-background"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Explore
            </h3>

            <ul className="mt-5 space-y-4">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Company
            </h3>

            <ul className="mt-5 space-y-4">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Get in touch
            </h3>

            <p className="mt-5 text-sm leading-7 text-muted">
              Have a question or a space to share? We'd love to hear from you.
            </p>

            <a
              href="mailto:hello@studiospace.com"
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-accent"
            >
              <Mail size={16} />
              hello@studiospace.com
              <ArrowUpRight size={14} />
            </a>

            <div className="mt-4 flex items-center gap-2 text-sm text-muted">
              <MapPin size={16} />
              <span>Made for creators, everywhere.</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 pt-7 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 StudioSpace. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link
              href="/privacy"
              className="transition-colors hover:text-foreground"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="transition-colors hover:text-foreground"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}