"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import Link from "next/link";
import "./page.css";

interface User {
  id: string;
  navn: string;
  role: string;
  email?: string;
  telefon?: string;
  kommune?: string;
  bio?: string;
  birth_year?: number;
}

type ViewType = "user" | "risk" | "banned";

export default function AdminPage() {
  const supabase = getSupabaseBrowser();
  const [view, setView] = useState<ViewType>("user");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // ✅ Update user role
  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from("users")
        .update({ role: newRole })
        .eq("id", userId);

      if (error) {
        console.error("Error updating user role:", error);
        alert("Failed to update user role");
        return;
      }

      // Update local state
      setUsers(prev => prev.map(user =>
        user.id === userId ? { ...user, role: newRole } : user
      ));

      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({ ...selectedUser, role: newRole });
      }

      alert("User role updated successfully!");
    } catch (error) {
      console.error("Exception updating user role:", error);
      alert("Failed to update user role");
    }
  };

  const riskyCompanies = ["user827197829", "user76321623"];
  const bannedCompanies = ["user812973"];

  // ✅ Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select("id, navn, role, email, telefon, kommune, bio, birth_year");

      if (error) {
        console.error("Error fetching users:", error);
      } else {
        setUsers(data || []);
      }
      setLoading(false);
    };

    fetchUsers();
  }, [supabase]);

  // ✅ Filter users by name
  const filteredUsers = users.filter((user) =>
    user.navn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ When clicking a user, fetch full details
  const handleUserClick = async (user: User) => {
    const { data, error } = await supabase
      .from("users")
      .select("id, navn, email, telefon, kommune, bio, birth_year, role")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Supabase user fetch error:", error);
      alert("Could not load user details.");
      return;
    }

    setSelectedUser(data);
  };

  // ✅ Close overlay
  const closeOverlay = () => setSelectedUser(null);

  return (
    <section className="admin-page">
      {/* Top buttons */}
      <div className="top-buttons">
        <button
          className={view === "user" ? "active" : ""}
          onClick={() => setView("user")}
        >
          User
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

      {/* Section Content */}
      <div className="section-content">
        {view === "user" && (
          <div className="users">
            <Link href="/admin">
              <button className="exit">X</button>
            </Link>

            <div className="search">
              <input
                id="search"
                type="search"
                placeholder="Search user by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <h2>Users & Roles</h2>

            {loading ? (
              <p>Loading users...</p>
            ) : filteredUsers.length > 0 ? (
              <ul className="userUl">
                {filteredUsers.map((user) => (
                  <li
                    key={user.id}
                    className="userList"
                    onClick={() => handleUserClick(user)}
                  >
                    <strong>{user.navn}</strong>
                    <div className="roles">
                      <span className="roleTxt">rolle:</span>
                      <span className="switch">{user.role || "No role"}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No users found.</p>
            )}
          </div>
        )}

        {view === "risk" && (
          <div>
            <h2>Risky Companies</h2>
            <ul>
              {riskyCompanies.map((company) => (
                <li className="userList" key={company}>
                  {company}
                  <div className="buttoncheck">
                    <button className="check">✅</button>
                    <button className="wrong">❌</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {view === "banned" && (
          <div>
            <h2>Banned Companies</h2>
            <ul>
              {bannedCompanies.map((company) => (
                <li className="userList" key={company}>
                  {company}
                  <div className="buttoncheck">
                    <button className="check">✅</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* ✅ Overlay Box */}
      {selectedUser && (
        <div className="overlay" onClick={closeOverlay}>
          <div className="overlay-box" onClick={(e) => e.stopPropagation()}>
            <button className="close-overlay" onClick={closeOverlay}>✖</button>
            <h2>{selectedUser.navn}</h2>

            {/* Role Management */}
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Role:
              </label>
              <select
                value={selectedUser.role || ""}
                onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                style={{
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  marginRight: '10px',
                  minWidth: '120px'
                }}
              >
                <option value="">No role</option>
                <option value="worker">Worker</option>
                <option value="employer">Employer</option>
                <option value="admin">Admin</option>
              </select>
              <button
                onClick={() => updateUserRole(selectedUser.id, selectedUser.role || "")}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Update Role
              </button>
            </div>

            <p><strong>Email:</strong> {selectedUser.email || "N/A"}</p>
            <p><strong>Telefon:</strong> {selectedUser.telefon || "N/A"}</p>
            <p><strong>Kommune:</strong> {selectedUser.kommune || "N/A"}</p>
            <p><strong>Birth Year:</strong> {selectedUser.birth_year || "N/A"}</p>
            <p><strong>Bio:</strong> {selectedUser.bio || "No bio provided"}</p>
          </div>
        </div>
      )}
    </section>
  );
}
