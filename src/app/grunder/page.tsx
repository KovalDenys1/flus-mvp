"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Ticket = { id:string; workerId:string; subject?:string; message?:string; reason:string; createdAt:string; status:"open"|"in_progress"|"closed"; notes?:string };

export default function Page() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [canContactCurator, setCanContactCurator] = useState(false);
  const [curatorThreshold, setCuratorThreshold] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/achievements").then(r=>r.json()).then(d=>{
      setCanContactCurator(Boolean(d?.achievements?.canContactCurator));
      setCuratorThreshold(d?.rules?.curatorThreshold ?? null);
    }).catch(()=>{});
    fetch("/api/support/tickets").then(r=>r.json()).then(d=>setTickets(d.tickets??[])).finally(()=>setLoading(false));
  }, []);

  async function createTicket(e: React.FormEvent) {
    e.preventDefault();
    if (!canContactCurator) return;
    const text = reason.trim();
    if (text.length < 5) { toast.error("Skriv en kort grunn (minst 5 tegn)."); return; }
    const res = await fetch("/api/support/tickets", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ subject: "Kontakt kurator", message: text }) });
    const data = await res.json();
    if (!res.ok) { toast.error(data?.error || "Feil"); return; }
    const t = data.ticket as Ticket;
    setTickets(prev => prev.find(x=>x.id===t.id) ? prev : [t, ...prev]);
    setReason("");
    toast.success("Forespørsel sendt");
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-2 space-y-10 bg-gray-50 rounded-2xl">
      <header className="flex flex-col items-center gap-3 mb-4">
        <div className="bg-primary/10 rounded-full p-3">
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="12" fill="#FDBA74"/><path d="M8 17v-2a4 4 0 0 1 8 0v2" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="9" r="4" stroke="#fff" strokeWidth="2"/></svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 text-center">Gründerhjelp</h1>
        <p className="text-gray-500 text-center max-w-lg leading-relaxed">
          Her får du tips og kan kontakte en kurator for å komme i gang som selvstendig næringsdrivende.
        </p>
      </header>

      <Card className="shadow-sm bg-white/90 rounded-xl border-0">
        <CardHeader className="pb-2"><CardTitle className="text-lg">Sjekkliste for oppstart</CardTitle></CardHeader>
        <CardContent>
          <ul className="list-disc pl-6 text-sm space-y-1 text-gray-700">
            <li>Vurder ENK vs AS (ansvar, kostnader, skatt)</li>
            <li>Velg navn og formål</li>
            <li>Lag en enkel forretningsplan (én side)</li>
            <li>Sett priser og lag fakturamalk</li>
            <li>Opprett bankkonto og ordne regnskap</li>
            <li>Få dine første kunder via småjobber i FLUS</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="shadow-sm bg-white/90 rounded-xl border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Kontakt kurator</CardTitle>
          {!canContactCurator && <p className="text-sm text-gray-500">Lås opp etter {curatorThreshold ?? 150} oppdrag i én kategori.</p>}
        </CardHeader>
        <CardContent>
          <form onSubmit={createTicket} className="space-y-3">
            <Textarea rows={3} placeholder="F.eks. 'Ønsker hjelp til å starte ENK for IT-hjelp'"
              value={reason} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>)=>setReason(e.target.value)} disabled={!canContactCurator}
              className="bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-primary/20"/>
            <Button type="submit" disabled={!canContactCurator} className="w-full px-6 py-3 rounded-lg font-semibold text-base transition text-center">
              Send forespørsel
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="shadow-sm bg-white/90 rounded-xl border-0">
        <CardHeader className="pb-2"><CardTitle className="text-lg">Mine forespørsler</CardTitle></CardHeader>
        <CardContent>
          {loading ? <div className="text-center text-gray-500">Henter…</div> : tickets.length===0 ? (
            <p className="text-sm text-gray-400 text-center">Ingen forespørsler ennå.</p>
          ) : (
            <ul className="space-y-3">
              {tickets.map(t=>(
                <li key={t.id} className="rounded-lg bg-gray-100 px-4 py-3 flex flex-col gap-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <div className="text-sm text-gray-500">{new Date(t.createdAt).toLocaleString()}</div>
                    <div className="text-xs px-2 py-1 rounded bg-primary/10 text-primary capitalize">
                      {t.status === "open" ? "Åpen" : t.status === "in_progress" ? "Under arbeid" : "Lukket"}
                    </div>
                  </div>
                  <div className="mt-1 text-sm text-gray-800">{t.reason}</div>
                  {t.notes && <div className="mt-1 text-xs text-gray-600">Notat: {t.notes}</div>}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}