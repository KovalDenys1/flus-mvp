"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import React, { useEffect, useState, useCallback } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import "./page.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Home() {
  const supabase = getSupabaseBrowser();
  const colors = ["#007bff", "#ffcc00", "#ff0000"];

  // 12 months (keep your Norwegian short names if you like)
  const labels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      title: {
        display: true,
        text: "Stats Overview",
        font: { size: 16 },
      },
    },
    scales: { y: { beginAtZero: true } },
  };

  // helper: 12 zeros matching 12 labels
  const zero12 = () => Array.from({ length: 12 }, () => 0);

  const [userGraph, setUserGraph] = useState<ChartData<"line">>({
    labels,
    datasets: [
      {
        label: "Total Users",
        data: zero12(),
        borderColor: colors[0],
        backgroundColor: "rgba(0,123,255,0.3)",
        tension: 0.3,
      },
      {
        label: "Workers",
        data: zero12(),
        borderColor: colors[1],
        backgroundColor: "rgba(255,204,0,0.3)",
        tension: 0.3,
      },
      {
        label: "Employers",
        data: zero12(),
        borderColor: colors[2],
        backgroundColor: "rgba(0,255,0,0.3)",
        tension: 0.3,
      },
    ],
  });

  const [bedriftGraph, setBedriftGraph] = useState<ChartData<"line">>({
    labels,
    datasets: [
      {
        label: "Total Bedrift",
        data: zero12(),
        borderColor: colors[0],
        backgroundColor: "rgba(0,123,255,0.3)",
        tension: 0.3,
      },
      {
        label: "Risk",
        data: zero12(),
        borderColor: colors[1],
        backgroundColor: "rgba(255,204,0,0.3)",
        tension: 0.3,
      },
      {
        label: "Banned",
        data: zero12(),
        borderColor: colors[2],
        backgroundColor: "rgba(255,0,0,0.3)",
        tension: 0.3,
      },
    ],
  });

  const [logs, setLogs] = useState<string[]>([]);

  // 🧠 Fetch stats (current totals)
  const fetchStats = useCallback(async () => {
    // Users
    const { count: totalUsers } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    const { count: workerUsers } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("role", "worker");

    const { count: employerUsers } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("role", "employer");

    // Jobs - commented out as not currently used in graphs
    // const { count: _totalJobs } = await supabase
    //   .from("jobs")
    //   .select("*", { count: "exact", head: true });

    // const { count: _openJobs } = await supabase
    //   .from("jobs")
    //   .select("*", { count: "exact", head: true })
    //   .eq("status", "open");

    // const { count: _completedJobs } = await supabase
    //   .from("jobs")
    //   .select("*", { count: "exact", head: true })
    //   .eq("status", "completed");

    // Bedrift
    const { count: totalBedrift } = await supabase
      .from("bedrift")
      .select("*", { count: "exact", head: true });

    const { count: riskBedrift } = await supabase
      .from("bedrift")
      .select("*", { count: "exact", head: true })
      .eq("risk", true);

    const { count: bannedBedrift } = await supabase
      .from("bedrift")
      .select("*", { count: "exact", head: true })
      .eq("ban", true);

    // Update graphs (push one new point keeping length 12)
    setUserGraph((prev) => ({
      ...prev,
      datasets: [
        {
          ...prev.datasets[0],
          data: [...(prev.datasets[0].data as number[]).slice(1), totalUsers ?? 0],
        },
        {
          ...prev.datasets[1],
          data: [...(prev.datasets[1].data as number[]).slice(1), workerUsers ?? 0],
        },
        {
          ...prev.datasets[2],
          data: [...(prev.datasets[2].data as number[]).slice(1), employerUsers ?? 0],
        },
      ],
    }));

    setBedriftGraph((prev) => ({
      ...prev,
      datasets: [
        {
          ...prev.datasets[0],
          data: [...(prev.datasets[0].data as number[]).slice(1), totalBedrift ?? 0],
        },
        {
          ...prev.datasets[1],
          data: [...(prev.datasets[1].data as number[]).slice(1), riskBedrift ?? 0],
        },
        {
          ...prev.datasets[2],
          data: [...(prev.datasets[2].data as number[]).slice(1), bannedBedrift ?? 0],
        },
      ],
    }));
  }, [supabase]);

  // 🧠 Live updates
  useEffect(() => {
    // initial pull
    (async () => {
      await fetchStats();
    })();

    // Users Realtime
    const userChannel = supabase
      .channel("realtime:users")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "users" },
        (payload) => {
          const time = new Date().toLocaleTimeString();
          const data = (payload.new ?? {}) as Record<string, any>;
          const old = (payload.old ?? {}) as Record<string, any>;
          const name = data.navn ?? data.email ?? "Unknown user";

          let msg = "";
          if (payload.eventType === "INSERT") {
            msg = `🟩 [${time}] New user registered: ${name} (${data.role ?? 'no role'})`;
          } else if (payload.eventType === "UPDATE") {
            if (old?.role !== data?.role) {
              msg = `👤 [${time}] User role changed: ${name} → ${data.role}`;
            } else {
              msg = `� [${time}] User updated: ${name}`;
            }
          } else if (payload.eventType === "DELETE") {
            const removedName = old?.navn ?? old?.email ?? "Unknown user";
            msg = `❌ [${time}] User removed: ${removedName}`;
          }

          if (msg) setLogs((prev) => [msg, ...prev.slice(0, 49)]);
          void fetchStats();
        }
      )
      .subscribe();

    // Jobs Realtime
    const jobsChannel = supabase
      .channel("realtime:jobs")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "jobs" },
        (payload) => {
          const time = new Date().toLocaleTimeString();
          const data = (payload.new ?? {}) as Record<string, any>;
          const old = (payload.old ?? {}) as Record<string, any>;
          const title = data.title ?? "Unknown job";

          let msg = "";
          if (payload.eventType === "INSERT") {
            msg = `💼 [${time}] New job posted: ${title}`;
          } else if (payload.eventType === "UPDATE") {
            if (old?.status !== data?.status) {
              msg = `📋 [${time}] Job status changed: ${title} → ${data.status}`;
            } else {
              msg = `🔄 [${time}] Job updated: ${title}`;
            }
          } else if (payload.eventType === "DELETE") {
            const removedTitle = old?.title ?? "Unknown job";
            msg = `🗑️ [${time}] Job deleted: ${removedTitle}`;
          }

          if (msg) setLogs((prev) => [msg, ...prev.slice(0, 49)]);
          void fetchStats();
        }
      )
      .subscribe();

    // Bedrift Realtime
    const bedriftChannel = supabase
      .channel("realtime:bedrift")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bedrift" },
        (payload) => {
          const time = new Date().toLocaleTimeString();
          const data = (payload.new ?? {}) as Record<string, any>;
          const old = (payload.old ?? {}) as Record<string, any>;
          const navn = data.bedriftNavn ?? data.email ?? "Unknown bedrift";

          let msg = "";
          if (payload.eventType === "INSERT") {
            msg = `🏢 [${time}] New bedrift added: ${navn}`;
          } else if (payload.eventType === "UPDATE") {
            if (old?.ban !== data?.ban && data?.ban) {
              msg = `🚫 [${time}] Bedrift banned: ${navn}`;
            } else if (old?.risk !== data?.risk && data?.risk) {
              msg = `⚠️ [${time}] Bedrift marked as RISK: ${navn}`;
            } else {
              msg = `🟨 [${time}] Bedrift updated: ${navn}`;
            }
          } else if (payload.eventType === "DELETE") {
            const removedName = old?.bedriftNavn ?? old?.email ?? "Unknown bedrift";
            msg = `❌ [${time}] Bedrift deleted: ${removedName}`;
          }

          if (msg) setLogs((prev) => [msg, ...prev.slice(0, 49)]);
          void fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(userChannel);
      supabase.removeChannel(jobsChannel);
      supabase.removeChannel(bedriftChannel);
    };
  }, [fetchStats, supabase]);

  return (
    <section className="container">
      {/* HEADER */}
      <header className="header">
        {[
          { name: "Jobs �", link: "/admin/jobs", className: "jobs" },
          { name: "bedrift 🏬", link: "/admin/bedrift", className: "bedrift" },
          { name: "user 👥", link: "/admin/user", className: "user" },
          { name: "Make Admin 👑", link: "/admin/make-admin", className: "admin" },
          { name: "← Tilbake", link: "/", className: "back" },
        ].map((btn, i) => (
          <a href={btn.link} key={i}>
            <button className={btn.className}>{btn.name}</button>
          </a>
        ))}
      </header>

      {/* GRAPHS */}
      <section className="graph">
        <div className="graphCard">
          <h3 className="text-center font-bold">🏢 Bedrift Overview</h3>
          <Line data={bedriftGraph} options={options} />
        </div>
        <div className="graphCard">
          <h3 className="text-center font-bold">👥 User Overview</h3>
          <Line data={userGraph} options={options} />
        </div>
      </section>

      {/* LOGS */}
      <section className="logs">
        <h1>Live Logs</h1>
        <div className="logContainer">
          <ul className="logsUl">
            {logs.map((log, index) => (
              <li className="logsBox" key={index}>
                {log}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </section>
  );
}
