"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "../../lib/supabaseClient";
import Link from "next/link";
import "./page.css";

interface User {
  id: string; // text id
  navn: string;
  role: string;
}

const availableRoles = ["worker", "employer", "mod", "admin"];

export default function UserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);
  const dropdownRefs = useRef<(HTMLDivElement | null)[]>([]);

  // ✅ Fetch users from Supabase
  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("users")
      .select("id, navn, role");

    if (error) console.error("Error fetching users:", error);
    else setUsers(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        openDropdownIndex !== null &&
        dropdownRefs.current[openDropdownIndex] &&
        !dropdownRefs.current[openDropdownIndex]?.contains(e.target as Node)
      ) {
        setOpenDropdownIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdownIndex]);

  const filteredUsers = users.filter((user) =>
    user.navn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ Save role change to Supabase
  const handleRoleChange = async (index: number, newRole: string) => {
    const userToUpdate = users[index];

    const { error } = await supabase
      .from("users")
      .update({ role: newRole })
      .eq("id", userToUpdate.id); // 👈 use text id

    if (error) {
      console.error("Error updating role:", error);
      alert("⚠️ Could not update role. See console.");
      return;
    }

    // Update local UI instantly
    const updatedUsers = [...users];
    updatedUsers[index].role = newRole;
    setUsers(updatedUsers);
    setOpenDropdownIndex(null);
  };

  const toggleDropdown = (index: number) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };

  return (
    <section className="screen">
      <aside className="sideBar">
        <div className="sidebarBtn">
          <button className="closeBtn">
            <i id="close" className="fi fi-sr-sidebar"></i>
          </button>
        </div>
        <ul>
          <li>Dashboard</li>
          <li className="active">Users</li>
          <li>
            <Link href="../../setting">Settings</Link>
          </li>
          <li>Logs</li>
        </ul>
      </aside>

      <main className="mainPage">
        <div className="user-container">
          <h1 className="containerList">User Roles</h1>

          <div className="search">
            <input
              type="search"
              placeholder="🔎 Search user by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading ? (
            <p className="loadingText">Loading users...</p>
          ) : filteredUsers.length > 0 ? (
            <ul className="userUl">
              {filteredUsers.map((user, index) => (
                <li className="userListItem" key={user.id}>
                  <div className="userInfo">
                    <strong>{user.navn}</strong>
                  </div>

                  <div className="roles" ref={(el) => { dropdownRefs.current[index] = el; }}
>
                    <span className="roleTxt">Role:</span>
                    <div className="dropdownContainer">
                      <button
                        className="roleButton"
                        onClick={() => toggleDropdown(index)}
                      >
                        {user.role || "No role"} <span className="arrow">▼</span>
                      </button>

                      {/* ✅ Dropdown always available for all roles */}
                      {openDropdownIndex === index && (
                        <ul className="dropdownMenu">
                          {availableRoles.map((role) => (
                            <li
                              key={role}
                              className={`dropdownItem ${
                                role === user.role ? "activeRole" : ""
                              }`}
                              onClick={() => handleRoleChange(index, role)}
                            >
                              {role}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="emptyText">No users found.</p>
          )}
        </div>
      </main>
    </section>
  );
}
