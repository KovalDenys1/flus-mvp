"use client";

import { useState, useEffect } from "react";
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
  address?: string;
  scheduleType?: "flexible" | "fixed" | "deadline";
  startTime?: string;
  endTime?: string;
  paymentType?: "fixed" | "hourly";
  requirements?: string;
};

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState<string>("");

  useEffect(() => {
    async function init() {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    }
    init();
  }, [params]);

  useEffect(() => {
    if (!id) return;

    async function fetchJob() {
      try {
        console.log("Fetching job from client:", id);
        const res = await fetch(`/api/jobs/${id}`, { cache: "no-store" });
        console.log("Response status:", res.status);
        
        if (res.ok) {
          const d = await res.json();
          console.log("Job data received:", d.job);
          setJob(d.job ?? null);
        } else {
          console.error("Failed to fetch job:", res.status);
          setJob(null);
        }
      } catch (error) {
        console.error("Error fetching job:", error);
        setJob(null);
      } finally {
        setLoading(false);
      }
    }

    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4">
        <div className="text-center">Laster...</div>
      </div>
    );
  }

  return (
    <div>
      <JobDetailClient job={job} />
    </div>
  );
}
