"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "./page.css";

interface Worker {
  navn: string;
  score?: number; // optional if you add a ranking metric later
}

export default function Leaderboard() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkers = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("worker_statistics")
        .select("navn");

      if (error) {
        console.error("❌ Error fetching leaderboard:", error);
      } else {
        // You can simulate scores for now (or replace this with your real data)
        const withScores = (data || []).map((w, i) => ({
          ...w,
          score: Math.floor(Math.random() * 1000),
        }));

        // Sort by score descending
        const sorted = withScores.sort((a, b) => b.score! - a.score!);
        setWorkers(sorted);
      }
      setLoading(false);
    };

    fetchWorkers();
  }, []);

  return (
    <section className="leaderboard-container">
      <a href="../" target="_blank">
        <button className="exit-btn">✖</button>
      </a>

      <h1 className="leaderboard-title">🏆 Leaderboard</h1>

      {loading ? (
        <p className="loading">Loading leaderboard...</p>
      ) : workers.length > 0 ? (
        <ul className="leaderboard-list">
          {workers.map((worker, index) => (
            <li
              key={index}
              className={`leaderboard-item ${
                index === 0
                  ? "gold"
                  : index === 1
                  ? "silver"
                  : index === 2
                  ? "bronze"
                  : ""
              }`}
            >
              <span className="rank">#{index + 1}</span>
              <span className="name">{worker.navn}</span>
              <span className="score">{worker.score}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-data">No leaderboard data found.</p>
      )}
    </section>
  );
}
