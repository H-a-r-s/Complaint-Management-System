import React, { useState } from "react";
import { api } from "../utils/api";

export default function CreateComplaint() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("General");
  const [description, setDescription] = useState("");

  const [result, setResult] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");
    setResult(null);
    setLoading(true);

    try {
      // Adjust payload keys if your complaint-service DTO differs
      const payload = {
        name,
        email,
        category,
        description,
      };

      const data = await api.createComplaint(payload);
      setResult(data);
      setMsg(" Complaint submitted!");
    } catch (err) {
      setMsg(` ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Create Complaint</h2>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10, maxWidth: 600 }}>
        <input placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>General</option>
          <option>Billing</option>
          <option>Service</option>
          <option>Technical</option>
          <option>Other</option>
        </select>
        <textarea
          placeholder="Complaint Description"
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button disabled={loading}>{loading ? "Submitting..." : "Submit"}</button>
      </form>

      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}

      {result && (
        <div style={{ marginTop: 12, padding: 12, border: "1px solid #ddd" }}>
          <h4>Server Response</h4>
          <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(result, null, 2)}</pre>
          <p style={{ color: "#666" }}>
            Copy your <b>ticketNo</b> from response and track it in the Track page.
          </p>
        </div>
      )}
    </div>
  );
}