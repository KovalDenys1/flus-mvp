import JobDetailClient from "@/components/JobDetailClient";

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

async function fetchJob(id: string): Promise<Job | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/jobs/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const d = await res.json();
    return d.job ?? null;
  } catch {
    return null;
  }
}

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await fetchJob(id);
  return (
    <div>
      <JobDetailClient job={job as Job} />
    </div>
  );
}