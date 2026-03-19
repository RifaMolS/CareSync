import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Side from "./Side";
import AdminNav from "./AdminNav";

/* ---------- helpers ---------- */
const badgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "6px 12px",
  fontSize: "14px",
  fontWeight: "600",
  borderRadius: "999px",
  textTransform: "capitalize",
};

const shiftBadge = (shift) => {
  const bgColors = {
    morning: "#DBEAFE",
    evening: "#FDE68A",
    night: "#E0E7FF",
  };
  const emoji =
    shift === "morning"
      ? "🌅"
      : shift === "evening"
      ? "🌆"
      : shift === "night"
      ? "🌙"
      : "🕒";

  return (
    <span
      style={{
        ...badgeStyle,
        backgroundColor: bgColors[shift] || "#E5E7EB",
      }}
    >
      {emoji} {shift}
    </span>
  );
};

const statusBadge = (status) => {
  const base = {
    ...badgeStyle,
    color: "#111827",
  };

  if (status === "approved" || status === 1)
    return (
      <span style={{ ...base, backgroundColor: "#D1FAE5", color: "#065F46" }}>
        ✅ Approved
      </span>
    );
  if (status === "rejected" || status === 2)
    return (
      <span style={{ ...base, backgroundColor: "#FECACA", color: "#991B1B" }}>
        ❌ Rejected
      </span>
    );
  return (
    <span style={{ ...base, backgroundColor: "#FEF3C7", color: "#92400E" }}>
      ⏳ Pending
    </span>
  );
};

export default function StaffShift() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRows = () => {
    setLoading(true);
    fetch("http://localhost:5000/demo/shiftview")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setRows(data);
        else if (Array.isArray(data.requests)) setRows(data.requests);
        else if (Array.isArray(data.data)) setRows(data.data);
        else setError("Unexpected response format.");
      })
      .catch(() => setError("Failed to load requests"))
      .finally(() => setLoading(false));
  };

  useEffect(loadRows, []);

  const updateStatus = (id, status) => {
    fetch("http://localhost:5000/demo/updateStatus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    })
      .then((res) => res.json())
      .then(loadRows)
      .catch(() => alert("⚠️ Could not update status"));
  };

  const containerStyle = {
    backgroundColor: "#F9FAFB",
    padding: "24px",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', sans-serif",
  };

  const cardStyle = {
    backgroundColor: "#fff",
    padding: "20px",
    marginBottom: "16px",
    borderRadius: "16px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
    transition: "transform 0.2s ease",
  };

  const labelStyle = {
    fontWeight: "600",
    color: "#4B5563",
    marginBottom: "4px",
  };

  const buttonStyle = (bgColor, hoverColor, disabled) => ({
    padding: "8px 16px",
    margin: "0 6px",
    backgroundColor: disabled ? "#E5E7EB" : bgColor,
    color: disabled ? "#9CA3AF" : "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.3s ease",
  });

  return (
    <div className="container-xxl position-relative bg-white d-flex p-0">
      <Side />
      <div className="content w-100">
        <AdminNav />
        <div style={containerStyle}>
          <h2
            style={{
              fontSize: "26px",
              color: "#6D28D9",
              fontWeight: "700",
              textAlign: "center",
              marginBottom: "24px",
            }}
          >
            🗂️ Shift‑Change Requests
          </h2>

          {loading ? (
            <p style={{ textAlign: "center", padding: "40px" }}>⌛ Loading…</p>
          ) : error ? (
            <p style={{ textAlign: "center", color: "red" }}>{error}</p>
          ) : rows.length === 0 ? (
            <p style={{ textAlign: "center", color: "#6B7280" }}>
              No requests found.
            </p>
          ) : (
            rows.map((row) => (
              <motion.div
                key={row._id}
                whileHover={{ scale: 1.01 }}
                style={cardStyle}
              >
                <div style={{ marginBottom: "12px" }}>
                  <div style={labelStyle}>👤 Staff</div>
                  <div style={{ fontWeight: "bold", fontSize: "16px" }}>
                    {row?.staffId?.name || "Unknown Staff"}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                    marginBottom: "12px",
                  }}
                >
                  <div>
                    <div style={labelStyle}>🕒 Current</div>
                    {shiftBadge(row.currentShift)}
                  </div>
                  <div>
                    <div style={labelStyle}>🔄 Requested</div>
                    {shiftBadge(row.newShift)}
                  </div>
                </div>

                <div style={{ marginBottom: "12px" }}>
                  <div style={labelStyle}>📝 Reason</div>
                  <div style={{ color: "#374151" }}>{row.reason}</div>
                </div>

                <div style={{ marginBottom: "12px" }}>
                  <div style={labelStyle}>📌 Status</div>
                  {statusBadge(row.currentstatus)}
                </div>

                <div style={{ textAlign: "right" }}>
                  {row.currentstatus === "approved" || row.currentstatus === 1 ? (
                    <motion.button
                      style={buttonStyle("#D1FAE5", "#D1FAE5", true)}
                      disabled
                    >
                      ✅ Approved
                    </motion.button>
                  ) : row.currentstatus === "rejected" || row.currentstatus === 2 ? (
                    <motion.button
                      style={buttonStyle("#FECACA", "#FECACA", true)}
                      disabled
                    >
                      ❌ Rejected
                    </motion.button>
                  ) : (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={buttonStyle("#10B981", "#059669", false)}
                        onClick={() => updateStatus(row._id, "approved")}
                      >
                        ✅ Approve
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={buttonStyle("#EF4444", "#DC2626", false)}
                        onClick={() => updateStatus(row._id, "rejected")}
                      >
                        ❌ Reject
                      </motion.button>
                    </>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
