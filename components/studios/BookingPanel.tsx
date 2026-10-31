"use client";

import { useState } from "react";
import { CalendarDays, Clock3, Users, ArrowRight } from "lucide-react";
import { toast } from "sonner";

type BookingPanelProps = {
  hourlyRate: number;
  capacity: number;
  studioTitle: string;
};

const timeSlots = [
  "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00",
  "16:00", "17:00", "18:00", "19:00",
  "20:00", "21:00",
];

const formatPrice = (amount: number) =>
  new Intl.NumberFormat("en-BD").format(amount);

export default function BookingPanel({
  hourlyRate,
  capacity,
  studioTitle,
}: BookingPanelProps) {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [duration, setDuration] = useState(2);
  const [guests, setGuests] = useState(1);

  const subtotal = hourlyRate * duration;

  const handleContinue = () => {
    if (!date) {
      toast.error("Please select a booking date.");
      return;
    }

    if (new Date(`${date}T23:59:59`) < new Date()) {
      toast.error("Please select a future date.");
      return;
    }

    toast.info("Booking details are ready", {
      description: `${studioTitle} · ${date} · ${startTime} · ${duration} hours`,
    });
  };

  return (
    <aside className="h-fit rounded-2xl border border-[#e7e0d6] bg-white p-5 shadow-[0_12px_40px_rgba(40,39,37,0.06)] dark:border-[#39413b] dark:bg-[#222724] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-[#77736d] dark:text-[#aaa99f]">
            Starting from
          </p>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-3xl font-semibold tracking-tight text-[#233b35] dark:text-[#f3f0e9]">
              ৳{formatPrice(hourlyRate)}
            </span>
            <span className="text-sm text-[#77736d] dark:text-[#aaa99f]">
              / hour
            </span>
          </div>
        </div>

        <span className="rounded-full bg-[#f5f1ea] px-3 py-1.5 text-xs font-medium text-[#233b35] dark:bg-[#2b312d] dark:text-[#c0d4c8]">
          Instant estimate
        </span>
      </div>

      <div className="my-5 h-px bg-[#e7e0d6] dark:bg-[#39413b]" />

      <div className="space-y-4">
        <div>
          <label
            htmlFor="booking-date"
            className="mb-2 flex items-center gap-2 text-sm font-medium text-[#282725] dark:text-[#f3f0e9]"
          >
            <CalendarDays size={16} />
            Booking date
          </label>
          <input
            id="booking-date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="w-full rounded-xl border border-[#e7e0d6] bg-[#fcfbf9] px-3.5 py-3 text-sm text-[#282725] outline-none transition focus:border-[#233b35] dark:border-[#39413b] dark:bg-[#171a18] dark:text-[#f3f0e9] dark:focus:border-[#a9c2b3]"
          />
        </div>

        <div>
          <label
            htmlFor="booking-time"
            className="mb-2 flex items-center gap-2 text-sm font-medium text-[#282725] dark:text-[#f3f0e9]"
          >
            <Clock3 size={16} />
            Starting time
          </label>
          <select
            id="booking-time"
            value={startTime}
            onChange={(event) => setStartTime(event.target.value)}
            className="w-full rounded-xl border border-[#e7e0d6] bg-[#fcfbf9] px-3.5 py-3 text-sm text-[#282725] outline-none transition focus:border-[#233b35] dark:border-[#39413b] dark:bg-[#171a18] dark:text-[#f3f0e9] dark:focus:border-[#a9c2b3]"
          >
            {timeSlots.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="booking-duration"
              className="mb-2 block text-sm font-medium text-[#282725] dark:text-[#f3f0e9]"
            >
              Duration
            </label>
            <select
              id="booking-duration"
              value={duration}
              onChange={(event) => setDuration(Number(event.target.value))}
              className="w-full rounded-xl border border-[#e7e0d6] bg-[#fcfbf9] px-3 py-3 text-sm text-[#282725] outline-none focus:border-[#233b35] dark:border-[#39413b] dark:bg-[#171a18] dark:text-[#f3f0e9] dark:focus:border-[#a9c2b3]"
            >
              {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((hours) => (
                <option key={hours} value={hours}>
                  {hours} {hours === 1 ? "hour" : "hours"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="booking-guests"
              className="mb-2 flex items-center gap-2 text-sm font-medium text-[#282725] dark:text-[#f3f0e9]"
            >
              <Users size={15} />
              Guests
            </label>
            <select
              id="booking-guests"
              value={guests}
              onChange={(event) => setGuests(Number(event.target.value))}
              className="w-full rounded-xl border border-[#e7e0d6] bg-[#fcfbf9] px-3 py-3 text-sm text-[#282725] outline-none focus:border-[#233b35] dark:border-[#39413b] dark:bg-[#171a18] dark:text-[#f3f0e9] dark:focus:border-[#a9c2b3]"
            >
              {Array.from({ length: Math.max(1, capacity) }, (_, index) => index + 1).map(
                (count) => (
                  <option key={count} value={count}>
                    {count} {count === 1 ? "guest" : "guests"}
                  </option>
                )
              )}
            </select>
          </div>
        </div>
      </div>

      <div className="my-5 h-px bg-[#e7e0d6] dark:bg-[#39413b]" />

      <div className="space-y-3 text-sm">
        <div className="flex justify-between gap-3 text-[#77736d] dark:text-[#aaa99f]">
          <span>
            ৳{formatPrice(hourlyRate)} × {duration} hours
          </span>
          <span className="font-medium text-[#282725] dark:text-[#f3f0e9]">
            ৳{formatPrice(subtotal)}
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-[#e7e0d6] pt-3 dark:border-[#39413b]">
          <span className="font-semibold text-[#282725] dark:text-[#f3f0e9]">
            Estimated total
          </span>
          <span className="text-xl font-semibold text-[#233b35] dark:text-[#c0d4c8]">
            ৳{formatPrice(subtotal)}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleContinue}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#233b35] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#304d43] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#233b35] dark:bg-[#a9c2b3] dark:text-[#171a18] dark:hover:bg-[#c0d4c8]"
      >
        Continue to booking
        <ArrowRight size={17} />
      </button>

      <p className="mt-3 text-center text-xs leading-5 text-[#77736d] dark:text-[#aaa99f]">
        You will review your booking details before confirming.
      </p>
    </aside>
  );
}
