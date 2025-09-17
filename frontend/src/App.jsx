import React, { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import AddUserForm from "./components/AddUserForm";
import AdminDashboard from "./components/AdminDashboard";
import axios from "axios";
const API_BASE = "http://localhost:5000";

function App() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async (q = "") => {
    try {
      const res = await axios.get(`${API_BASE}/api/users`, { params: { q } });
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("Fetch users error", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const addUserToList = (user) => {
    setUsers((prev) => [user, ...prev]);
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>MERN Real-time User Management</h1>

      <div style={{ display: "flex", gap: 40, alignItems: "flex-start" }}>
        <div style={{ flex: 1, maxWidth: 420 }}>
          <h2>Add user</h2>
          <AddUserForm apiBase={API_BASE} onUserAdded={addUserToList} />
        </div>

        <div style={{ flex: 2 }}>
          <h2>Admin dashboard</h2>
          <AdminDashboard
            apiBase={API_BASE}
            users={users}
            onSearch={fetchUsers}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
