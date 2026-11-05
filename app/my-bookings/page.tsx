"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  CalendarDays,
  Clock3,
  MapPin,
  ArrowRight,
  ClipboardList,
  XCircle,
  RefreshCw,
} from "lucide-react";

import {
  cancelBooking,
  getMyBookings,
  type Booking,
  type BookingStatus,
} from "@/services/bookingService";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (value: string) => {
  if (!value) return "Date unavailable";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const statusStyles: Record<BookingStatus, string> = {
  Pending: "bg-[#fff5df] text-[#986c18] border-[#f0dfb8]",
  Confirmed: "bg-[#eaf5ed] text-[#347149] border-[#d0e7d6]",
  Completed: "bg-[#edf1f7] text-[#536b8c] border-[#dce4ef]",
  Cancelled: "bg-[#fceeed] text-[#a34c43] border-[#f0d7d3]",
  Rejected: "bg-[#fceeed] text-[#a34c43] border-[#f0d7d3]",
};

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");

  const loadBookings = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getMyBookings();
      setBookings(result);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load your bookings."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBookings();
  }, [loadBookings]);

  const handleCancel = async (booking: Booking) => {
    const confirmed = window.confirm(
      `Cancel your booking request for "${booking.studioTitle}"?`
    );

    if (!confirmed) return;

    setCancellingId(booking._id);
    setFeedback("");

    try {
      await cancelBooking(booking._id);

      setBookings((current) =>
        current.map((item) =>
          item._id === booking._id
            ? { ...item, status: "Cancelled" }
            : item
        )
      );

      setFeedback("Your booking has been cancelled.");
    } catch (cancelError) {
      setFeedback(
        cancelError instanceof Error
          ? cancelError.message
          : "Unable to cancel this booking."
      );
    } finally {
      setCancellingId(null);
    }
  };

  const pendingCount = bookings.filter(
    (booking) => booking.status === "Pending"
  ).length;

  const confirmedCount = bookings.filter(
    (booking) => booking.status === "Confirmed"
  ).length;

  return (
    <main className="min-h-screen bg-[#f7f8f5] px-4 pb-16 pt-9 sm:px-6 lg:pt-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#718078]">
              Your workspace activity
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#20342a] sm:text-4xl">
              My Bookings
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#78857c]">
              Keep track of your studio reservations and booking requests.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadBookings()}
            disabled={loading}
            className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl border border-[#dce4dc] bg-white px-4 text-sm font-semibold text-[#43584a] transition hover:bg-[#f0f5f0] disabled:opacity-50 sm:self-auto"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#e5eae4] bg-white p-5">
            <p className="text-sm text-[#7b8980]">Total bookings</p>
            <p className="mt-2 text-3xl font-semibold text-[#25382e]">
              {bookings.length}
            </p>
          </div>

          <div className="rounded-2xl border border-[#e5eae4] bg-white p-5">
            <p className="text-sm text-[#7b8980]">Awaiting confirmation</p>
            <p className="mt-2 text-3xl font-semibold text-[#a47b2e]">
              {pendingCount}
            </p>
          </div>

          <div className="rounded-2xl border border-[#e5eae4] bg-white p-5">
            <p className="text-sm text-[#7b8980]">Confirmed bookings</p>
            <p className="mt-2 text-3xl font-semibold text-[#347149]">
              {confirmedCount}
            </p>
          </div>
        </div>

        {feedback && (
          <div
            role="status"
            className="mt-5 rounded-xl border border-[#d8e6d9] bg-[#eff7ef] px-4 py-3 text-sm text-[#386448]"
          >
            {feedback}
          </div>
        )}

        {loading ? (
          <div className="mt-7 space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-48 animate-pulse rounded-2xl border border-[#e5eae4] bg-white"
              />
            ))}
          </div>
        ) : error ? (
          <div className="mt-8 rounded-2xl border border-[#eed8d4] bg-white px-6 py-12 text-center">
            <XCircle size={30} className="mx-auto text-[#b75a4c]" />
            <h2 className="mt-4 text-lg font-semibold text-[#293c31]">
              Could not load bookings
            </h2>
            <p className="mt-2 text-sm text-[#829087]">{error}</p>
            <button
              type="button"
              onClick={() => void loadBookings()}
              className="mt-5 rounded-xl bg-[#315d45] px-5 py-3 text-sm font-semibold text-white hover:bg-[#254b37]"
            >
              Try again
            </button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-[#d8e1d8] bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf4ed] text-[#477052]">
              <ClipboardList size={25} />
            </div>
            <h2 className="mt-5 text-xl font-semibold text-[#293c31]">
              No bookings yet
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#829087]">
              Your studio reservations will appear here once you send your first
              booking request.
            </p>
            <Link
              href="/studios"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-[#315d45] px-5 text-sm font-semibold text-white transition hover:bg-[#254b37]"
            >
              Explore studios
              <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <div className="mt-7 space-y-4">
            {bookings.map((booking) => (
              <article
                key={booking._id}
                className="overflow-hidden rounded-2xl border border-[#e5eae4] bg-white"
              >
                <div className="grid sm:grid-cols-[220px_minmax(0,1fr)]">
                  <div className="relative min-h-47.5 bg-[#e9eee8] sm:min-h-full">
                    {booking.studioImage ? (
                      <Image
                        src={booking.studioImage}
                        alt={booking.studioTitle}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 100vw, 220px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full min-h-47.5 items-center justify-center text-[#8a998e]">
                        <ClipboardList size={30} />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 p-5 sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="text-xl font-semibold tracking-tight text-[#293c31]">
                          {booking.studioTitle}
                        </h2>
                        <p className="mt-2 flex items-center gap-1.5 text-sm text-[#849087]">
                          <MapPin size={14} />
                          {booking.studioLocation || "Location unavailable"}
                        </p>
                      </div>

                      <span
                        className={`inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                          statusStyles[booking.status] ||
                          statusStyles.Pending
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f0f4ef] text-[#55745f]">
                          <CalendarDays size={17} />
                        </span>
                        <div>
                          <p className="text-xs text-[#929d95]">Booking date</p>
                          <p className="mt-0.5 text-sm font-medium text-[#4b5d50]">
                            {formatDate(booking.bookingDate)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f0f4ef] text-[#55745f]">
                          <Clock3 size={17} />
                        </span>
                        <div>
                          <p className="text-xs text-[#929d95]">Schedule</p>
                          <p className="mt-0.5 text-sm font-medium text-[#4b5d50]">
                            {booking.startTime} Â· {booking.duration}{" "}
                            {booking.duration === 1 ? "hour" : "hours"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-col justify-between gap-4 border-t border-[#edf0eb] pt-4 sm:flex-row sm:items-center">
                      <div>
                        <p className="text-xs text-[#929d95]">Estimated total</p>
                        <p className="mt-1 text-lg font-semibold text-[#315d45]">
                          {formatCurrency(booking.totalPrice)}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {booking.status === "Pending" && (
                          <button
                            type="button"
                            onClick={() => void handleCancel(booking)}
                            disabled={cancellingId === booking._id}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#ecd8d4] px-4 text-sm font-semibold text-[#a45146] transition hover:bg-[#fff4f1] disabled:opacity-50"
                          >
                            <XCircle size={15} />
                            {cancellingId === booking._id
                              ? "Cancelling..."
                              : "Cancel booking"}
                          </button>
                        )}

                        <Link
                          href={`/studios/${booking.studioId}`}
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#315d45] px-4 text-sm font-semibold text-white transition hover:bg-[#254b37]"
                        >
                          View studio
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
