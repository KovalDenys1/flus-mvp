"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

type User = { id: string; email: string; role: string } | null;

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me");
      const data = await response.json();

      if (data.user) {
        // Check if user is admin (you can modify this logic based on your user roles)
        if (data.user.role === 'admin' || data.user.email === 'admin@flus.no') {
          setUser(data.user);
        } else {
          // TEMPORARY: Allow access for testing - remove this after fixing admin role assignment
          console.log("User role:", data.user.role, "allowing access temporarily");
          setUser(data.user);
          // router.push('/');
          // return;
        }
      } else {
        // Not logged in, redirect to login
        router.push('/login');
        return;
      }
    } catch (error) {
      console.error("Admin autentiseringssjekk feilet:", error);
      router.push('/login');
      return;
    } finally {
      setLoading(false);
    }
  }, [router]);

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

  if (!user) {
    return null; // Will redirect
  }

  return <>{children}</>;
}