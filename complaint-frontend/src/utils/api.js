import { getToken } from "./auth";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  const data = isJson ? await res.json().catch(() => null) : await res.text().catch(() => "");

  if (!res.ok) {
    const msg =
      (data && (data.message || data.error)) ||
      (typeof data === "string" && data) ||
      `Request failed (${res.status})`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const api = {
  // Auth (adjust endpoint names if yours differ)
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),

  // Complaint (based on your complaint-service)
  createComplaint: (payload) => request("/complaints", { method: "POST", body: payload }),
  trackComplaint: (ticketNo) => request(`/complaints/track/${encodeURIComponent(ticketNo)}`),

  // Admin
  getAllComplaints: () => request("/admin/complaints", { auth: true }),
  updateStatus: (id, payload) =>
    request(`/admin/complaints/${encodeURIComponent(id)}/status`, {
      method: "PATCH",
      body: payload,
      auth: true,
    }),
};