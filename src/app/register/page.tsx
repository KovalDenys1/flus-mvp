"use client";

import { useState } from "react";

export default function Page() {
  const [form, setForm] = useState({ email: "", password: "", role: "worker" });
  const [msg, setMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  setMsg("Registrert! Du er nå innlogget.");
  window.location.href = "/jobber";
    } catch (e: any) {
      setMsg("Feil: " + e.message);
    }
  }

  return (
    <div className="max-w-sm mx-auto space-y-4">
      <h1 className="text-xl font-semibold">Registrer</h1>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="email"
          placeholder="E-post"
          className="border rounded w-full p-2"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Passord"
          className="border rounded w-full p-2"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="border rounded w-full p-2"
        >
          <option value="worker">Jeg ser etter jobb</option>
          <option value="employer">Jeg tilbyr jobb</option>
        </select>
        <button type="submit" className="border rounded px-3 py-1 w-full">
          Registrer
        </button>
      </form>
      {msg && <p className="text-sm text-gray-700">{msg}</p>}
    </div>
  );
}