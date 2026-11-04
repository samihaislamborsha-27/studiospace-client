"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Camera,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useAuth } from "@/context/AuthProvider";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f5f1ea] px-5 dark:bg-[#171a18]">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-[#e5d8ca] border-t-[#8f4933]" />
          <p className="mt-4 text-sm text-[#77736d] dark:text-[#aaa99f]">
            Loading your profile...
          </p>
        </div>
      </main>
    );
  }

  const initials = user.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Not available";

  return (
    <main className="min-h-screen bg-[#f5f1ea] px-4 py-10 dark:bg-[#171a18] sm:px-6 lg:py-14">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#77736d] transition hover:text-[#8f4933] dark:text-[#aaa99f] dark:hover:text-[#d59a7e]"
        >
          <ArrowLeft size={17} />
          Back to home
        </Link>

        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a45d42]">
            Your account
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#282725] dark:text-[#f3f0e9] sm:text-4xl">
            My Profile
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#77736d] dark:text-[#aaa99f]">
            Manage your personal information and StudioSpace account.
          </p>
        </div>

        <div className="mt-9 grid gap-6 lg:grid-cols-[300px_1fr]">
          <aside className="h-fit rounded-2xl border border-[#e7e0d6] bg-white p-7 dark:border-[#39413b] dark:bg-[#222724]">
            <div className="flex flex-col items-center text-center">
              <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-[#eee4d9] text-3xl font-semibold text-[#8f4933] dark:bg-[#39413b] dark:text-[#e5b39b]">
                {user.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt={`${user.name}'s profile photo`}
                    fill
                    unoptimized
                    sizes="112px"
                    className="object-cover"
                  />
                ) : (
                  initials || <UserRound size={36} />
                )}
              </div>

              <h2 className="mt-5 text-xl font-semibold text-[#282725] dark:text-[#f3f0e9]">
                {user.name}
              </h2>
              <p className="mt-1 break-all text-sm text-[#77736d] dark:text-[#aaa99f]">
                {user.email}
              </p>

              <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#edf3ed] px-3 py-1.5 text-xs font-semibold text-[#47684d] dark:bg-[#293b30] dark:text-[#a9c9ae]">
                <ShieldCheck size={14} />
                Active account
              </span>
            </div>

            <div className="mt-7 border-t border-[#eee8df] pt-5 dark:border-[#39413b]">
              <p className="text-xs font-medium uppercase tracking-wider text-[#99948b]">
                Account type
              </p>
              <p className="mt-2 text-sm font-semibold capitalize text-[#282725] dark:text-[#f3f0e9]">
                {user.role || "User"}
              </p>
            </div>

            <Link
              href="/profile/edit"
              className="mt-6 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#8f4933] px-4 text-sm font-semibold text-white transition hover:bg-[#713824]"
            >
              <Camera size={16} />
              Edit profile
            </Link>
          </aside>

          <section className="rounded-2xl border border-[#e7e0d6] bg-white p-6 dark:border-[#39413b] dark:bg-[#222724] sm:p-8">
            <div className="border-b border-[#eee8df] pb-5 dark:border-[#39413b]">
              <h2 className="text-lg font-semibold text-[#282725] dark:text-[#f3f0e9]">
                Personal information
              </h2>
              <p className="mt-1 text-sm text-[#77736d] dark:text-[#aaa99f]">
                Your account details currently associated with StudioSpace.
              </p>
            </div>

            <div className="mt-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f5f1ea] text-[#8f4933] dark:bg-[#303832] dark:text-[#d59a7e]">
                  <UserRound size={19} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-[#99948b]">
                    Full name
                  </p>
                  <p className="mt-1 wrap-break-words text-sm font-semibold text-[#282725] dark:text-[#f3f0e9]">
                    {user.name}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f5f1ea] text-[#8f4933] dark:bg-[#303832] dark:text-[#d59a7e]">
                  <Mail size={19} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-[#99948b]">
                    Email address
                  </p>
                  <p className="mt-1 break-all text-sm font-semibold text-[#282725] dark:text-[#f3f0e9]">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f5f1ea] text-[#8f4933] dark:bg-[#303832] dark:text-[#d59a7e]">
                  <CalendarDays size={19} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-[#99948b]">
                    Member since
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#282725] dark:text-[#f3f0e9]">
                    {joinedDate}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-9 rounded-xl bg-[#f8f5ef] p-5 dark:bg-[#303832]">
              <p className="text-sm font-semibold text-[#282725] dark:text-[#f3f0e9]">
                Your creative journey starts here.
              </p>
              <p className="mt-1 text-sm leading-6 text-[#77736d] dark:text-[#aaa99f]">
                Explore inspiring studios and find the right space for your
                next project.
              </p>
              <Link
                href="/studios"
                className="mt-3 inline-flex items-center text-sm font-semibold text-[#8f4933] hover:underline dark:text-[#d59a7e]"
              >
                Explore studios
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}