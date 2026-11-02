import type { Studio } from "@/lib/studios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type StudioApiResponse = {
  success?: boolean;
  data?: Record<string, unknown>[];
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

function normalizeStudio(raw: Record<string, unknown>): Studio {
  return {
    id: String(raw._id ?? raw.id ?? ""),
    title: String(raw.title ?? ""),
    category: String(raw.category ?? ""),
    location: String(raw.location ?? ""),
    hourlyRate: Number(raw.hourlyRate ?? 0),
    rating: Number(raw.rating ?? 0),
    reviewCount: Number(raw.reviewCount ?? 0),
    capacity: Number(raw.capacity ?? 0),
    image: String(raw.image ?? ""),
    amenities: Array.isArray(raw.amenities)
      ? raw.amenities.map(String)
      : [],
    featured: Boolean(raw.featured),
    securityDeposit: Number(raw.securityDeposit ?? 0),
    overview: String(raw.overview ?? ""),
    ownerName: String(raw.ownerName ?? ""),
    ownerEmail: String(raw.ownerEmail ?? ""),
    ownerPhotoURL: String(raw.ownerPhotoURL ?? ""),
    status: String(raw.status ?? "Available"),
  };
}

async function requestStudios(
  endpoint: string,
  options?: RequestInit
): Promise<Studio[]> {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  }

  const response = await fetch(`${API_URL}/api/studios${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  const result = (await response.json()) as StudioApiResponse;

  if (!response.ok || result.success === false) {
    throw new Error(result.message || "Unable to load studios.");
  }

  return Array.isArray(result.data)
    ? result.data.map(normalizeStudio)
    : [];
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
  } catch {
    return null;
  }
}