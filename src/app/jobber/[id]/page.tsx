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

async function getJob(id: string): Promise<Job | null> {
  const { jobs } = await import("@/lib/data/jobs");
  return (jobs ?? []).find((j: Job) => j.id === id) ?? null;
}

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await getJob(id);

  return (
    <div>
      <JobDetailClient job={job as Job} />
    </div>
  );
}