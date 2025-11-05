"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient"; // sjekk at path stemmer
import "./page.css";

export default function AdminPage() {
  const [view, setView] = useState<"bedrift" | "risk" | "banned">("bedrift");
  const [bedrifter, setBedrifter] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (view === "bedrift") fetchBedrifter();
  }, [view]);

  async function fetchBedrifter() {
    setLoading(true);

    const { data, error } = await supabase
      .from("bedrift")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Feil ved henting:", error);
    } else {
      setBedrifter(data || []);
    }
    setLoading(false);
  }

  return (
    <section className="admin-page">
      <a href="../" target="_blank">
        <button className="exit">X</button>
      </a>

      {/* Top buttons */}
      <div className="top-buttons">
        <button
          className={view === "bedrift" ? "active" : ""}
          onClick={() => setView("bedrift")}
        >
          Bedrift
        </button>
        <button
          className={view === "risk" ? "active" : ""}
          onClick={() => setView("risk")}
        >
          Risk
        </button>
        <button
          className={view === "banned" ? "active" : ""}
          onClick={() => setView("banned")}
        >
          Banned
        </button>
      </div>

      {/* Section content */}
      <div className="section-content">
        {view === "bedrift" && (
          <div>
            <h2>Registrerte bedrifter</h2>
            {loading ? (
              <p>Laster...</p>
            ) : bedrifter.length === 0 ? (
              <p>Ingen bedrifter funnet</p>
            ) : (
              <ul className="bedriftUL">
                {bedrifter.map((b) => (
                  <li className="bedriftList" key={b.id}>
                    <div>
                      <strong>{b.bedriftNavn}</strong>
                      <br />
                      <small className="text">
                        Org.nr: {b.organisasjonsnummer || "—"} <br />
                        Kontakt: {b.kontaktperson || "—"} <br />
                        E-post: {b.email || "—"} <br />
                        Telefon: {b.telefon || "—"}
                      </small>
                    </div>
                    <div className="buttoncheck">
                      <button className="check">✅</button>
                      <button className="wrong">❌</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {view === "risk" && (
          <div>
            <h2>Risky Companies</h2>
            <p>(Koble til tabell senere)</p>
          </div>
        )}

        {view === "banned" && (
          <div>
            <h2>Banned Companies</h2>
            <p>(Koble til tabell senere)</p>
          </div>
        )}
      </div>
    </section>
  );
}
