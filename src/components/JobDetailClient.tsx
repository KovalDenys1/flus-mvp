"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { googleMapsEmbedUrl } from "@/lib/utils/map";
import { minutesToHhMm } from "@/lib/utils/format";

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

export default function JobDetailClient({ job: initialJob }: { job: Job }) {
  const [job, setJob] = useState<Job | null>(initialJob ?? null);
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // initialJob is passed from the server; keep it in state
    setJob(initialJob ?? null);
  }, [initialJob]);

  const handleApply = async () => {
    if (!job) return;
    setApplying(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: job.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Could not start conversation.");
      }

      router.push(`/samtaler/${data.conversationId}`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Could not start conversation.";
      toast.error(message);
    } finally {
      setApplying(false);
    }
  };

  if (!job) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-2">
        <p className="text-gray-500">Job not found.</p>
        <Link href="/jobber" className="underline">Back to jobs</Link>
      </div>
    );
  }

  const mapSrc = googleMapsEmbedUrl(job.lat, job.lng, job.title);

  return (
    <div className="max-w-2xl mx-auto py-10 px-2 space-y-4">
      <h1 className="text-2xl font-bold">{job.title}</h1>
      <div className="text-sm text-gray-600">{job.areaName} • {job.category}</div>
      <div className="text-sm">Pay: <b>{job.payNok} NOK</b> • Duration: {minutesToHhMm(job.durationMinutes)}</div>
      <p className="text-sm leading-relaxed whitespace-pre-line">{job.desc}</p>
      <div className="aspect-video w-full overflow-hidden rounded-lg border">
        <iframe src={mapSrc} className="h-full w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Map" />
      </div>
      <div className="w-full flex gap-3 mt-4">
        <Link
          href="/jobber"
          className="flex-1 px-6 py-2 rounded-lg border border-orange-300 text-orange-700 text-base font-medium shadow hover:bg-orange-100 transition flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
        >
          ← Back
        </Link>
        <button
          onClick={handleApply}
          disabled={applying}
          className="flex-1 px-6 py-2 rounded-lg bg-orange-500 text-white text-base font-medium shadow hover:bg-orange-600 transition focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 disabled:bg-orange-300"
        >
          {applying ? "Starting conversation..." : "Apply"}
        </button>
      </div>
    </div>
  );
}
