import "./page.css";

export default function SettingsPage() {
  return (
    <section className="screen">
      
      

      {/* Sidebar */}
      <section className="sideBar">
        <div className="sidebarBtn">
          <button className="closeBtn">
          </button>
        </div>
        <ul>
          <li>Dashboard</li>
        <li> <a href="../../setting/users">Users</a> </li>
          <li className="active">Settings</li>
          <li>Logs</li>
        </ul>
      </section>

      {/* Main Settings Page */}
      <section className="mainPage">
        <h1 className="title">Admin Settings</h1>

        <div className="settings-container">
          {/* Profile Settings */}
          <div className="settings-card">
            <h2>Profile</h2>
            <label>Admin Name</label>
            <input type="text" placeholder="John Doe" />
            <label>Email</label>
            <input type="email" placeholder="admin@example.com" />
            <button className="saveBtn">Save Changes</button>
          </div>

          {/* System Settings */}
          <div className="settings-card">
            <h2>System</h2>
            <label>Theme</label>
            <select>
              <option>Light</option>
              <option>Dark</option>
              <option>Auto</option>
            </select>

            <label>Language</label>
            <select>
              <option>norsk</option>
              <option>English</option>
              <option>French</option>
            </select>

            <button className="saveBtn">Apply</button>
          </div>

          {/* Security Settings */}
          <div className="settings-card">
            <h2>Security</h2>
            <label>Change Password</label>
            <input type="password" placeholder="New Password" />
            <label>Confirm Password</label>
            <input type="password" placeholder="Confirm Password" />
            <button className="saveBtn">Update Password</button>
          </div>
        </div>
      </section>
    </section>
  );
}
