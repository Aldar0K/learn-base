import { cookies, headers } from "next/headers";

import type { User } from "@/entities/user";

type MeResponse = {
  user: User;
};

const resolveAppUrl = async () => {
  if (process.env.APP_URL) {
    return process.env.APP_URL;
  }

  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";

  if (host) {
    return `${protocol}://${host}`;
  }

  return "http://localhost:3000";
};

export const getCurrentUser = async (): Promise<User | null> => {
  const appUrl = await resolveAppUrl();
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const res = await fetch(`${appUrl}/api/auth/me`, {
    method: "GET",
    headers: cookieHeader ? { cookie: cookieHeader } : undefined,
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  const data = (await res.json()) as MeResponse;
  return data.user;
};
