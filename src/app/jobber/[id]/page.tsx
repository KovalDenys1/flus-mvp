"use client";

import { googleMapsEmbedUrl } from "@/lib/utils/map";
import { minutesToHhMm } from "@/lib/utils/format";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Job = {
  id: string;
  title: string;
  desc: string;
  category: string;
  payNok: number;
  durationMinutes: number;
  areaName: string;
  lat: number;
  lng: number;
  createdAt: string;
  status: "open" | "closed";
};

async function getJob(id: string): Promise<Job | null> {
  try {
    const res = await fetch(`/api/jobs/${id}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.job as Job;
  } catch (e) {
    return null;
  }
}
export default function JobDetailPage({ params }: { params: { id: string } }) {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const router = useRouter();

  const { id } = params;

  useEffect(() => {
    getJob(id)
      .then(setJob)
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async () => {
    setApplying(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: job?.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Kunne ikke starte samtale.");
      }

      // Redirect user to the created conversation
      router.push(`/samtaler/${data.conversationId}`);

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Kunne ikke starte samtale.";
      toast.error(message);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <div className="max-w-2xl mx-auto py-10 px-2">Laster jobb...</div>;
  }
  if (!job) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-2">
        <p className="text-gray-500">Jobben finnes ikke.</p>
        <Link href="/jobber" className="underline">Tilbake til jobber</Link>
      </div>
    );
  }
  const mapSrc = googleMapsEmbedUrl(job.lat, job.lng, job.title);
  return (
    <div className="max-w-2xl mx-auto py-10 px-2 space-y-4">
      <h1 className="text-2xl font-bold">{job.title}</h1>
      <div className="text-sm text-gray-600">{job.areaName} • {job.category}</div>
      <div className="text-sm">Lønn: <b>{job.payNok} NOK</b> • Varighet: {minutesToHhMm(job.durationMinutes)}</div>
      <p className="text-sm leading-relaxed whitespace-pre-line">{job.desc}</p>
      <div className="aspect-video w-full overflow-hidden rounded-lg border">
        <iframe src={mapSrc} className="h-full w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Kart" />
      </div>
      <div className="w-full flex gap-3 mt-4">
        <Link
          href="/jobber"
          className="flex-1 px-6 py-2 rounded-lg border border-orange-300 text-orange-700 text-base font-medium shadow hover:bg-orange-100 transition flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
        >
          ← Tilbake
        </Link>
        <button
          onClick={handleApply}
          disabled={applying}
          className="flex-1 px-6 py-2 rounded-lg bg-orange-500 text-white text-base font-medium shadow hover:bg-orange-600 transition focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 disabled:bg-orange-300"
        >
          {applying ? "Starter samtale..." : "Søk"}
        </button>
      </div>
    </div>
  );
}