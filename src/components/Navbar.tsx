"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type User = { id: string; email: string; role: "worker" | "employer" } | null;

export default function Navbar() {
  const [user, setUser] = useState<User>(null);
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"worker" | "employer">("worker");

  useEffect(() => {
    const savedMode = localStorage.getItem("viewMode");
    if (savedMode === "worker" || savedMode === "employer") {
      setViewMode(savedMode);
    } else {
      setViewMode("worker");
      localStorage.setItem("viewMode", "worker");
    }

    fetch("/api/auth/me")
      .then(r=>r.json())
      .then(d=>{
        const userData = d.user ?? null;
        setUser(userData);
      })
      .catch(()=>{});
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  function toggleViewMode() {
    const newMode = viewMode === "worker" ? "employer" : "worker";
    setViewMode(newMode);
    localStorage.setItem("viewMode", newMode);
    
    // Dispatch custom event to notify other components (like profile page)
    window.dispatchEvent(new CustomEvent("viewModeChanged", { 
      detail: { viewMode: newMode } 
    }));
  }

  const linkClass = "hover:text-gray-900/80 transition";
  const pathname = usePathname();

  function isActive(href: string) {
    return pathname === href || pathname?.startsWith(href + "/");
  }

  return (
    <nav className="sticky top-0 bg-white border-b shadow-sm z-50">
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
            {viewMode === "worker" ? (
              <>
                <Link className={`${linkClass} ${isActive('/jobber') ? 'nav-link-active' : ''}`} href="/jobber">Finn jobber</Link>
                <Link className={`${linkClass} ${isActive('/mine-soknader') ? 'nav-link-active' : ''}`} href="/mine-soknader">Mine søknader</Link>
              </>
            ) : (
              <>
                <Link className={`${linkClass} ${isActive('/mine-jobber') ? 'nav-link-active' : ''}`} href="/mine-jobber">Mine jobber</Link>
                <Link className={`${linkClass} ${isActive('/jobber/ny') ? 'nav-link-active' : ''}`} href="/jobber/ny">+ Ny jobb</Link>
                <Link className={`${linkClass} ${isActive('/statistikk') ? 'nav-link-active' : ''}`} href="/statistikk">Statistikk</Link>
              </>
            )}
            {user && <Link className={`${linkClass} ${isActive('/samtaler') ? 'nav-link-active' : ''}`} href="/samtaler">Samtaler</Link>}
            <Link className={`${linkClass} ${isActive('/profil') ? 'nav-link-active' : ''}`} href="/profil">Profil</Link>
            <Link className={`${linkClass} ${isActive('/support') ? 'nav-link-active' : ''}`} href="/support">Support</Link>
          </div>

          {/* right: auth actions */}
          <div className="ml-auto flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                  {/* Role switcher */}
                  <button
                    onClick={toggleViewMode}
                    className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 hover:bg-gray-50 transition-all font-medium text-sm"
                    title={`Bytt til ${viewMode === 'worker' ? 'arbeidsgiver' : 'jobbsøker'} modus`}
                  >
                    {viewMode === "worker" ? (
                      <>
                        <span>👷</span>
                        <span>Jobbsøker</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                      </>
                    ) : (
                      <>
                        <span>💼</span>
                        <span>Arbeidsgiver</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                      </>
                    )}
                  </button>
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
            {/* Mobile role switcher */}
            {user && (
              <button
                onClick={toggleViewMode}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg border-2 bg-gray-50 font-medium text-sm mb-3"
              >
                <span className="flex items-center gap-2">
                  {viewMode === "worker" ? (
                    <>
                      <span>👷</span>
                      <span>Jobbsøker modus</span>
                    </>
                  ) : (
                    <>
                      <span>💼</span>
                      <span>Arbeidsgiver modus</span>
                    </>
                  )}
                </span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </button>
            )}

            {viewMode === "worker" ? (
              <>
                <Link onClick={() => setOpen(false)} className="block px-2 py-2 rounded hover:bg-gray-50" href="/jobber">Finn jobber</Link>
                <Link onClick={() => setOpen(false)} className="block px-2 py-2 rounded hover:bg-gray-50" href="/mine-soknader">Mine søknader</Link>
              </>
            ) : (
              <>
                <Link onClick={() => setOpen(false)} className="block px-2 py-2 rounded hover:bg-gray-50" href="/mine-jobber">Mine jobber</Link>
                <Link onClick={() => setOpen(false)} className="block px-2 py-2 rounded hover:bg-gray-50 font-semibold text-orange-600" href="/jobber/ny">+ Ny jobb</Link>
                <Link onClick={() => setOpen(false)} className="block px-2 py-2 rounded hover:bg-gray-50" href="/statistikk">Statistikk</Link>
              </>
            )}
            {user && <Link onClick={() => setOpen(false)} className="block px-2 py-2 rounded hover:bg-gray-50" href="/samtaler">Samtaler</Link>}
            <Link onClick={() => setOpen(false)} className="block px-2 py-2 rounded hover:bg-gray-50" href="/profil">Profil</Link>
            <Link onClick={() => setOpen(false)} className="block px-2 py-2 rounded hover:bg-gray-50" href="/support">Support</Link>

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