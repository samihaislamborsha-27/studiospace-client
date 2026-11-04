import type { Studio } from "@/lib/studios";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

type StudioApiResponse = {
  success?: boolean;
  data?: Record<string, unknown> | Record<string, unknown>[];
  message?: string;
};

export type StudioQuery = {
  search?: string;
  category?: string;
  location?: string;
  maxPrice?: number;
  sortBy?: string;
  page?: number;
  limit?: number;
};

export type CreateStudioPayload = {
  title: string;
  category: string;
  location: string;
  hourlyRate: number;
  securityDeposit: number;
  capacity: number;
  image: string;
  amenities: string[];
  overview: string;
};

function normalizeStudio(raw: Record<string, unknown>): Studio {
  return {
    id: String(raw._id ?? raw.id ?? ""),
    title: String(raw.title ?? ""),
    category: String(raw.category ?? ""),
    location: String(raw.location ?? ""),
    hourlyRate: Number(raw.hourlyRate ?? 0),
    securityDeposit: Number(raw.securityDeposit ?? 0),
    rating: Number(raw.rating ?? 0),
    reviewCount: Number(raw.reviewCount ?? 0),
    capacity: Number(raw.capacity ?? 0),
    image: String(raw.image ?? ""),
    amenities: Array.isArray(raw.amenities)
      ? raw.amenities.map(String)
      : [],
    overview: String(raw.overview ?? ""),
    featured: Boolean(raw.featured),
    ownerName: String(raw.ownerName ?? ""),
    ownerEmail: String(raw.ownerEmail ?? ""),
    ownerPhotoURL: String(raw.ownerPhotoURL ?? ""),
    status: String(raw.status ?? "Available"),
  };
}

async function parseResponse(response: Response): Promise<StudioApiResponse> {
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    const responseText = await response.text();

    console.error("Studio API returned a non-JSON response:", {
      status: response.status,
      contentType,
      preview: responseText.slice(0, 200),
    });

    throw new Error(
      `The Studio API returned an unexpected response (${response.status}). Check your API URL and backend route.`
    );
  }

  return (await response.json()) as StudioApiResponse;
}

async function requestStudios(
  endpoint: string,
  options?: RequestInit
): Promise<Studio[]> {
  if (!API_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is missing. Check your frontend .env.local file."
    );
  }

  const response = await fetch(`${API_URL}/api/studios${endpoint}`, {
    ...options,
    headers: {
      ...(options?.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...options?.headers,
    },
  });

  const result = await parseResponse(response);

  if (!response.ok || result.success === false) {
    throw new Error(result.message || "Unable to load studios.");
  }

  if (Array.isArray(result.data)) {
    return result.data.map(normalizeStudio);
  }

  if (result.data && typeof result.data === "object") {
    return [normalizeStudio(result.data)];
  }

  return [];
}

export async function getStudios(
  params: StudioQuery = {}
): Promise<Studio[]> {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();

  return requestStudios(query ? `?${query}` : "");
}

export async function getFeaturedStudios(): Promise<Studio[]> {
  return requestStudios("/featured");
}

export async function getStudioById(id: string): Promise<Studio | null> {
  if (!id) return null;

  try {
    const studios = await requestStudios(`/${encodeURIComponent(id)}`);
    return studios[0] ?? null;
  } catch (error) {
    console.error("Unable to load studio details:", error);
    return null;
  }
}

export async function getMyStudios(): Promise<Studio[]> {
  return requestStudios("/owner/mine", {
    credentials: "include",
  });
}

export async function createStudio(
  payload: CreateStudioPayload
): Promise<Studio> {
  if (!API_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is missing. Check your frontend .env.local file."
    );
  }

  const response = await fetch(`${API_URL}/api/studios`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await parseResponse(response);

  if (!response.ok || result.success === false) {
    throw new Error(result.message || "Unable to create studio.");
  }

  if (!result.data || Array.isArray(result.data)) {
    throw new Error("The server did not return the created studio.");
  }

  return normalizeStudio(result.data);
}

export async function updateStudio(
  id: string,
  payload: CreateStudioPayload
): Promise<Studio> {
  if (!API_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is missing. Check your frontend .env.local file."
    );
  }

  const response = await fetch(
    `${API_URL}/api/studios/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const result = await parseResponse(response);

  if (!response.ok || result.success === false) {
    throw new Error(result.message || "Unable to update studio.");
  }

  if (!result.data || Array.isArray(result.data)) {
    throw new Error("The server did not return the updated studio.");
  }

  return normalizeStudio(result.data);
}

export async function deleteStudio(id: string): Promise<void> {
  if (!API_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is missing. Check your frontend .env.local file."
    );
  }

  const response = await fetch(
    `${API_URL}/api/studios/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  const result = await parseResponse(response);

  if (!response.ok || result.success === false) {
    throw new Error(result.message || "Unable to delete studio.");
  }
}
