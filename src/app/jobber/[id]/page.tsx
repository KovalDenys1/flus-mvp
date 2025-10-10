import { googleMapsEmbedUrl } from "@/lib/utils/map";
import { minutesToHhMm } from "@/lib/utils/format";
import Link from "next/link";

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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/jobs/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  const data = await res.json();
  return data.job as Job;
}

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const job = await getJob(params.id);
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
          className="flex-1 px-6 py-2 rounded-lg bg-orange-500 text-white text-base font-medium shadow hover:bg-orange-600 transition focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
        >
          Søk
        </button>
      </div>
    </div>
  );
}