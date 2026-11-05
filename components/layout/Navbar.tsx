"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
  LayoutDashboard,
  PlusCircle,
  Building2,
  CalendarDays,
  UserRound,
  LogOut,
  ArrowUpRight,
  CircleUserRound,
} from "lucide-react";
import { toast } from "sonner";

import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/context/AuthProvider";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "About Us", href: "/about" },
];

const accountLinks = [
  {
    label: "Dashboard",
    href: "/profile",
    icon: LayoutDashboard,
  },
  {
    label: "Add New Studio",
    href: "/add-studio",
    icon: PlusCircle,
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
    icon: UserRound,
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { user, loading, logout } = useAuth();

  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  const account = user as
    | {
        name?: string;
        displayName?: string;
        email?: string;
        photoURL?: string;
        photoUrl?: string;
        image?: string;
      }
    | null;

  const displayName =
    account?.name || account?.displayName || "My Account";

  const email = account?.email || "";

  const photo =
    account?.photoURL || account?.photoUrl || account?.image || "";

  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target as Node)
      ) {
        setAccountOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setAccountOpen(false);
        setMobileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setAccountOpen(false);
      setMobileOpen(false);
      toast.success("You have been logged out successfully.");
    } catch {
      toast.error("Unable to log out. Please try again.");
    }
  };

  const closeMenus = () => {
    setMobileOpen(false);
    setAccountOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e5e9e5] bg-white/95 backdrop-blur-xl dark:border-white/10 dark:bg-[#171d1b]/95">
      <div className="mx-auto flex h-19 w-full max-w-360 items-center justify-between px-5 sm:px-8 lg:px-10">
        {/* Brand */}
        <Link
          href="/"
          onClick={closeMenus}
          className="group flex shrink-0 items-center gap-3"
          aria-label="StudioSpace home"
        >
          <div className="flex h-10 w-10 items-center justify-center bg-[#233b35] text-white transition-colors group-hover:bg-[#344f46] dark:bg-[#e8eee9] dark:text-[#233b35] dark:group-hover:bg-white">
            <span className="font-serif text-xl font-semibold tracking-tight">
              S<span className="text-[#d59a7d]">P</span>
            </span>
          </div>

          <div className="flex flex-col">
            <span className="font-serif text-[21px] font-semibold leading-none tracking-tight text-[#233b35] dark:text-[#f5f1ea]">
              StudioSpace
            </span>
            <span className="mt-1.5 text-[9px] font-medium uppercase tracking-[0.19em] text-[#66736d] dark:text-[#9aa79f]">
              Create without limits
            </span>
          </div>
        </Link>

        {/* Desktop navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-7 lg:flex xl:gap-9"
        >
          {navLinks.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative py-2 text-[13px] font-medium transition-colors ${
                  active
                    ? "text-[#a45d42] dark:text-[#d59a7d]"
                    : "text-[#52615a] hover:text-[#233b35] dark:text-[#b3beb8] dark:hover:text-white"
                }`}
              >
                {item.label}

                {active && (
                  <span className="absolute -bottom-0.5 left-0 h-0.5 w-full bg-[#a45d42] dark:bg-[#d59a7d]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            className="flex h-10 w-10 items-center justify-center text-[#52615a] transition-colors hover:bg-[#f2f4f1] hover:text-[#233b35] dark:text-[#b3beb8] dark:hover:bg-white/10 dark:hover:text-white"
          >
            {theme === "dark" ? (
              <Sun size={18} />
            ) : (
              <Moon size={18} />
            )}
          </button>

          {mounted && !loading && !user ? (
            <>
              <Link
                href="/login"
                className="px-3 py-2 text-[13px] font-semibold text-[#233b35] transition-colors hover:text-[#a45d42] dark:text-[#f5f1ea] dark:hover:text-[#d59a7d]"
              >
                Log in
              </Link>

              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-[#233b35] px-5 py-3 text-[13px] font-semibold text-white transition-colors hover:bg-[#344f46] dark:bg-[#e8eee9] dark:text-[#233b35] dark:hover:bg-white"
              >
                Get started
                <ArrowUpRight size={15} />
              </Link>
            </>
          ) : mounted && !loading && user ? (
            <div className="relative" ref={accountRef}>
              <button
                type="button"
                onClick={() => setAccountOpen((prev) => !prev)}
                aria-expanded={accountOpen}
                aria-label="Open account menu"
                className="flex items-center gap-2.5 border border-[#e5e9e5] px-2.5 py-2 transition-colors hover:border-[#c8d4ce] dark:border-white/10 dark:hover:border-white/20"
              >
                <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e9e3d9] text-xs font-semibold text-[#233b35] dark:bg-white/10 dark:text-[#f5f1ea]">
                  {photo ? (
                    <Image
                      src={photo}
                      alt={displayName}
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  ) : (
                    initials || <CircleUserRound size={17} />
                  )}
                </div>

                <span className="max-w-26.25 truncate text-[13px] font-semibold text-[#233b35] dark:text-[#f5f1ea]">
                  {displayName}
                </span>

                <ChevronDown
                  size={15}
                  className={`text-[#66736d] transition-transform ${
                    accountOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {accountOpen && (
                <div className="absolute right-0 top-[calc(100%+12px)] w-65 border border-[#e5e9e5] bg-white py-2 shadow-xl shadow-[#233b35]/10 dark:border-white/10 dark:bg-[#1c2521] dark:shadow-black/20">
                  <div className="border-b border-[#e5e9e5] px-4 py-3 dark:border-white/10">
                    <p className="truncate text-sm font-semibold text-[#233b35] dark:text-[#f5f1ea]">
                      {displayName}
                    </p>
                    <p className="mt-1 truncate text-xs text-[#66736d] dark:text-[#9aa79f]">
                      {email}
                    </p>
                  </div>

                  <div className="py-1.5">
                    {accountLinks.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.href);

                      return (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={closeMenus}
                          className={`flex items-center gap-3 px-4 py-2.5 text-[13px] transition-colors ${
                            active
                              ? "bg-[#f5f1ea] font-semibold text-[#a45d42] dark:bg-white/6 dark:text-[#d59a7d]"
                              : "text-[#52615a] hover:bg-[#f7f8f6] hover:text-[#233b35] dark:text-[#b3beb8] dark:hover:bg-white/5 dark:hover:text-white"
                          }`}
                        >
                          <Icon size={16} />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>

                  <div className="border-t border-[#e5e9e5] pt-1.5 dark:border-white/10">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-[13px] font-medium text-[#a45d42] transition-colors hover:bg-[#fbf4ef] dark:text-[#d59a7d] dark:hover:bg-white/5"
                    >
                      <LogOut size={16} />
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-10 w-10 animate-pulse bg-[#f1f3f0] dark:bg-white/10" />
          )}
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-1 lg:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            className="flex h-10 w-10 items-center justify-center text-[#52615a] transition-colors hover:bg-[#f2f4f1] dark:text-[#b3beb8] dark:hover:bg-white/10"
          >
            {theme === "dark" ? (
              <Sun size={18} />
            ) : (
              <Moon size={18} />
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="flex h-10 w-10 items-center justify-center text-[#233b35] transition-colors hover:bg-[#f2f4f1] dark:text-[#f5f1ea] dark:hover:bg-white/10"
          >
            {mobileOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      {/* Mobile navigation panel */}
      {mobileOpen && (
        <div className="border-t border-[#e5e9e5] bg-white px-5 pb-6 pt-4 dark:border-white/10 dark:bg-[#171d1b] lg:hidden">
          <nav
            aria-label="Mobile navigation"
            className="flex flex-col"
          >
            {navLinks.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenus}
                  className={`border-b border-[#e5e9e5]/70 py-3.5 text-sm transition-colors dark:border-white/[0.07] ${
                    active
                      ? "font-semibold text-[#a45d42] dark:text-[#d59a7d]"
                      : "font-medium text-[#52615a] hover:text-[#233b35] dark:text-[#b3beb8] dark:hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {mounted && !loading && !user ? (
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Link
                href="/login"
                onClick={closeMenus}
                className="flex items-center justify-center border border-[#dce3de] px-4 py-3 text-sm font-semibold text-[#233b35] transition-colors hover:bg-[#f5f7f4] dark:border-white/15 dark:text-[#f5f1ea] dark:hover:bg-white/5"
              >
                Log in
              </Link>

              <Link
                href="/register"
                onClick={closeMenus}
                className="flex items-center justify-center gap-2 bg-[#233b35] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#344f46] dark:bg-[#e8eee9] dark:text-[#233b35] dark:hover:bg-white"
              >
                Get started
                <ArrowUpRight size={15} />
              </Link>
            </div>
          ) : mounted && !loading && user ? (
            <div className="mt-5">
              <div className="mb-4 flex items-center gap-3 border-b border-[#e5e9e5] pb-4 dark:border-white/10">
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e9e3d9] text-sm font-semibold text-[#233b35] dark:bg-white/10 dark:text-[#f5f1ea]">
                  {photo ? (
                    <Image
                      src={photo}
                      alt={displayName}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  ) : (
                    initials || <CircleUserRound size={20} />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#233b35] dark:text-[#f5f1ea]">
                    {displayName}
                  </p>
                  <p className="truncate text-xs text-[#66736d] dark:text-[#9aa79f]">
                    {email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {accountLinks.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={closeMenus}
                      className={`flex items-center gap-2 border px-3 py-3 text-xs font-medium transition-colors ${
                        active
                          ? "border-[#d8c4b8] bg-[#fbf4ef] text-[#a45d42] dark:border-[#8b6555] dark:bg-white/6 dark:text-[#d59a7d]"
                          : "border-[#e5e9e5] text-[#52615a] hover:bg-[#f7f8f6] dark:border-white/10 dark:text-[#b3beb8] dark:hover:bg-white/5"
                      }`}
                    >
                      <Icon size={15} className="shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="mt-4 flex w-full items-center justify-center gap-2 border border-[#e5e9e5] px-4 py-3 text-sm font-semibold text-[#a45d42] transition-colors hover:bg-[#fbf4ef] dark:border-white/10 dark:text-[#d59a7d] dark:hover:bg-white/5"
              >
                <LogOut size={16} />
                Log out
              </button>
            </div>
          ) : (
            <div className="mt-5 h-20 animate-pulse bg-[#f1f3f0] dark:bg-white/10" />
          )}
        </div>
      )}
    </header>
  );
}

