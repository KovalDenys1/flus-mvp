"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

type User = { id: string; email: string; role: string } | null;

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export default function AuthGuard({
  children,
  requireAuth = true,
  redirectTo = "/login"
}: AuthGuardProps) {
  const router = useRouter();
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me");
      const data = await response.json();

      if (data.user) {
        setUser(data.user);
      } else {
        setUser(null);
        if (requireAuth) {
          router.push(redirectTo);
        }
      }
    } catch (error) {
      console.error("Autentiseringssjekk feilet:", error);
      setUser(null);
      if (requireAuth) {
        router.push(redirectTo);
      }
    } finally {
      setLoading(false);
    }
  }, [requireAuth, redirectTo, router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return null; // Will redirect
  }

  return <>{children}</>;
}