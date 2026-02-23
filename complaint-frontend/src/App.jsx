import React from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import Login from "./pages/Login.jsx";
import CreateComplaint from "./pages/CreateComplaint.jsx";
import TrackComplaint from "./pages/TrackComplaint.jsx";
import AdminComplaints from "./pages/AdminComplaints.jsx";
import { getToken, logout } from "./utils/auth.js";

function Nav() {
  const token = getToken();

  return (
    <div style={{ padding: 12, borderBottom: "1px solid #ddd", display: "flex", gap: 12 }}>
      <Link to="/">Create Complaint</Link>
      <Link to="/track">Track</Link>
      <Link to="/admin">Admin</Link>
      <div style={{ marginLeft: "auto" }}>
        {token ? (
          <button onClick={logout}>Logout</button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  // This only checks token presence; actual role enforcement happens in gateway.
  const token = getToken();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <div>
      <Nav />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
        <Routes>
          <Route path="/" element={<CreateComplaint />} />
          <Route path="/track" element={<TrackComplaint />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminComplaints />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}