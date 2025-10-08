import { googleMapsEmbedUrl } from "@/lib/utils/map";
import { minutesToHhMm } from "@/lib/utils/format";
import Link from "next/link";

async function getJob(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/jobs/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  const data = await res.json();
  return data.job as any;
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
      <div className="pt-2">
        <Link href="/jobber" className="underline">← Tilbake</Link>
      </div>
    </div>
  );
}