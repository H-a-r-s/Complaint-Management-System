import React, { useState } from "react";
import { api } from "../utils/api";

export default function TrackComplaint() {
  const [ticketNo, setTicketNo] = useState("");
  const [data, setData] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function onTrack(e) {
    e.preventDefault();
    setMsg("");
    setData(null);
    setLoading(true);
    try {
      const res = await api.trackComplaint(ticketNo.trim());
      setData(res);
    } catch (err) {
      setMsg(` ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Track Complaint</h2>

      <form onSubmit={onTrack} style={{ display: "flex", gap: 8, maxWidth: 600 }}>
        <input
          placeholder="Enter Ticket No"
          value={ticketNo}
          onChange={(e) => setTicketNo(e.target.value)}
          required
          style={{ flex: 1 }}
        />
        <button disabled={loading}>{loading ? "Checking..." : "Track"}</button>
      </form>

      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}

      {data && (
        <div style={{ marginTop: 12, padding: 12, border: "1px solid #ddd" }}>
          <h4>Complaint Status</h4>
          <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
