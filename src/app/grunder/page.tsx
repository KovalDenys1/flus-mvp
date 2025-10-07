"use client";

import { useEffect, useState } from "react";

type Ticket = {
  id: string;
  workerId: string;
  reason: string;
  createdAt: string;
  status: "åpen" | "under arbeid" | "lukket";
  notes?: string;
};

export default function Page() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [canContactCurator, setCanContactCurator] = useState(false);
  const [curatorThreshold, setCuratorThreshold] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/achievements")
      .then((r) => r.json())
      .then((d) => {
        setCanContactCurator(Boolean(d?.achievements?.canContactCurator));
        setCuratorThreshold(d?.rules?.curatorThreshold ?? null);
      })
      .catch(() => {});

    fetch("/api/support/tickets")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d) => setTickets(d.tickets ?? []))
      .catch((e) => setErr(String(e)))
      .finally(() => setLoading(false));
  }, []);

  async function createTicket(e: React.FormEvent) {
    e.preventDefault();
    if (!canContactCurator) return;

    const text = reason.trim();
    if (text.length < 5) {
      alert("Skriv en kort grunn (minst 5 tegn).");
      return;
    }
    try {
      setSubmitting(true);
      const res = await fetch("/api/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      const t = data.ticket as Ticket;
      setTickets((prev) => {
        const exists = prev.find((x) => x.id === t.id);
        if (exists) return prev;
        return [t, ...prev];
      });
      setReason("");
      alert("Forespørsel sendt ✅");
    } catch (e: any) {
      alert("Kunne ikke sende forespørsel: " + String(e?.message || e));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold">Gründer</h1>
        <p className="text-sm text-gray-600">
          Veiviser for å starte ENK/AS. Kontakt kurator når du har nok erfaring.
        </p>
      </header>

      {/* Enkel sjekkliste */}
      <section className="border rounded p-3">
        <h2 className="font-medium mb-2">Sjekkliste</h2>
        <ul className="list-disc pl-5 text-sm space-y-1">
          <li>Vurdere ENK vs AS (ansvar, kostnader, skatt)</li>
          <li>Navn og formål</li>
          <li>Enkel forretningsplan (én side)</li>
          <li>Priser og enkel fakturamalk</li>
          <li>Bank/konto og regnskapsrutiner</li>
          <li>Første kunder gjennom småjobber i FLUS</li>
        </ul>
      </section>

      {/* Kontakt kurator */}
      <section className="border rounded p-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-medium">Kontakt kurator</h2>
            {!canContactCurator && (
              <p className="text-xs text-gray-600">
                Lås opp etter {curatorThreshold ?? 150} fullførte i én kategori (se Prestasjoner).
              </p>
            )}
          </div>
        </div>

        <form onSubmit={createTicket} className="mt-3 space-y-2">
          <label className="block text-sm">
            Kort begrunnelse
            <textarea
              className="mt-1 w-full border rounded p-2"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="F.eks. 'Ønsker hjelp til å starte ENK for IT-hjelp'"
              disabled={!canContactCurator || submitting}
            />
          </label>

          <button
            type="submit"
            className="border rounded px-3 py-1 disabled:opacity-50"
            disabled={!canContactCurator || submitting}
          >
            {submitting ? "Sender…" : "Send forespørsel"}
          </button>
        </form>
      </section>

      {/* Mine forespørsler */}
      <section>
        <h2 className="font-medium">Mine forespørsler</h2>
        {loading ? (
          <div>Henter…</div>
        ) : tickets.length === 0 ? (
          <p className="text-gray-500 text-sm">Ingen forespørsler ennå.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {tickets.map((t) => (
              <li key={t.id} className="border rounded p-3">
                <div className="text-sm text-gray-600">
                  {new Date(t.createdAt).toLocaleString()} • status: {t.status}
                </div>
                <p className="mt-1">{t.reason}</p>
                {t.notes && <p className="mt-1 text-sm text-gray-700">Notat: {t.notes}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}