"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import { registerUser } from "@/services/auth";

function isValidJpgUrl(value: string): boolean {
  try {
    const url = new URL(value.trim());
    return (
      (url.protocol === "https:" || url.protocol === "http:") &&
      /\.(jpe?g)$/i.test(url.pathname)
    );
  } catch {
    return false;
  }
}

function getSafeRedirect(): string {
  const requestedPath = new URLSearchParams(window.location.search).get("next");

  if (
    requestedPath &&
    requestedPath.startsWith("/") &&
    !requestedPath.startsWith("//") &&
    !requestedPath.startsWith("/login") &&
    !requestedPath.startsWith("/register")
  ) {
    return requestedPath;
  }

  return "/add-studio";
}

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [photoURL, setPhotoURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginHref, setLoginHref] = useState("/login");

  useEffect(() => {
    const next = new URLSearchParams(window.location.search).get("next");

    if (
      next &&
      next.startsWith("/") &&
      !next.startsWith("//") &&
      !next.startsWith("/login") &&
      !next.startsWith("/register")
    ) {
      setLoginHref(`/login?next=${encodeURIComponent(next)}`);
    }
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading) return;

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail || !password) {
      toast.error("Please complete all required fields.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must contain at least 6 characters.");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      toast.error("Password must contain at least one uppercase letter.");
      return;
    }

    if (!/[a-z]/.test(password)) {
      toast.error("Password must contain at least one lowercase letter.");
      return;
    }

    try {
      setLoading(true);

      if (photoURL.trim() && !isValidJpgUrl(photoURL)) {
        toast.error("Please enter a direct JPG or JPEG image URL.");
        setLoading(false);
        return;
      }

      await registerUser({
        name: trimmedName,
        email: trimmedEmail,
        photoURL: photoURL.trim(),
        password,
      });

      toast.success("Account created successfully! Please log in.");

      const destination = getSafeRedirect();

      router.push(`/login?next=${encodeURIComponent(destination)}`);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-1 items-center justify-center bg-[#F5F1EA] px-4 py-10 text-[#282725] sm:px-6 lg:py-14">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl border border-[#E7E0D6] bg-white shadow-[0_20px_70px_rgba(40,39,37,0.08)] lg:grid-cols-[0.9fr_1.1fr]">
        <section className="relative hidden min-h-180 flex-col justify-between overflow-hidden bg-[#233B35] p-10 text-[#F5F1EA] lg:flex xl:p-14">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/10" />
          <div className="absolute -bottom-36 -left-20 h-96 w-96 rounded-full border border-white/10" />

          <div className="relative z-10">
            <Link
              href="/"
              className="text-2xl font-semibold tracking-tight"
            >
              StudioSpace<span className="text-[#D59A7E]">.</span>
            </Link>

            <div className="mt-28 max-w-md">
              <span className="mb-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#D9B39E]">
                <span className="h-px w-8 bg-[#D9B39E]" />
                Your creative journey starts here
              </span>

              <h1 className="text-5xl font-medium leading-[1.12] tracking-tight xl:text-6xl">
                Make room for
                <span className="font-serif italic text-[#D9B39E]">
                  {" "}great ideas.
                </span>
              </h1>

              <p className="mt-7 max-w-sm text-base leading-8 text-[#E2E5DF]/75">
                Discover inspiring creative spaces, connect with talented
                hosts, and bring your next project to life.
              </p>
            </div>
          </div>

          <div className="relative z-10 border-t border-white/15 pt-7">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                <CheckCircle2 size={19} className="text-[#D9B39E]" />
              </div>
              <div>
                <p className="text-sm font-medium">A space for every idea</p>
                <p className="mt-1 text-xs text-white/55">
                  Photography, music, podcasts, film and more.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-12 xl:px-16">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <Link href="/" className="text-2xl font-semibold text-[#233B35]">
                StudioSpace<span className="text-[#A45D42]">.</span>
              </Link>
            </div>

            <div className="mb-8">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#A45D42]">
                Create your account
              </p>

              <h2 className="text-3xl font-semibold tracking-tight text-[#282725] sm:text-4xl">
                Join StudioSpace
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#77736D]">
                Create an account to discover and book creative spaces.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-3 block text-sm font-medium text-[#282725]">
                  Profile photo
                  <span className="ml-2 text-xs font-normal text-[#99938A]">
                    Optional
                  </span>
                </label>

                <div className="space-y-3">
                  <input
                    id="register-photo-url"
                    type="url"
                    value={photoURL}
                    onChange={(event) => setPhotoURL(event.target.value)}
                    placeholder="https://example.com/profile.jpg"
                    className="h-12 w-full rounded-xl border border-[#E7E0D6] bg-white px-4 text-sm text-[#282725] outline-none transition placeholder:text-[#AAA49B] focus:border-[#A45D42] focus:ring-2 focus:ring-[#A45D42]/10"
                  />
                  <p className="text-xs leading-5 text-[#99938A]">
                    Optional. Paste a direct JPG or JPEG image URL.
                  </p>
                  {photoURL.trim() && isValidJpgUrl(photoURL) && (
                    <div className="relative h-20 w-20 overflow-hidden rounded-full border border-[#E7E0D6]">
                      <Image
                        src={photoURL.trim()}
                        alt="Profile photo preview"
                        fill
                        unoptimized
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-[#282725]"
                >
                  Full name
                </label>

                <div className="relative">
                  <UserRound
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#99938A]"
                  />
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Enter your full name"
                    className="h-12 w-full rounded-xl border border-[#E7E0D6] bg-white pl-11 pr-4 text-sm text-[#282725] outline-none transition placeholder:text-[#AAA49B] focus:border-[#A45D42] focus:ring-2 focus:ring-[#A45D42]/10"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-[#282725]"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#99938A]"
                  />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="h-12 w-full rounded-xl border border-[#E7E0D6] bg-white pl-11 pr-4 text-sm text-[#282725] outline-none transition placeholder:text-[#AAA49B] focus:border-[#A45D42] focus:ring-2 focus:ring-[#A45D42]/10"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-[#282725]"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#99938A]"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Create a strong password"
                    className="h-12 w-full rounded-xl border border-[#E7E0D6] bg-white pl-11 pr-12 text-sm text-[#282725] outline-none transition placeholder:text-[#AAA49B] focus:border-[#A45D42] focus:ring-2 focus:ring-[#A45D42]/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((previous) => !previous)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-[#99938A] transition hover:text-[#233B35]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <p className="mt-2 text-xs leading-5 text-[#99938A]">
                  At least 6 characters, including uppercase and lowercase letters.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#8F4933] px-5 text-sm font-semibold text-white transition hover:bg-[#713824] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <LoaderCircle size={18} className="animate-spin" />
                    Creating your account...
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-[#77736D]">
              Already have an account?{" "}
              <Link
                href={loginHref}
                className="font-semibold text-[#8F4933] transition hover:text-[#713824]"
              >
                Log in
              </Link>
            </p>

            <p className="mt-8 text-center text-xs leading-5 text-[#A49D93]">
              By creating an account, you agree to use StudioSpace responsibly
              and respect the creative spaces listed by our hosts.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}



