const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  role?: string;
  createdAt?: string;
};

export type LoginData = {
  email: string;
  password: string;
};

export type RegisterData = {
  name: string;
  email: string;
  photoURL: string;
  password: string;
};

export type ProfileUpdateData = {
  name?: string;
  photoURL?: string;
};

type AuthResponse = {
  success: boolean;
  message: string;
  user: AuthUser;
};

async function parseResponse<T>(response: Response): Promise<T> {
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      result.message || "Something went wrong. Please try again."
    );
  }

  return result as T;
}

async function authRequest(
  endpoint: string,
  data?: object
): Promise<AuthResponse> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}/api/auth/${endpoint}`, {
      method: "POST",
      headers: data
        ? { "Content-Type": "application/json" }
        : undefined,
      credentials: "include",
      cache: "no-store",
      body: data ? JSON.stringify(data) : undefined,
    });
  } catch {
    throw new Error(
      "Cannot connect to StudioSpace server. Make sure the backend is running on port 5000."
    );
  }

  return parseResponse<AuthResponse>(response);
}

export function loginUser(data: LoginData) {
  return authRequest("login", data);
}

export function registerUser(data: RegisterData) {
  return authRequest("register", data);
}

export async function updateProfile(
  data: ProfileUpdateData
): Promise<AuthResponse> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}/api/auth/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "no-store",
      body: JSON.stringify(data),
    });
  } catch {
    throw new Error("Unable to connect to StudioSpace server.");
  }

  return parseResponse<AuthResponse>(response);
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) return null;

    const result = await response.json();
    return result.user ?? null;
  } catch {
    return null;
  }
}

export async function logoutUser() {
  return authRequest("logout");
}
