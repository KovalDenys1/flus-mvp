"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./page.css";

type Ticket = {
  id: string;
  worker_id: string | null;
  subject: string | null;
  message: string | null;
  category: string | null;
  status: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export default function ReportsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();

    const channel = supabase
      .channel("support_tickets_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "support_tickets" },
        () => fetchTickets()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchTickets() {
    setLoading(true);
    const { data, error } = await supabase
      .from("support_tickets")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error("Error fetching tickets:", error);
    else setTickets(data || []);
    setLoading(false);
  }

  return (
    <div className="rapport-container">
      <h1>Support Rapport</h1>

      {loading ? (
        <p>Loading tickets...</p>
      ) : tickets.length === 0 ? (
        <p>No support tickets yet.</p>
      ) : (
        <table className="rapport-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Category</th>
              <th>Status</th>
              <th>Notes</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>{ticket.id}</td>
                <td>{ticket.subject || "—"}</td>
                <td>{ticket.message || "—"}</td>
                <td>{ticket.category || "General"}</td>
                <td className={`status ${ticket.status?.toLowerCase() || "unknown"}`}>
                  {ticket.status || "Unknown"}
                </td>
                <td>{ticket.notes || "—"}</td>
                <td>{new Date(ticket.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
