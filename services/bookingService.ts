export type BookingStatus =
  | "Pending"
  | "Confirmed"
  | "Completed"
  | "Cancelled";

export type CreateBookingPayload = {
  studioId: string;
  bookingDate: string;
  startTime: string;
  duration: number;
  notes?: string;
};

export type Booking = {
  _id: string;
  studioId: string;
  studioTitle: string;
  studioImage: string;
  studioLocation: string;
  ownerName: string;
  ownerEmail: string;
  bookingDate: string;
  startTime: string;
  duration: number;
  hourlyRate: number;
  securityDeposit: number;
  totalPrice: number;
  notes: string;
  status: BookingStatus;
  createdAt: string;
};

type BookingResponse = {
  success?: boolean;
  message?: string;
  data?: Booking | Booking[];
};

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

async function parseResponse(response: Response): Promise<BookingResponse> {
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    throw new Error(
      `Unexpected server response (${response.status}). Please try again.`
    );
  }

  return (await response.json()) as BookingResponse;
}

async function bookingRequest(
  endpoint: string,
  options?: RequestInit
): Promise<BookingResponse> {
  if (!API_URL) {
    throw new Error("The API URL is not configured.");
  }

  const response = await fetch(`${API_URL}/api/bookings${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(options?.body ? { "Content-Type": "application/json" } : {}),
      ...options?.headers,
    },
  });

  const result = await parseResponse(response);

  if (!response.ok || result.success === false) {
    if (response.status === 401) {
      throw new Error("Please log in to continue.");
    }

    throw new Error(result.message || "The booking request failed.");
  }

  return result;
}

export async function createBooking(
  payload: CreateBookingPayload
): Promise<Booking> {
  const result = await bookingRequest("", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!result.data || Array.isArray(result.data)) {
    throw new Error("The server did not return the booking.");
  }

  return result.data;
}

export async function getMyBookings(): Promise<Booking[]> {
  const result = await bookingRequest("/mine");

  return Array.isArray(result.data) ? result.data : [];
}

export async function cancelBooking(id: string): Promise<void> {
  await bookingRequest(`/${encodeURIComponent(id)}/cancel`, {
    method: "PATCH",
  });
}