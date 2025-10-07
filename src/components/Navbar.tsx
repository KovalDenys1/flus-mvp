"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type User = { id: string; email: string; role: "worker" | "employer" } | null;

export default function Navbar() {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  async function loadUser() {
    const res = await fetch("/api/auth/me");
    const data = await res.json();
    setUser(data.user);
    setLoading(false);
  }

  useEffect(() => {
    loadUser();
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/login";
  }

  return (
    <nav className="flex gap-4 p-4 border-b">
      <Link href="/jobber">Jobber</Link>
      <Link href="/prestasjoner">Prestasjoner</Link>
      <Link href="/grunder">Gründer</Link>
      <Link href="/profil">Profil</Link>
      <div className="ml-auto flex gap-3">
        {loading ? (
          <span className="text-sm text-gray-500">Laster…</span>
        ) : user ? (
          <>
            <span className="text-sm text-gray-600">{user.email}</span>
            <button onClick={logout} className="underline text-sm">
              Logg ut
            </button>
          </>
        ) : (
          <>
            <Link href="/login">Logg inn</Link>
            <Link href="/register">Registrer</Link>
          </>
        )}
      </div>
    </nav>
  );
}