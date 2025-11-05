"use client";

import { useState, useEffect } from "react";

export type User = {
  id: string;
  email: string;
  navn: string;
  role: "worker" | "employer" | "both";
  telefon?: string;
  bio?: string;
  birth_year?: number;
};

/**
 * Hook to get the current authenticated user
 * @returns {User | null} Current user or null if not authenticated
 */
export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user || null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return { user, loading };
}
