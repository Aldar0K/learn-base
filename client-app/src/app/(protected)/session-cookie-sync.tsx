"use client";

import { useEffect } from "react";

export const SessionCookieSync = () => {
  useEffect(() => {
    void fetch("/api/auth/me", {
      method: "GET",
      cache: "no-store",
      credentials: "include",
    });
  }, []);

  return null;
};
