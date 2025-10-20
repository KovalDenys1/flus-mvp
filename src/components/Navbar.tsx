"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type User = { id: string; email: string; role: "worker" | "employer" } | null;

export default function Navbar() {
  const [user, setUser] = useState<User>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me").then(r=>r.json()).then(d=>setUser(d.user ?? null)).catch(()=>{});
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  const linkClass = "hover:text-gray-900/80 transition";
  const pathname = usePathname();

  function isActive(href: string) {
    return pathname === href || pathname?.startsWith(href + "/");
  }

  return (
    <nav className="relative bg-white border-b shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* left: brand + mobile toggle */}
          <div className="flex items-center gap-4">
            <button
              className={`sm:hidden p-2 rounded-md hover:bg-gray-100 transition-transform ${open ? "rotate-90" : ""}`}
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <svg className="h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>

            <div className="text-sm font-semibold">Flus</div>
          </div>

          {/* center: links (hidden on small) */}
          <div className="hidden sm:flex sm:items-center sm:gap-4 ml-6">
            <Link className={`${linkClass} ${isActive('/jobber') ? 'nav-link-active' : ''}`} href="/jobber">Jobber</Link>
            <Link className={`${linkClass} ${isActive('/prestasjoner') ? 'nav-link-active' : ''}`} href="/prestasjoner">Prestasjoner</Link>
            {user && <Link className={`${linkClass} ${isActive('/samtaler') ? 'nav-link-active' : ''}`} href="/samtaler">Mine Samtaler</Link>}
            <Link className={`${linkClass} ${isActive('/grunder') ? 'nav-link-active' : ''}`} href="/grunder">Gründer</Link>
            <Link className={`${linkClass} ${isActive('/profil') ? 'nav-link-active' : ''}`} href="/profil">Profil</Link>
          </div>

          {/* right: auth actions */}
          <div className="ml-auto flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                  <span className="hidden sm:inline text-sm text-gray-600 truncate max-w-[12rem]">{user.email}</span>
                  <button onClick={logout} className="underline text-sm cursor-pointer">Logg ut</button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link className={linkClass} href="/login">Logg inn med Vipps</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* mobile menu panel */}
      {open && (
        <div className="sm:hidden border-t bg-white animate-slide-down">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <Link onClick={() => setOpen(false)} className="block px-2 py-2 rounded hover:bg-gray-50" href="/jobber">Jobber</Link>
            <Link onClick={() => setOpen(false)} className="block px-2 py-2 rounded hover:bg-gray-50" href="/prestasjoner">Prestasjoner</Link>
            {user && <Link onClick={() => setOpen(false)} className="block px-2 py-2 rounded hover:bg-gray-50" href="/samtaler">Mine Samtaler</Link>}
            <Link onClick={() => setOpen(false)} className="block px-2 py-2 rounded hover:bg-gray-50" href="/grunder">Gründer</Link>
            <Link onClick={() => setOpen(false)} className="block px-2 py-2 rounded hover:bg-gray-50" href="/profil">Profil</Link>

            <div className="border-t pt-2">
              {user ? (
                <>
                  <div className="text-sm text-gray-700 truncate">{user.email}</div>
                  <button onClick={() => { setOpen(false); logout(); }} className="mt-2 block w-full text-left px-2 py-2 rounded hover:bg-gray-50 cursor-pointer">Logg ut</button>
                </>
              ) : (
                <>
                  <Link onClick={() => setOpen(false)} className="block px-2 py-2 rounded hover:bg-gray-50" href="/login">Logg inn med Vipps</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}