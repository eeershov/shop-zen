import type { AuthResponse, LoginPayload } from "../types/auth.types";

const BASE_URL = "https://dummyjson.com";

export class InvalidCredentialsError extends Error {
  constructor() {
    super("Invalid credentials");
    this.name = "InvalidCredentialsError";
  }
}

export async function loginApi(payload: LoginPayload): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: payload.username,
      password: payload.password,
      expiresInMins: 60,
    }),
  });

  const data = (await response.json()) as Record<string, unknown>;

  if (!response.ok) {
    if (response.status === 400) {
      throw new InvalidCredentialsError();
    }
    const message =
      typeof data.message === "string" ? data.message : "Server error";
    throw new Error(message);
  }

  return data as unknown as AuthResponse;
}
