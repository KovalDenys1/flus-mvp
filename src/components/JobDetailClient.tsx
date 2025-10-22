"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { minutesToHhMm } from "@/lib/utils/format";
import { googleMapsEmbedUrl } from "@/lib/utils/map";

export type Job = {
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
  address?: string;
  scheduleType?: "flexible" | "fixed" | "deadline";
  startTime?: string;
  endTime?: string;
  paymentType?: "fixed" | "hourly";
  requirements?: string;
};

export default function JobDetailClient({ job }: { job?: Job | null }) {
  const router = useRouter();
  const [applying, setApplying] = useState(false);

  if (!job) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-3xl">⚠️</span>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-red-900 mb-2">Job not found</h2>
              <p className="text-red-700 mb-4">
                This job could not be loaded. This usually happens if:
              </p>
              <ul className="list-disc list-inside text-red-700 space-y-1 text-sm">
                <li>The Supabase database has not been set up yet</li>
                <li>The job was deleted</li>
                <li>You don't have permission to view this job</li>
              </ul>
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm text-yellow-800">
                  <strong>⚡ Quick Fix:</strong> If you're the developer, please run the SQL migrations in Supabase.
                  See <code className="bg-yellow-100 px-1 py-0.5 rounded">SUPABASE_SETUP.md</code> for instructions.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <Link href="/jobber" className="inline-block px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
            ← Back to jobs
          </Link>
        </div>
      </div>
    );
  }

  const handleApply = async () => {
    setApplying(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: job.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not start conversation");
      router.push(`/samtaler/${data.conversationId}`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      toast.error(msg);
    } finally {
      setApplying(false);
    }
  };

  const mapSrc = googleMapsEmbedUrl(job.lat, job.lng, job.title);

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString("no-NO", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getScheduleLabel = () => {
    if (job.scheduleType === "flexible") return "🕐 Flexible timing";
    if (job.scheduleType === "fixed") return "⏰ Fixed schedule";
    if (job.scheduleType === "deadline") return "📅 Deadline";
    return "🕐 Flexible";
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-2 space-y-4">
      <h1 className="text-2xl font-bold">{job.title}</h1>
      <div className="text-sm text-gray-600">{job.areaName} • {job.category}</div>
      
      {/* Payment and Duration */}
      <div className="flex gap-3 flex-wrap">
        <div className="px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
          <span className="text-sm font-semibold text-green-700">{job.payNok} NOK</span>
          {job.paymentType === "hourly" && <span className="text-xs text-green-600"> /time</span>}
        </div>
        <div className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
          <span className="text-sm text-blue-700">⏱️ {minutesToHhMm(job.durationMinutes)}</span>
        </div>
        <div className="px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-lg">
          <span className="text-sm text-purple-700">{getScheduleLabel()}</span>
        </div>
      </div>

      {/* Address */}
      {job.address && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <span className="text-lg">📍</span>
            <div>
              <div className="text-xs text-gray-500 uppercase font-semibold">Location</div>
              <div className="text-sm text-gray-900">{job.address}</div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Information */}
      {(job.startTime || job.endTime) && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="text-xs text-amber-700 uppercase font-semibold mb-1">Schedule</div>
          {job.startTime && (
            <div className="text-sm text-amber-900">
              <span className="font-medium">Start:</span> {formatDateTime(job.startTime)}
            </div>
          )}
          {job.endTime && (
            <div className="text-sm text-amber-900">
              <span className="font-medium">{job.scheduleType === "deadline" ? "Deadline:" : "End:"}</span> {formatDateTime(job.endTime)}
            </div>
          )}
        </div>
      )}

      {/* Requirements */}
      {job.requirements && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="text-xs text-blue-700 uppercase font-semibold mb-1">Requirements</div>
          <p className="text-sm text-blue-900 leading-relaxed">{job.requirements}</p>
        </div>
      )}

      {/* Description */}
      <div className="bg-white border border-gray-200 rounded-lg p-3">
        <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Description</div>
        <p className="text-sm leading-relaxed whitespace-pre-line text-gray-900">{job.desc}</p>
      </div>

      {/* Map */}
      <div className="aspect-video w-full overflow-hidden rounded-lg border shadow-sm">
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
