"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

export default function Page() {
  const [form, setForm] = useState({ email: "", password: "", role: "worker" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      toast.success("Registrert! Du er nå innlogget.");
      window.location.href = "/jobber";
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Feil ved registrering";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-2 text-center">Registrer deg</h1>
      <p className="text-gray-500 text-center mb-6">Opprett en konto for å finne eller tilby jobber.</p>
      <form onSubmit={handleSubmit} className="space-y-3 bg-white p-6 rounded-xl shadow">
        <div>
          <Input
            type="email"
            placeholder="E-post"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
            autoComplete="email"
          />
        </div>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Passord"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
            autoComplete="new-password"
          />
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
            onClick={() => setShowPassword(v => !v)}
            aria-label={showPassword ? "Skjul passord" : "Vis passord"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <select
          value={form.role}
          onChange={e => setForm({ ...form, role: e.target.value })}
          className="border rounded w-full p-2 bg-white"
        >
          <option value="worker">Jeg ser etter jobb</option>
          <option value="employer">Jeg tilbyr jobb</option>
        </select>
        {error && <div className="text-red-600 text-sm text-center">{error}</div>}
        <Button disabled={loading} className="w-full flex items-center justify-center gap-2">
          {loading && (
            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          )}
          {loading ? "Registrerer…" : "Registrer"}
        </Button>
        <div className="flex justify-between mt-2 text-sm">
          <a href="/login" className="text-orange-600 hover:underline">Har du allerede konto?</a>
        </div>
      </form>
    </div>
  );
}