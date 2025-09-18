import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

const AdminDashboard = ({ apiBase, users, onSearch }) => {
  const [query, setQuery] = useState("");
  const [toasts, setToasts] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(apiBase, { transports: ["websocket", "polling"] });

    socketRef.current.on("connect", () => {
      console.log("Socket connected", socketRef.current.id);
    });

    socketRef.current.on("userAdded", (user) => {
      setToasts((prev) => [
        { id: user._id, text: `New user: ${user.name} (${user.email})` },
        ...prev,
      ]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [apiBase]);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div>
      <form onSubmit={handleSearch} style={{ marginBottom: 12 }}>
        <input
          placeholder="Search name, email or role"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <div style={{ marginBottom: 12 }}>
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              background: "#111",
              color: "#fff",
              padding: 8,
              marginBottom: 6,
              borderRadius: 6,
            }}
          >
            {t.text}
          </div>
        ))}
      </div>

      <h3>Users</h3>
      <table
        border="1"
        cellPadding="8"
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 && (
            <tr>
              <td colSpan="4">No users</td>
            </tr>
          )}
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{new Date(u.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
