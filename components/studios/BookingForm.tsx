"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createBooking } from "@/services/bookingService";
import type { Studio } from "@/lib/studios";

type BookingFormProps = {
  studio: Studio;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

export default function BookingForm({ studio }: BookingFormProps) {
  const router = useRouter();

  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [duration, setDuration] = useState(2);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const minimumDate = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }, []);

  const subtotal = studio.hourlyRate * duration;
  const deposit = studio.securityDeposit || 0;
  const total = subtotal + deposit;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    if (!bookingDate || !startTime) {
      setFeedback({
        type: "error",
        message: "Please select a booking date and start time.",
      });
      return;
    }

    setSubmitting(true);

    try {
      await createBooking({
        studioId: studio.id,
        bookingDate,
        startTime,
        duration,
        notes,
      });

      setFeedback({
        type: "success",
        message: "Your booking request has been submitted.",
      });

      window.setTimeout(() => {
        router.push("/my-bookings");
        router.refresh();
      }, 900);
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to submit your booking.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="booking-form"
      className="rounded-2xl border border-[#e7e9e5] bg-white p-5 shadow-[0_12px_40px_rgba(20,35,28,0.06)] sm:p-6"
    >
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#718078]">
          Reserve this space
        </p>

        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#1d3028]">
          Book this studio
        </h2>

        <p className="mt-1 text-sm text-[#77847d]">
          Send a booking request to the studio owner.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="booking-date"
            className="mb-2 block text-sm font-medium text-[#35463d]"
          >
            Booking date
          </label>

          <input
            id="booking-date"
            type="date"
            min={minimumDate}
            value={bookingDate}
            onChange={(event) => setBookingDate(event.target.value)}
            required
            className="h-12 w-full rounded-xl border border-[#dfe5df] bg-white px-3 text-sm text-[#25382e] outline-none transition focus:border-[#527b65] focus:ring-2 focus:ring-[#527b65]/10"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="booking-time"
              className="mb-2 block text-sm font-medium text-[#35463d]"
            >
              Start time
            </label>

            <input
              id="booking-time"
              type="time"
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
              required
              className="h-12 w-full rounded-xl border border-[#dfe5df] bg-white px-3 text-sm text-[#25382e] outline-none transition focus:border-[#527b65] focus:ring-2 focus:ring-[#527b65]/10"
            />
          </div>

          <div>
            <label
              htmlFor="booking-duration"
              className="mb-2 block text-sm font-medium text-[#35463d]"
            >
              Duration
            </label>

            <select
              id="booking-duration"
              value={duration}
              onChange={(event) => setDuration(Number(event.target.value))}
              className="h-12 w-full rounded-xl border border-[#dfe5df] bg-white px-3 text-sm text-[#25382e] outline-none transition focus:border-[#527b65] focus:ring-2 focus:ring-[#527b65]/10"
            >
              {[1, 2, 3, 4, 5, 6, 8, 10, 12, 24].map((hours) => (
                <option key={hours} value={hours}>
                  {hours} {hours === 1 ? "hour" : "hours"}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="booking-notes"
            className="mb-2 block text-sm font-medium text-[#35463d]"
          >
            Additional notes <span className="font-normal text-[#9aa49e]">(optional)</span>
          </label>

          <textarea
            id="booking-notes"
            rows={3}
            maxLength={1000}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Tell the host about your production or requirements..."
            className="w-full resize-y rounded-xl border border-[#dfe5df] bg-white p-3 text-sm text-[#25382e] outline-none transition placeholder:text-[#a1aaa4] focus:border-[#527b65] focus:ring-2 focus:ring-[#527b65]/10"
          />
        </div>

        <div className="rounded-xl bg-[#f5f8f5] p-4">
          <div className="flex items-center justify-between text-sm text-[#68776e]">
            <span>
              {formatCurrency(studio.hourlyRate)} × {duration} hours
            </span>
            <span>{formatCurrency(subtotal)}</span>
          </div>

          <div className="mt-2 flex items-center justify-between text-sm text-[#68776e]">
            <span>Security deposit</span>
            <span>{formatCurrency(deposit)}</span>
          </div>

          <div className="my-3 border-t border-dashed border-[#d6dfd7]" />

          <div className="flex items-center justify-between">
            <span className="font-semibold text-[#263b30]">Estimated total</span>
            <span className="text-xl font-semibold text-[#315d45]">
              {formatCurrency(total)}
            </span>
          </div>

          <p className="mt-2 text-xs leading-5 text-[#829087]">
            Your request will remain pending until the studio owner confirms it.
          </p>
        </div>

        {feedback && (
          <div
            role="status"
            className={`rounded-xl px-4 py-3 text-sm ${
              feedback.type === "success"
                ? "border border-[#cce5d3] bg-[#eff8f1] text-[#28633b]"
                : "border border-[#f0d1ca] bg-[#fff3f0] text-[#a33f2e]"
            }`}
          >
            {feedback.message}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="flex h-12 w-full items-center justify-center rounded-xl bg-[#315d45] px-5 text-sm font-semibold text-white transition hover:bg-[#254b37] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Submitting request..." : "Request booking"}
        </button>

        <p className="text-center text-xs leading-5 text-[#929d95]">
          You will be able to track your request from My Bookings.
        </p>
      </form>
    </section>
  );
}