import React, { useEffect, useState } from "react";
import Side       from "./Side";
import AdminNav   from "./AdminNav";
import StaffNav from "./StaffNav";
import StaffSide from "./StaffSide";

/* -------------- helpers -------------- */
const shiftIcon = (s) =>
  s === "morning" ? "🌅" :
  s === "evening" ? "🌆" :
  s === "night"   ? "🌙" : "🕒";

const statusBadge = (status) => {
  const base = {
    borderRadius: "6px",
    padding: "4px 10px",
    fontWeight: "bold",
    fontSize: "14px",
    display: "inline-block",
  };
  if (status === "approved" || status === 1) {
    return { ...base, background: "#d1fae5", color: "#065f46" };
  }
  if (status === "rejected" || status === 2) {
    return { ...base, background: "#fee2e2", color: "#991b1b" };
  }
  /* pending */
  return { ...base, background: "#fef9c3", color: "#92400e" };
};

export default function ShiftView() {
  const [shiftList, setShiftList] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");

  const auth = JSON.parse(localStorage.getItem("user")); // must contain regid

  /* fetch on mount */
  useEffect(() => {
    fetch("http://localhost:5000/demo/shiftview", {
      method : "POST",
      headers: { "Content-Type": "application/json" },
      body   : JSON.stringify({ staffId: auth.regid }),
    })
      .then((r) => r.json())
      .then((data) => setShiftList(Array.isArray(data) ? data : [data]))
      .catch(() => setError("Failed to load shift records"))
      .finally(() => setLoading(false));
  }, [auth.regid]);

  /* render */
  return (
    <>
      <div className="container-xxl position-relative bg-white d-flex p-0">
            <StaffSide />
            <div className="content">
              <StaffNav />
          <h3 style={{ marginTop: "2rem" }}>📄 My Shift Requests</h3>

          {loading ? (
            <p style={{ textAlign: "center", marginTop: "1rem" }}>Loading…</p>
          ) : error ? (
            <p style={{ color: "red", textAlign: "center", marginTop: "1rem" }}>{error}</p>
          ) : shiftList.length === 0 ? (
            <p style={{ textAlign: "center", marginTop: "1rem", color: "#888" }}>
              No shift requests yet.
            </p>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                marginTop: "1rem",
              }}
            >
              {shiftList.map((item) => (
                <div
                  key={item._id}
                  style={{
                    border: "2px solid #eee",
                    borderRadius: "10px",
                    padding: "1rem",
                    background: "#fafafa",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                >
                  {/* Row 1: icons + status */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "12px",
                    }}
                  >
                    <div style={{ fontSize: "24px" }}>
                      {shiftIcon(item.newShift)} {shiftIcon(item.currentShift)}
                    </div>
                    <span style={statusBadge(item.status)}>
                      {item.status === 0 ? "pending" : item.status}
                    </span>
                  </div>

                  {/* Current / Requested */}
                  <div style={{ marginBottom: "8px" }}>
                    <label style={{ fontWeight: "bold", width: "150px", display: "inline-block" }}>
                      From:
                    </label>
                    <span style={{ textTransform: "capitalize" }}>{item.currentShift}</span>
                  </div>
                  <div style={{ marginBottom: "8px" }}>
                    <label style={{ fontWeight: "bold", width: "150px", display: "inline-block" }}>
                      To:
                    </label>
                    <span style={{ textTransform: "capitalize" }}>{item.newShift}</span>
                  </div>

                  {/* Reason */}
                  <div style={{ marginBottom: "8px" }}>
                    <label style={{ fontWeight: "bold", width: "150px", display: "inline-block" }}>
                      Reason:
                    </label>
                    <span>{item.reason}</span>
                  </div>

                  {/* Date */}
                  {item.date && (
                    <div style={{ fontSize: "12px", color: "#666", textAlign: "right" }}>
                      {new Date(item.date).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
