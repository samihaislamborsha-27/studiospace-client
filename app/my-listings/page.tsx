"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Eye,
  MapPin,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthProvider";
import type { Studio } from "@/lib/studios";
import {
  deleteStudio,
  getMyStudios,
} from "@/services/studioService";
import {
  confirmBooking,
  getOwnerBookings,
  rejectBooking,
  type Booking,
  type BookingStatus,
} from "@/services/bookingService";

type BookingFilter = "All" | BookingStatus;

function formatCurrency(value: number) {
  return `৳${Number(value || 0).toLocaleString("en-BD")}`;
}

function formatBookingDate(value: string) {
  if (!value) return "Date unavailable";

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) return value;

  return new Intl.DateTimeFormat("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

function formatBookingTime(value: string) {
  if (!value) return "Time unavailable";

  const [hours, minutes] = value.split(":").map(Number);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return value;
  }

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function getStatusClasses(status: string) {
  switch (status.toLowerCase()) {
    case "available":
      return "bg-[#e5f1e9] text-[#376b4b] dark:bg-[#376b4b]/20 dark:text-[#9ed0ad]";
    case "pending":
      return "bg-[#fff1d9] text-[#98651c] dark:bg-[#98651c]/20 dark:text-[#f2c77e]";
    case "confirmed":
      return "bg-[#e5f1e9] text-[#376b4b] dark:bg-[#376b4b]/20 dark:text-[#9ed0ad]";
    case "completed":
      return "bg-[#e8edf3] text-[#52647a] dark:bg-[#52647a]/20 dark:text-[#b6c8df]";
    case "rejected":
    case "cancelled":
    case "unavailable":
      return "bg-[#f0e8e5] text-[#9a5541] dark:bg-[#9a5541]/20 dark:text-[#e6a995]";
    default:
      return "bg-[#ecece8] text-[#66736d] dark:bg-white/10 dark:text-[#c1c9c4]";
  }
}

function StatusLabel({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex w-fit items-center px-2.5 py-1 text-[11px] font-semibold ${getStatusClasses(status)}`}
    >
      {status}
    </span>
  );
}

function ListingCard({
  studio,
  onDelete,
  deleting,
}: {
  studio: Studio;
  onDelete: (studio: Studio) => void;
  deleting: boolean;
}) {
  const status = studio.status || "Available";

  return (
    <article className="group grid min-w-0 overflow-hidden border border-[#233b35]/10 bg-white/70 transition hover:border-[#a45d42]/35 dark:border-white/10 dark:bg-white/[0.03] lg:grid-cols-[240px_minmax(0,1fr)]">
      <Link
        href={`/studios/${studio.id}`}
        className="relative block aspect-[16/10] overflow-hidden bg-[#e5e0d7] lg:aspect-auto lg:min-h-[230px]"
        aria-label={`View ${studio.title}`}
      >
        {studio.image ? (
          <Image
            src={studio.image}
            alt={studio.title}
            fill
            unoptimized
            sizes="(max-width: 1024px) 100vw, 240px"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full min-h-48 items-center justify-center text-sm text-[#66736d]">
            No cover image
          </div>
        )}
      </Link>

      <div className="flex min-w-0 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.13em] text-[#a45d42]">
            {studio.category}
          </span>

          <StatusLabel status={status} />

          {studio.featured && (
            <span className="bg-[#f5eadf] px-2.5 py-1 text-[11px] font-semibold text-[#986044] dark:bg-[#986044]/20 dark:text-[#e5b39a]">
              Featured
            </span>
          )}
        </div>

        <Link href={`/studios/${studio.id}`} className="mt-3 w-fit max-w-full">
          <h2 className="line-clamp-2 font-serif text-2xl text-[#233b35] transition group-hover:text-[#a45d42] dark:text-[#f5f1ea] sm:text-[26px]">
            {studio.title}
          </h2>
        </Link>

        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#66736d] dark:text-[#b3beb8]">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-[#a45d42]" />
            {studio.location}
          </span>

          <span className="inline-flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-[#a45d42]" />
            Up to {studio.capacity} people
          </span>
        </div>

        <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-t border-[#233b35]/10 pt-4 dark:border-white/10">
          <div>
            <p className="text-[11px] text-[#89938d]">Hourly rate</p>
            <p className="mt-1 text-lg font-semibold text-[#233b35] dark:text-[#f5f1ea]">
              {formatCurrency(studio.hourlyRate)}
              <span className="ml-1 text-xs font-normal text-[#66736d] dark:text-[#b3beb8]">
                / hour
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/studios/${studio.id}`}
              className="inline-flex items-center gap-1.5 border border-[#233b35]/15 px-3 py-2 text-xs font-semibold text-[#233b35] transition hover:border-[#a45d42] hover:text-[#a45d42] dark:border-white/15 dark:text-[#f5f1ea]"
            >
              <Eye className="h-3.5 w-3.5" />
              View
            </Link>

            <Link
              href={`/studios/edit/${studio.id}`}
              className="inline-flex items-center gap-1.5 bg-[#233b35] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#314d45] dark:bg-[#a45d42] dark:hover:bg-[#b96b4e]"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Link>

            <button
              type="button"
              onClick={() => onDelete(studio)}
              disabled={deleting}
              className="inline-flex items-center gap-1.5 border border-[#a45d42]/25 px-3 py-2 text-xs font-semibold text-[#a45d42] transition hover:bg-[#a45d42] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function BookingCard({
  booking,
  busy,
  onConfirm,
  onReject,
}: {
  booking: Booking;
  busy: boolean;
  onConfirm: (booking: Booking) => void;
  onReject: (booking: Booking) => void;
}) {
  const isPending = booking.status === "Pending";

  return (
    <article className="border-b border-[#233b35]/10 py-5 last:border-b-0 dark:border-white/10 sm:py-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <StatusLabel status={booking.status} />

            <span className="text-[11px] text-[#89938d]">
              Request #{booking._id.slice(-7).toUpperCase()}
            </span>
          </div>

          <h3 className="mt-3 font-serif text-xl text-[#233b35] dark:text-[#f5f1ea] sm:text-2xl">
            {booking.studioTitle || "Studio booking"}
          </h3>

          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#66736d] dark:text-[#b3beb8]">
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-[#a45d42]" />
              {booking.userName || "Guest"}
            </span>

            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5 text-[#a45d42]" />
              {formatBookingDate(booking.bookingDate)}
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5 text-[#a45d42]" />
              {formatBookingTime(booking.startTime)} · {booking.duration}{" "}
              {booking.duration === 1 ? "hour" : "hours"}
            </span>
          </div>

          {booking.userEmail && (
            <p className="mt-3 break-all text-xs text-[#89938d]">
              {booking.userEmail}
            </p>
          )}

          {booking.notes && (
            <div className="mt-4 max-w-2xl border-l-2 border-[#a45d42]/50 pl-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#89938d]">
                Guest notes
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-[#66736d] dark:text-[#b3beb8]">
                {booking.notes}
              </p>
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-row items-end justify-between gap-4 border-t border-[#233b35]/10 pt-4 dark:border-white/10 lg:min-w-[190px] lg:flex-col lg:items-end lg:border-t-0 lg:pt-0">
          <div className="lg:text-right">
            <p className="text-[11px] text-[#89938d]">Booking total</p>
            <p className="mt-1 font-serif text-2xl text-[#233b35] dark:text-[#f5f1ea]">
              {formatCurrency(booking.totalPrice)}
            </p>
            <p className="mt-1 text-[11px] text-[#89938d]">
              Deposit included: {formatCurrency(booking.securityDeposit)}
            </p>
          </div>

          {isPending && (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onConfirm(booking)}
                disabled={busy}
                className="inline-flex items-center gap-1.5 bg-[#233b35] px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-[#314d45] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#376b4b] dark:hover:bg-[#467c5a]"
              >
                {busy ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Check className="h-3.5 w-3.5" />
                )}
                Confirm
              </button>

              <button
                type="button"
                onClick={() => onReject(booking)}
                disabled={busy}
                className="inline-flex items-center gap-1.5 border border-[#a45d42]/30 px-3 py-2.5 text-xs font-semibold text-[#a45d42] transition hover:bg-[#a45d42] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X className="h-3.5 w-3.5" />
                Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default function MyListingsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [studios, setStudios] = useState<Studio[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(true);

  const [error, setError] = useState("");
  const [bookingError, setBookingError] = useState("");

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [processingBookingId, setProcessingBookingId] = useState<string | null>(
    null
  );

  const [bookingFilter, setBookingFilter] = useState<BookingFilter>("All");

  const loadListings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyStudios();
      setStudios(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your studio listings."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const loadBookings = useCallback(async () => {
    try {
      setBookingLoading(true);
      setBookingError("");

      const data = await getOwnerBookings();
      setBookings(data);
    } catch (err) {
      setBookingError(
        err instanceof Error
          ? err.message
          : "Unable to load booking requests."
      );
    } finally {
      setBookingLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace("/login?next=%2Fmy-listings");
      return;
    }

    void loadListings();
    void loadBookings();
  }, [authLoading, user, router, loadListings, loadBookings]);

  const availableCount = useMemo(
    () =>
      studios.filter(
        (studio) => (studio.status || "").toLowerCase() === "available"
      ).length,
    [studios]
  );

  const pendingCount = useMemo(
    () => bookings.filter((booking) => booking.status === "Pending").length,
    [bookings]
  );

  const confirmedCount = useMemo(
    () => bookings.filter((booking) => booking.status === "Confirmed").length,
    [bookings]
  );

  const filteredBookings = useMemo(
    () =>
      bookingFilter === "All"
        ? bookings
        : bookings.filter((booking) => booking.status === bookingFilter),
    [bookings, bookingFilter]
  );

  const bookingFilters: {
    label: string;
    value: BookingFilter;
    count: number;
  }[] = [
    { label: "All requests", value: "All", count: bookings.length },
    { label: "Pending", value: "Pending", count: pendingCount },
    { label: "Confirmed", value: "Confirmed", count: confirmedCount },
    {
      label: "Completed",
      value: "Completed",
      count: bookings.filter((item) => item.status === "Completed").length,
    },
    {
      label: "Rejected",
      value: "Rejected",
      count: bookings.filter((item) => item.status === "Rejected").length,
    },
    {
      label: "Cancelled",
      value: "Cancelled",
      count: bookings.filter((item) => item.status === "Cancelled").length,
    },
  ];

  const handleDelete = async (studio: Studio) => {
    const confirmed = window.confirm(
      `Delete "${studio.title}"? This listing will be removed from your active listings.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(studio.id);

      await deleteStudio(studio.id);

      setStudios((current) =>
        current.filter((item) => item.id !== studio.id)
      );

      toast.success("Studio listing deleted.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Unable to delete this listing."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleConfirmBooking = async (booking: Booking) => {
    const confirmed = window.confirm(
      `Confirm the booking for "${booking.studioTitle}" on ${formatBookingDate(booking.bookingDate)}?`
    );

    if (!confirmed) return;

    try {
      setProcessingBookingId(booking._id);

      const updatedBooking = await confirmBooking(booking._id);

      setBookings((current) =>
        current.map((item) =>
          item._id === booking._id ? updatedBooking : item
        )
      );

      toast.success("Booking confirmed successfully.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Unable to confirm this booking."
      );

      void loadBookings();
    } finally {
      setProcessingBookingId(null);
    }
  };

  const handleRejectBooking = async (booking: Booking) => {
    const confirmed = window.confirm(
      `Reject the booking request for "${booking.studioTitle}"?`
    );

    if (!confirmed) return;

    try {
      setProcessingBookingId(booking._id);

      await rejectBooking(booking._id);

      setBookings((current) =>
        current.map((item) =>
          item._id === booking._id
            ? { ...item, status: "Rejected" as BookingStatus }
            : item
        )
      );

      toast.success("Booking request rejected.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Unable to reject this booking."
      );

      void loadBookings();
    } finally {
      setProcessingBookingId(null);
    }
  };

  if (authLoading || (user && loading && bookingLoading)) {
    return (
      <main className="min-h-[70vh] bg-[#f5f1ea] px-5 py-16 dark:bg-[#171a18] sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="h-3 w-32 bg-[#dcd8cf] dark:bg-white/10" />
          <div className="mt-5 h-10 w-72 max-w-full bg-[#dcd8cf] dark:bg-white/10" />
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-24 bg-[#e8e3da] dark:bg-white/5"
              />
            ))}
          </div>
          <div className="mt-8 space-y-4">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="h-56 bg-[#e8e3da] dark:bg-white/5"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#f5f1ea] text-[#233b35] dark:bg-[#171a18] dark:text-[#f5f1ea]">
      <section className="border-b border-[#233b35]/10 px-5 py-12 dark:border-white/10 sm:px-8 sm:py-16 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-7 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#a45d42]">
              Your workspace
            </p>

            <h1 className="font-serif text-4xl leading-tight sm:text-5xl">
              My Listings
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-[#66736d] dark:text-[#b3beb8] sm:text-base">
              Manage your creative spaces, review booking requests, and keep
              your listings up to date.
            </p>
          </div>

          <Link
            href="/add-studio"
            className="inline-flex w-fit items-center justify-center gap-2 bg-[#233b35] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#314d45] dark:bg-[#a45d42] dark:hover:bg-[#b96b4e]"
          >
            <Plus className="h-4 w-4" />
            Add a studio
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mb-10 grid gap-3 sm:grid-cols-3">
          <div className="border border-[#233b35]/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#66736d] dark:text-[#b3beb8]">
                Total listings
              </p>
              <Building2 className="h-4 w-4 text-[#a45d42]" />
            </div>
            <p className="mt-3 font-serif text-3xl">{studios.length}</p>
          </div>

          <div className="border border-[#233b35]/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#66736d] dark:text-[#b3beb8]">
                Available studios
              </p>
              <Eye className="h-4 w-4 text-[#a45d42]" />
            </div>
            <p className="mt-3 font-serif text-3xl">{availableCount}</p>
          </div>

          <div className="border border-[#233b35]/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#66736d] dark:text-[#b3beb8]">
                Pending requests
              </p>
              <Clock3 className="h-4 w-4 text-[#a45d42]" />
            </div>
            <p className="mt-3 font-serif text-3xl">{pendingCount}</p>
          </div>
        </div>

        {/* Owner booking inbox */}
        <section className="mb-14">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#a45d42]">
                Booking management
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl">
                Booking requests
              </h2>
              <p className="mt-1 text-sm text-[#66736d] dark:text-[#b3beb8]">
                Review requests from people interested in your studios.
              </p>
            </div>

            <button
              type="button"
              onClick={() => void loadBookings()}
              disabled={bookingLoading}
              className="inline-flex items-center gap-2 border border-[#233b35]/15 px-4 py-2.5 text-xs font-semibold transition hover:border-[#a45d42] hover:text-[#a45d42] disabled:opacity-50 dark:border-white/15"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${bookingLoading ? "animate-spin" : ""}`}
              />
              Refresh requests
            </button>
          </div>

          <div className="mb-5 flex flex-wrap gap-2 border-b border-[#233b35]/10 pb-4 dark:border-white/10">
            {bookingFilters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setBookingFilter(filter.value)}
                className={`inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold transition ${
                  bookingFilter === filter.value
                    ? "bg-[#233b35] text-white dark:bg-[#a45d42]"
                    : "border border-[#233b35]/10 text-[#66736d] hover:border-[#a45d42]/50 hover:text-[#a45d42] dark:border-white/10 dark:text-[#b3beb8]"
                }`}
              >
                {filter.label}
                <span
                  className={`text-[10px] ${
                    bookingFilter === filter.value
                      ? "text-white/75"
                      : "text-[#89938d]"
                  }`}
                >
                  {filter.count}
                </span>
              </button>
            ))}
          </div>

          {bookingError ? (
            <div className="border-y border-[#a45d42]/25 py-12 text-center">
              <XCircle className="mx-auto h-8 w-8 text-[#a45d42]" />

              <h3 className="mt-4 font-serif text-xl">
                Booking requests couldn’t load
              </h3>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#66736d] dark:text-[#b3beb8]">
                {bookingError}
              </p>

              <button
                type="button"
                onClick={() => void loadBookings()}
                className="mt-5 inline-flex items-center gap-2 bg-[#233b35] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#314d45] dark:bg-[#a45d42]"
              >
                <RefreshCw className="h-4 w-4" />
                Try again
              </button>
            </div>
          ) : bookingLoading ? (
            <div className="space-y-4 py-4">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="h-36 animate-pulse bg-[#e8e3da] dark:bg-white/5"
                />
              ))}
            </div>
          ) : filteredBookings.length > 0 ? (
            <div className="border-y border-[#233b35]/10 dark:border-white/10">
              {filteredBookings.map((booking) => (
                <BookingCard
                  key={booking._id}
                  booking={booking}
                  busy={processingBookingId === booking._id}
                  onConfirm={handleConfirmBooking}
                  onReject={handleRejectBooking}
                />
              ))}
            </div>
          ) : (
            <div className="border-y border-[#233b35]/10 py-12 text-center dark:border-white/10 sm:py-16">
              <div className="mx-auto flex h-12 w-12 items-center justify-center border border-[#a45d42]/25 text-[#a45d42]">
                {bookingFilter === "Pending" ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <CalendarDays className="h-5 w-5" />
                )}
              </div>

              <h3 className="mt-5 font-serif text-xl sm:text-2xl">
                {bookings.length === 0
                  ? "No booking requests yet"
                  : `No ${bookingFilter.toLowerCase()} requests`}
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#66736d] dark:text-[#b3beb8]">
                {bookings.length === 0
                  ? "When someone requests to book one of your studios, their booking details will appear here."
                  : "There are currently no bookings in this category."}
              </p>
            </div>
          )}
        </section>

        {/* Studio listings */}
        <section>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#a45d42]">
                Your spaces
              </p>

              <h2 className="font-serif text-2xl sm:text-3xl">
                Your creative spaces
              </h2>

              <p className="mt-1 text-sm text-[#66736d] dark:text-[#b3beb8]">
                {studios.length}{" "}
                {studios.length === 1 ? "listing" : "listings"}
              </p>
            </div>

            <button
              type="button"
              onClick={() => void loadListings()}
              disabled={loading}
              className="inline-flex items-center gap-2 border border-[#233b35]/15 px-4 py-2.5 text-xs font-semibold transition hover:border-[#a45d42] hover:text-[#a45d42] disabled:opacity-50 dark:border-white/15"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>

          {error ? (
            <div className="border-y border-[#a45d42]/25 py-14 text-center">
              <h3 className="font-serif text-2xl">
                Your listings couldn’t load
              </h3>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#66736d] dark:text-[#b3beb8]">
                {error}
              </p>

              <button
                type="button"
                onClick={() => void loadListings()}
                className="mt-6 inline-flex items-center gap-2 bg-[#233b35] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#314d45] dark:bg-[#a45d42]"
              >
                <RefreshCw className="h-4 w-4" />
                Try again
              </button>
            </div>
          ) : studios.length > 0 ? (
            <div className="space-y-5">
              {studios.map((studio) => (
                <ListingCard
                  key={studio.id}
                  studio={studio}
                  onDelete={handleDelete}
                  deleting={deletingId === studio.id}
                />
              ))}
            </div>
          ) : (
            <div className="border-y border-[#233b35]/10 py-16 text-center dark:border-white/10 sm:py-20">
              <div className="mx-auto flex h-14 w-14 items-center justify-center border border-[#a45d42]/25 text-[#a45d42]">
                <Building2 className="h-6 w-6" />
              </div>

              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-[#a45d42]">
                A space for your next opportunity
              </p>

              <h3 className="mt-3 font-serif text-2xl sm:text-3xl">
                You haven’t listed a studio yet.
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#66736d] dark:text-[#b3beb8]">
                Share your creative space with photographers, filmmakers,
                musicians, and creators looking for somewhere to work.
              </p>

              <Link
                href="/add-studio"
                className="mt-7 inline-flex items-center gap-2 bg-[#233b35] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#314d45] dark:bg-[#a45d42]"
              >
                List your first studio
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
