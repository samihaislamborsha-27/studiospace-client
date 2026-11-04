"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Sun,
  Moon,
  ArrowUpRight,
  LogOut,
  UserRound,
  ChevronDown,
  LayoutDashboard,
  Plus,
  Building2,
  CalendarDays,
  UserCircle,
} from "lucide-react";
import { toast } from "sonner";

import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/context/AuthProvider";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About Us", href: "/#about" },
];

const accountMenuLinks = [
  {
    label: "Dashboard",
    href: "/profile",
    icon: LayoutDashboard,
  },
  {
    label: "Add New Studio",
    href: "/add-studio",
    icon: Plus,
  },
  {
    label: "My Studio Listings",
    href: "/my-listings",
    icon: Building2,
  },
  {
    label: "My Bookings",
    href: "/my-bookings",
    icon: CalendarDays,
  },
  {
    label: "My Profile",
    href: "/profile",
    icon: UserCircle,
  },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { user, loading, logout } = useAuth();

  function closeMenus() {
    setMobileMenuOpen(false);
    setAccountMenuOpen(false);
  }

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return false;

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  async function handleLogout() {
    try {
      await logout();
      closeMenus();
      toast.success("You have been logged out.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to log out."
      );
    }
  }

  const initials = user?.name
    ?.trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  const avatar = user?.photoURL ? (
    <Image
      src={user.photoURL}
      alt={`${user.name}'s profile`}
      width={38}
      height={38}
      unoptimized
      className="h-9 w-9 rounded-full border border-border object-cover"
    />
  ) : (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-muted text-sm font-semibold text-foreground">
      {initials || <UserRound size={18} />}
    </span>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md">
      <nav
        className="mx-auto flex h-19 max-w-360 items-center justify-between px-5 sm:px-8 lg:px-12"
        aria-label="Main navigation"
      >
        {/* Brand */}
        <Link
          href="/"
          aria-label="StudioSpace home"
          onClick={closeMenus}
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

        {/* Desktop navigation */}
        <div className="hidden items-center gap-7 xl:gap-9 lg:flex">
          {navLinks.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenus}
                className={`relative whitespace-nowrap py-2 text-sm font-medium transition-colors ${
                  active
                    ? "text-accent"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {link.label}

                {active && (
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-accent" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {!loading && user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setAccountMenuOpen((open) => !open)}
                aria-expanded={accountMenuOpen}
                aria-haspopup="true"
                className="flex items-center gap-2 rounded-xl border border-border bg-background px-2.5 py-2 transition-colors hover:bg-surface-muted"
              >
                {avatar}

                <span className="max-w-28 truncate text-sm font-semibold text-foreground">
                  {user.name}
                </span>

                <ChevronDown
                  size={16}
                  className={`text-muted transition-transform ${
                    accountMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {accountMenuOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Close account menu"
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setAccountMenuOpen(false)}
                  />

                  <div className="absolute right-0 top-[calc(100%+12px)] z-50 w-64 overflow-hidden rounded-xl border border-border bg-background shadow-xl">
                    <div className="border-b border-border px-4 py-4">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {user.name}
                      </p>
                      <p className="mt-1 truncate text-xs text-muted">
                        {user.email}
                      </p>
                    </div>

                    <div className="p-2">
                      {accountMenuLinks.map((item, index) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);

                        return (
                          <Link
                            key={`${item.href}-${index}`}
                            href={item.href}
                            onClick={closeMenus}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                              active
                                ? "bg-surface-muted font-semibold text-accent"
                                : "text-foreground hover:bg-surface-muted"
                            }`}
                          >
                            <Icon size={17} className="shrink-0" />
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>

                    <div className="border-t border-border p-2">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-500/10"
                      >
                        <LogOut size={17} />
                        Log out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
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
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-muted"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-surface-muted"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="max-h-[calc(100vh-76px)] overflow-y-auto border-t border-border bg-background px-5 py-5 shadow-lg lg:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenus}
                  className={`rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                    active
                      ? "bg-surface-muted text-accent"
                      : "text-foreground hover:bg-surface-muted"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="mt-4 border-t border-border pt-4">
            {!loading && user ? (
              <>
                <div className="mb-3 flex items-center gap-3 rounded-xl bg-surface-muted p-3">
                  {avatar}

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-muted">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  {accountMenuLinks.map((item, index) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                      <Link
                        key={`${item.href}-${index}`}
                        href={item.href}
                        onClick={closeMenus}
                        className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                          active
                            ? "bg-surface-muted text-accent"
                            : "text-foreground hover:bg-surface-muted"
                        }`}
                      >
                        <Icon size={17} />
                        {item.label}
                      </Link>
                    );
                  })}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-2 flex items-center gap-3 rounded-lg border-t border-border px-3 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-500/10"
                  >
                    <LogOut size={17} />
                    Log out
                  </button>
                </div>
              </>
            ) : !loading ? (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={closeMenus}
                  className="rounded-lg px-3 py-3 text-sm font-semibold text-foreground hover:bg-surface-muted"
                >
                  Log in
                </Link>

                <Link
                  href="/register"
                  onClick={closeMenus}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#8F4933] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#713824]"
                >
                  List your space
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </header>
  );
}