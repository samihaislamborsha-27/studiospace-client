"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { toast } from "sonner";
import { loginUser } from "@/services/auth";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (loading) return;

    if (!email.trim() || !password) {
      toast.error("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const result = await loginUser({
        email: email.trim().toLowerCase(),
        password,
      });

      toast.success(result.message || "Welcome back!");

      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to sign in."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-[#f5f1ea] px-4 py-12 dark:bg-[#171a18] sm:px-6">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-[0_20px_70px_rgba(40,39,37,0.08)] dark:bg-[#222724] lg:grid-cols-2">
        <section className="relative hidden min-h-155 overflow-hidden bg-[#233b35] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-45"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=85&w=1200')",
            }}
          />

          <div className="absolute inset-0 bg-linear-to-t from-[#172b25] via-[#233b35]/65 to-[#233b35]/30" />

          <div className="relative z-10">
            <Link href="/" className="text-xl font-semibold tracking-tight">
              StudioSpace
            </Link>
          </div>

          <div className="relative z-10 max-w-md">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d9c9b5]">
              Your creative journey
            </span>

            <h1 className="mt-5 text-4xl font-semibold leading-tight xl:text-5xl">
              Find a space where ideas come to life.
            </h1>

            <p className="mt-5 max-w-sm text-sm leading-7 text-white/75">
              Discover inspiring studios, connect with creative spaces
              and bring your next project to life.
            </p>
          </div>

          <p className="relative z-10 text-xs text-white/55">
            A place for every kind of creative work.
          </p>
        </section>

        <section className="flex items-center px-6 py-10 sm:px-10 lg:px-12">
          <div className="mx-auto w-full max-w-md">
            <Link
              href="/"
              className="text-lg font-semibold tracking-tight text-[#233b35] dark:text-[#c0d4c8] lg:hidden"
            >
              StudioSpace
            </Link>

            <div className="mt-8 lg:mt-0">
              <p className="text-xs font-semibold uppercase tracking-[0.17em] text-[#a45d42]">
                Welcome back
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#282725] dark:text-[#f3f0e9]">
                Sign in to your account
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#77736d] dark:text-[#aaa99f]">
                Pick up where your creativity left off.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-[#282725] dark:text-[#f3f0e9]"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#99948b]"
                  />

                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-[#e7e0d6] bg-[#fcfbf9] py-3.5 pl-11 pr-4 text-sm text-[#282725] outline-none transition placeholder:text-[#aaa49a] focus:border-[#a45d42] dark:border-[#39413b] dark:bg-[#171a18] dark:text-[#f3f0e9] dark:focus:border-[#d59a7e]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-[#282725] dark:text-[#f3f0e9]"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#99948b]"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-[#e7e0d6] bg-[#fcfbf9] py-3.5 pl-11 pr-12 text-sm text-[#282725] outline-none transition placeholder:text-[#aaa49a] focus:border-[#a45d42] dark:border-[#39413b] dark:bg-[#171a18] dark:text-[#f3f0e9] dark:focus:border-[#d59a7e]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((current) => !current)
                    }
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#99948b] transition hover:text-[#8f4933] dark:hover:text-[#d59a7e]"
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#8f4933] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(143,73,51,0.18)] transition duration-200 hover:bg-[#713824] hover:shadow-[0_6px_18px_rgba(113,56,36,0.25)] active:scale-[0.99] disabled:cursor-wait disabled:opacity-65"
              >
                {loading ? "Signing in..." : "Sign in"}
                {!loading && <ArrowRight size={17} />}
              </button>
            </form>

            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#e7e0d6] dark:bg-[#39413b]" />
              <span className="text-xs text-[#99948b]">OR</span>
              <div className="h-px flex-1 bg-[#e7e0d6] dark:bg-[#39413b]" />
            </div>

            <button
              type="button"
              onClick={() =>
                toast.info(
                  "Google sign-in will be available after OAuth setup."
                )
              }
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#e7e0d6] px-5 py-3.5 text-sm font-medium text-[#282725] transition hover:border-[#c9a18e] hover:bg-[#f5f1ea] dark:border-[#39413b] dark:text-[#f3f0e9] dark:hover:border-[#8f4933] dark:hover:bg-[#2b312d]"
            >
              <span className="text-base font-bold">G</span>
              Continue with Google
            </button>

            <p className="mt-7 text-center text-sm text-[#77736d] dark:text-[#aaa99f]">
              New to StudioSpace?{" "}
              <Link
                href="/register"
                className="font-semibold text-[#8f4933] transition hover:text-[#713824] hover:underline dark:text-[#d59a7e] dark:hover:text-[#e5b39b]"
              >
                Create an account
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}