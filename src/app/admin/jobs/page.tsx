"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import Link from "next/link";
import "./page.css";

interface Job {
  id: string;
  title: string;
  employer_id: string;
  status: string;
  pay_nok: number;
  area_name?: string;
  created_at?: string;
}

type ViewType = "all" | "open" | "completed" | "cancelled";

export default function AdminJobsPage() {
  const supabase = getSupabaseBrowser();
  const [view, setView] = useState<ViewType>("all");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // ✅ Fetch jobs based on view
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      let query = supabase.from("jobs").select("*");

      if (view === "open") {
        query = query.eq("status", "open");
      } else if (view === "completed") {
        query = query.eq("status", "completed");
      } else if (view === "cancelled") {
        query = query.eq("status", "cancelled");
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching jobs:", error);
      } else {
        setJobs(data || []);
      }
      setLoading(false);
    };

    fetchJobs();
  }, [view, supabase]);

  // ✅ Filter jobs by title
  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ Handle job click
  const handleJobClick = async (job: Job) => {
    setSelectedJob(job);
  };

  // ✅ Close overlay
  const closeOverlay = () => {
    setSelectedJob(null);
  };

  // ✅ Update job status
  const updateJobStatus = async (jobId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("jobs")
        .update({ status: newStatus })
        .eq("id", jobId);

      if (error) {
        console.error("Error updating job status:", error);
        alert("Failed to update job status");
        return;
      }

      // Update local state
      setJobs(prev => prev.map(job =>
        job.id === jobId ? { ...job, status: newStatus } : job
      ));

      if (selectedJob && selectedJob.id === jobId) {
        setSelectedJob({ ...selectedJob, status: newStatus });
      }

      alert("Job status updated successfully!");
    } catch (error) {
      console.error("Exception updating job status:", error);
      alert("Failed to update job status");
    }
  };

  return (
    <section className="section">
      {/* Header */}
      <div className="section-header">
        <Link href="/admin">
          <button className="exit">← Back to Dashboard</button>
        </Link>
        <h1 className="section-title">Job Management</h1>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={view === "all" ? "active" : ""}
          onClick={() => setView("all")}
        >
          All Jobs
        </button>
        <button
          className={view === "open" ? "active" : ""}
          onClick={() => setView("open")}
        >
          Open
        </button>
        <button
          className={view === "completed" ? "active" : ""}
          onClick={() => setView("completed")}
        >
          Completed
        </button>
        <button
          className={view === "cancelled" ? "active" : ""}
          onClick={() => setView("cancelled")}
        >
          Cancelled
        </button>
      </div>

      {/* Section Content */}
      <div className="section-content">
        <div className="search">
          <input
            id="search"
            type="search"
            placeholder="Search job by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <h2>Jobs ({filteredJobs.length})</h2>

        {loading ? (
          <p>Loading jobs...</p>
        ) : filteredJobs.length > 0 ? (
          <ul className="userUl">
            {filteredJobs.map((job) => (
              <li
                key={job.id}
                className="userList"
                onClick={() => handleJobClick(job)}
                style={{ cursor: 'pointer' }}
              >
                <div>
                  <strong>{job.title}</strong>
                  <div style={{ fontSize: '0.9em', color: '#666', marginTop: '4px' }}>
                    <span>Status: {job.status}</span>
                    <span style={{ marginLeft: '15px' }}>Pay: {job.pay_nok} NOK</span>
                    {job.area_name && <span style={{ marginLeft: '15px' }}>Area: {job.area_name}</span>}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No jobs found.</p>
        )}
      </div>

      {/* ✅ Overlay Box */}
      {selectedJob && (
        <div className="overlay" onClick={closeOverlay}>
          <div className="overlay-box" onClick={(e) => e.stopPropagation()}>
            <button className="close-overlay" onClick={closeOverlay}>✖</button>
            <h2>{selectedJob.title}</h2>

            {/* Status Management */}
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Status:
              </label>
              <select
                value={selectedJob.status || ""}
                onChange={(e) => setSelectedJob({ ...selectedJob, status: e.target.value })}
                style={{
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  marginRight: '10px',
                  minWidth: '120px'
                }}
              >
                <option value="open">Open</option>
                <option value="assigned">Assigned</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button
                onClick={() => updateJobStatus(selectedJob.id, selectedJob.status || "")}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Update Status
              </button>
            </div>

            <p><strong>Job ID:</strong> {selectedJob.id}</p>
            <p><strong>Employer ID:</strong> {selectedJob.employer_id}</p>
            <p><strong>Pay:</strong> {selectedJob.pay_nok} NOK</p>
            <p><strong>Area:</strong> {selectedJob.area_name || "N/A"}</p>
            <p><strong>Created:</strong> {selectedJob.created_at ? new Date(selectedJob.created_at).toLocaleDateString() : "N/A"}</p>
          </div>
        </div>
      )}
    </section>
  );
}
