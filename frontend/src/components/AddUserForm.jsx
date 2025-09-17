import React, { useState } from "react";
import axios from "axios";
const AddUserForm = ({ apiBase, onUserAdded }) => {
  const [form, setForm] = useState({ name: "", email: "", role: "user" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${apiBase}/api/users`, form);
      const user = res.data.user;
      onUserAdded(user);
      setForm({ name: "", email: "", role: "user" });
      alert("User created (real-time event emitted).");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Error creating user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={submit} style={{ display: "grid", gap: 8 }}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          type="email"
        />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="user">user</option>
          <option value="admin">admin</option>
          <option value="manager">manager</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Add User"}
        </button>
        {error && <div style={{ color: "red" }}>{error}</div>}
      </form>
    </div>
  );
};

export default AddUserForm;
