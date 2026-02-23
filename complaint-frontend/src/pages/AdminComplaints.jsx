import React, { useEffect, useState } from "react";
import { api } from "../utils/api";

export default function AdminComplaints() {
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const [statusById, setStatusById] = useState({});

  async function load() {
    setMsg("");
    setLoading(true);
    try {
      const data = await api.getAllComplaints();
      // If backend returns pageable shape, normalize:
      const list = Array.isArray(data) ? data : data?.content || [];
      setItems(list);
    } catch (err) {
      setMsg(` ${err.message} (Make sure you're logged in as ADMIN)`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id) {
    const newStatus = statusById[id];
    if (!newStatus) return;

    try {
      await api.updateStatus(id, { status: newStatus });
      setMsg(" Status updated");
      await load();
    } catch (err) {
      setMsg(`${err.message}`);
    }
  }

  return (
    <div>
      <h2>Admin Complaints</h2>
      <p style={{ color: "#666" }}>
        Requires JWT with <b>ROLE_ADMIN</b>. If you see 403, your token is not admin.
      </p>

      <button onClick={load} disabled={loading}>
        {loading ? "Loading..." : "Refresh"}
      </button>

      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}

      {!loading && items.length === 0 && <p>No complaints found.</p>}

      <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
        {items.map((c) => (
          <div key={c.id || c.ticketNo} style={{ border: "1px solid #ddd", padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div><b>ID:</b> {c.id ?? "N/A"}</div>
                <div><b>Ticket:</b> {c.ticketNo ?? "N/A"}</div>
                <div><b>Name:</b> {c.name ?? c.customerName ?? "N/A"}</div>
                <div><b>Email:</b> {c.email ?? "N/A"}</div>
                <div><b>Category:</b> {c.category ?? "N/A"}</div>
                <div><b>Status:</b> {c.status ?? "N/A"}</div>
              </div>

              <div style={{ minWidth: 220 }}>
                <select
                  value={statusById[c.id] || ""}
                  onChange={(e) => setStatusById((p) => ({ ...p, [c.id]: e.target.value }))}
                  style={{ width: "100%" }}
                >
                  <option value="">Select status</option>
                  <option value="OPEN">OPEN</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
                <button style={{ width: "100%", marginTop: 8 }} onClick={() => updateStatus(c.id)}>
                  Update
                </button>
              </div>
            </div>

            {c.description && (
              <div style={{ marginTop: 10, color: "#444" }}>
                <b>Description:</b> {c.description}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}