"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  Menu,
  X,
  Sun,
  Moon,
  ArrowUpRight,
  LogOut,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/context/AuthProvider";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/#how-it-works" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, loading, logout } = useAuth();

  async function handleLogout() {
    try {
      await logout();
      setMobileMenuOpen(false);
      toast.success("You have been logged out.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to log out."
      );
    }
  }

  const accountLinks = (
    <>
      {!loading && user ? (
        <>
          <Link
            href="/profile"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-foreground hover:bg-surface-muted"
          >
            {user.photoURL ? (
              <Image
                src={user.photoURL}
                alt={`${user.name}'s profile`}
                width={36}
                height={36}
                unoptimized
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-muted">
                <UserRound size={18} />
              </span>
            )}
            <span>{user.name}</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-surface-muted"
          >
            <LogOut size={16} />
            Log out
          </button>
        </>
      ) : !loading ? (
        <>
          <Link
            href="/login"
            className="px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:text-accent"
          >
            Log in
          </Link>

          <Link
            href="/register"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#8F4933] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#713824]"
          >
            List your space
            <ArrowUpRight size={16} />
          </Link>
        </>
      ) : null}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md">
      <nav className="mx-auto flex h-19 max-w-360 items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link
          href="/"
          aria-label="StudioSpace home"
          onClick={() => setMobileMenuOpen(false)}
          className="flex shrink-0 items-center gap-2.5"
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
              className="text-sm font-medium text-muted transition-colors hover:text-accent"
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
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {accountLinks}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-10 w-10 items-center justify-center rounded-full text-muted hover:bg-surface-muted"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground hover:bg-surface-muted"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="border-t border-border bg-background px-5 py-5 shadow-lg lg:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
            {accountLinks}
          </div>
        </div>
      )}
    </header>
  );
}