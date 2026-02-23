import React, { useState } from "react";
import { api } from "../utils/api";
import { setToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      // IMPORTANT: Adjust keys if your auth-service uses username instead of email
      const data = await api.login({ email, password });

      // Try common response shapes:
      const token =
        data?.token ||
        data?.accessToken ||
        data?.jwt ||
        (typeof data === "string" ? data : null);

      if (!token) throw new Error("Token not found in login response. Adjust frontend mapping.");

      setToken(token);
      setMsg("Login successful ✅");
      nav("/admin");
    } catch (err) {
      setMsg(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <p style={{ color: "#666" }}>
        Login to access <b>Admin</b> endpoints (requires ROLE_ADMIN on token).
      </p>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10, maxWidth: 420 }}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
      </form>

      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
    </div>
  );
}