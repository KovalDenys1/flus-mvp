"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "./page.css";

interface Job {
  title: string;
  description: string;
  category: string;
  pay_nok: number;
  duration_minutes: number;
  area_name: string;
}

export default function TrendingPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("jobs")
        .select("title, description, category, pay_nok, duration_minutes, area_name")
        .order("pay_nok", { ascending: false });

      if (error) {
        console.error("❌ Supabase error:", error);
      } else {
        console.log("✅ Fetched jobs:", data);
        setJobs(data || []);
      }

      setLoading(false);
    };

    fetchJobs();
  }, []);

  return (
    <section className="trending-page">



      <h1 className="page-title">🔥 Trending Jobs</h1> <a href="../" target="_blank"><button>X</button></a>
      

      {loading ? (
        <p className="loading-text">Loading trending jobs...</p>
      ) : jobs.length > 0 ? (
        <div className="job-grid">
          {jobs.map((job, index) => (
            <div key={index} className="job-card">
              <h2 className="job-title">{job.title}</h2>
              <p className="job-description">{job.description}</p>

              <div className="job-details">
                <span className="category">🏷️ {job.category}</span>
                <span className="area">📍 {job.area_name}</span>
              </div>

              <div className="job-meta">
                <span className="pay">💰 {job.pay_nok} NOK</span>
                <span className="duration">⏱️ {job.duration_minutes} min</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-jobs">No trending jobs found.</p>
      )}
    </section>
  );
}
