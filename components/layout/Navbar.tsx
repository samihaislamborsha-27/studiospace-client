"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  X,
  Sun,
  Moon,
  UserRound,
  ArrowUpRight,
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/#how-it-works" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
      <nav className="mx-auto flex h-19 max-w-360 items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5"
          aria-label="StudioSpace home"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-lg font-bold text-background">
            S.
          </span>

          <span className="flex flex-col">
            <span className="text-[19px] font-semibold tracking-tight text-foreground">
              StudioSpace
            </span>
            <span className="text-[9px] font-medium uppercase tracking-[0.22em] text-muted">
              Create somewhere
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-9 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] font-medium text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
          >
            {theme === "dark" ? (
              <Sun size={18} />
            ) : (
              <Moon size={18} />
            )}
          </button>

          <Link
            href="/login"
            className="flex items-center gap-2 px-3 py-2 text-[13px] font-semibold text-foreground transition-colors hover:text-accent"
          >
            <UserRound size={16} />
            Log in
          </Link>

          <Link
            href="/register"
            className="flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-[13px] font-semibold text-background transition-colors hover:bg-primary-hover"
          >
            List your space
            <ArrowUpRight size={15} />
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-10 w-10 items-center justify-center rounded-full text-muted hover:bg-surface-muted"
          >
            {theme === "dark" ? (
              <Sun size={18} />
            ) : (
              <Moon size={18} />
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-full text-foreground hover:bg-surface-muted"
          >
            {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="border-t border-border bg-background px-5 pb-6 pt-4 lg:hidden">
          <div className="mx-auto flex max-w-360 flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="border-b border-border py-4 text-sm font-medium text-foreground"
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-5 grid grid-cols-2 gap-3">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-full border border-border py-3 text-sm font-semibold text-foreground"
              >
                <UserRound size={16} />
                Log in
              </Link>

              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold text-background"
              >
                List your space
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}