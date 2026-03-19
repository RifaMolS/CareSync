import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StaffSide from "./StaffSide";
import StaffNav from "./StaffNav";

export default function MyShift() {
  const [shiftData, setShiftData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedShift, setSelectedShift] = useState("evening");
  const [reason, setReason] = useState("");

  const auth = JSON.parse(localStorage.getItem("user"));

  const statusLabel = (val) => {
    switch (val) {
      case 0:
      case "pending":
        return "⏳ Pending";
      case 1:
      case "approved":
        return "✅ Approved";
      case 2:
      case "rejected":
        return "❌ Rejected";
      default:
        return val ?? "⏳ Pending";
    }
  };

  const fetchShiftData = () => {
    setLoading(true);
    fetch("http://localhost:5000/demo/staffidview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ auth: auth.regid }),
    })
      .then((res) => res.json())
      .then((data) => {
        setShiftData(data);
        setSelectedShift(
          ["morning", "evening", "night"].find(
            (s) => s !== (data.shift || data.currentShift)
          ) || "evening"
        );
      })
      .catch(() => setError("Failed to load shift data."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (auth?.regid) {
      fetchShiftData();
    } else {
      setError("User authentication failed.");
      setLoading(false);
    }
  }, [auth?.regid]);

  const currentShift = (() => {
    const s = shiftData?.shift || shiftData?.currentShift;
    return ["morning", "evening", "night"].includes(s) ? s : "morning";
  })();

  const currentStatus = (() => {
    const s = shiftData?.status || shiftData?.currentstatus;
    return ["pending", "approved", "rejected"].includes(s) ? s : "pending";
  })();

  const getShiftIcon = (shift) => {
    switch (shift) {
      case "morning":
        return "🌅";
      case "evening":
        return "🌆";
      case "night":
        return "🌙";
      default:
        return "🕒";
    }
  };

  const getStatusColorStyle = (status) => {
    switch (status) {
      case "pending":
      case 0:
        return { backgroundColor: "#FEF3C7", color: "#92400E" }; // yellow bg + text
      case "approved":
      case 1:
        return { backgroundColor: "#D1FAE5", color: "#065F46" }; // green bg + text
      case "rejected":
      case 2:
        return { backgroundColor: "#FEE2E2", color: "#991B1B" }; // red bg + text
      default:
        return { backgroundColor: "#F3F4F6", color: "#374151" }; // gray bg + text
    }
  };

  const handleRequest = () => {
    if (!shiftData) return;
    if (selectedShift === currentShift) {
      alert("Please select a different shift to request a change.");
      return;
    }

    const payload = {
      staffId: auth.regid,
      currentShift: currentShift,
      newShift: selectedShift,
      reason,
      status: "pending",
    };

    fetch("http://localhost:5000/demo/shift", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then(() => {
        alert("✅ Shift-change request sent!");
        setShowModal(false);
        setReason("");
        setSelectedShift("evening");
        fetchShiftData();
      })
      .catch(() => alert("Failed to submit request 😢"));
  };

  // Inline styles for reusable parts:
  const containerStyle = {
    maxWidth: "1024px",
    margin: "0 auto",
  };

  const boxStyle = {
    backgroundColor: "#fff",
    borderRadius: "1.5rem",
    padding: "1.5rem",
    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
    border: "1px solid #e5e7eb",
  };

  const flexBetweenStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1rem",
    backgroundColor: "#f9fafb",
    padding: "1rem",
    borderRadius: "1rem",
    flexWrap: "wrap",
  };

  const iconCircleStyle = {
    padding: "0.75rem",
    borderRadius: "9999px",
    backgroundColor: "#bfdbfe",
    color: "#1e40af",
    fontSize: "1.25rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const btnPrimaryStyle = {
    backgroundColor: "#6b21a8",
    color: "#fff",
    padding: "0.75rem 1.25rem",
    borderRadius: "1rem",
    fontWeight: "600",
    boxShadow: "0 4px 6px -1px rgba(107,33,168,0.7), 0 2px 4px -2px rgba(107,33,168,0.6)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    border: "none",
    width: "100%",
    maxWidth: "200px",
    transition: "background-color 0.3s ease",
  };

  const btnPrimaryHoverStyle = {
    backgroundColor: "#581c87",
  };

  const modalBackdropStyle = {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    backdropFilter: "blur(5px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
    padding: "1rem",
  };

  const modalBoxStyle = {
    backgroundColor: "#fff",
    borderRadius: "1.25rem",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    overflow: "hidden",
  };

  const modalHeaderStyle = {
    backgroundColor: "#6b21a8",
    color: "#fff",
    padding: "1.5rem",
    position: "relative",
    textAlign: "center",
  };

  const closeBtnStyle = {
    position: "absolute",
    top: "1.25rem",
    right: "1.25rem",
    color: "rgba(255,255,255,0.8)",
    fontSize: "1.5rem",
    border: "none",
    background: "none",
    cursor: "pointer",
  };

  const purpleBoxStyle = {
    backgroundColor: "#ede9fe",
    borderRadius: "1rem",
    padding: "1rem",
    marginBottom: "1.5rem",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  };

  const purpleIconCircleStyle = {
    backgroundColor: "#c4b5fd",
    padding: "0.75rem",
    borderRadius: "9999px",
    color: "#5b21b6",
    fontSize: "1.25rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const labelStyle = {
    display: "block",
    fontWeight: "600",
    marginBottom: "0.75rem",
    color: "#374151",
  };

  const shiftOptionStyle = (selected) => ({
    cursor: "pointer",
    transition: "all 0.2s ease",
    borderRadius: "1rem",
    padding: "0.75rem",
    border: selected ? "2px solid #7c3aed" : "2px solid #e5e7eb",
    backgroundColor: selected ? "#f3e8ff" : "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    userSelect: "none",
  });

  const textareaStyle = {
    width: "100%",
    border: "1px solid #d1d5db",
    borderRadius: "1rem",
    padding: "1rem",
    resize: "vertical",
    fontSize: "1rem",
    outline: "none",
    boxSizing: "border-box",
  };

  const textareaFocusStyle = {
    outline: "none",
    borderColor: "#a78bfa",
    boxShadow: "0 0 0 2px #c4b5fd",
  };

  const btnSubmitStyle = (enabled) => ({
    width: "100%",
    padding: "0.75rem",
    borderRadius: "1rem",
    fontWeight: "600",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.5rem",
    backgroundColor: enabled ? "#6b21a8" : "#e5e7eb",
    color: enabled ? "#fff" : "#9ca3af",
    border: "none",
    cursor: enabled ? "pointer" : "not-allowed",
    transition: "background-color 0.3s ease",
  });

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        position: "relative",
        backgroundColor: "#fff",
        padding: 0,
      }}
    >
      <StaffSide />
       <div className="content">
        <StaffNav />
        <div
          style={{
            padding: "1.5rem",
            backgroundColor: "#f3f4f6",
            minHeight: "100vh",
          }}
        >
          <div style={containerStyle}>
            <h2
              style={{
                fontSize: "1.875rem",
                fontWeight: "700",
                color: "#6b21a8",
                marginBottom: "1.5rem",
                textAlign: "center",
              }}
            >
              📋 My Shift Details
            </h2>

            <div style={boxStyle}>
              {loading ? (
                <p
                  style={{
                    textAlign: "center",
                    padding: "1rem 0",
                    fontSize: "1rem",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      marginRight: "0.5rem",
                      animation: "spin 1s linear infinite",
                    }}
                  >
                    ⌛
                  </span>
                  Loading shift data...
                </p>
              ) : error ? (
                <p
                  style={{
                    color: "#dc2626",
                    textAlign: "center",
                    fontSize: "1rem",
                  }}
                >
                  {error}
                </p>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <div style={flexBetweenStyle}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                      }}
                    >
                      <div style={iconCircleStyle}>{getShiftIcon(currentShift)}</div>
                      <div>
                        <p
                          style={{
                            color: "#6b7280",
                            fontSize: "0.875rem",
                            margin: 0,
                          }}
                        >
                          Current Shift
                        </p>
                        <p
                          style={{
                            fontWeight: "600",
                            fontSize: "1.125rem",
                            margin: 0,
                            textTransform: "capitalize",
                          }}
                        >
                          {currentShift}
                        </p>
                      </div>
                    </div>
                    <div
                      style={{
                        ...getStatusColorStyle(currentStatus),
                        fontWeight: "600",
                        padding: "0.5rem 1rem",
                        borderRadius: "1rem",
                        minWidth: "130px",
                        textAlign: "center",
                        fontSize: "1rem",
                        userSelect: "none",
                      }}
                    >
                      {statusLabel(currentStatus)}
                    </div>
                  </div>

                  <button
                    onClick={() => setShowModal(true)}
                    style={btnPrimaryStyle}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.backgroundColor = btnPrimaryHoverStyle.backgroundColor)
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.backgroundColor = btnPrimaryStyle.backgroundColor)
                    }
                  >
                    ✏️ Request Shift Change
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={modalBackdropStyle}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              key="modal-content"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              style={modalBoxStyle}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={modalHeaderStyle}>
                <h3
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    margin: 0,
                    userSelect: "none",
                  }}
                >
                  Request Shift Change
                </h3>
                <button
                  aria-label="Close modal"
                  onClick={() => setShowModal(false)}
                  style={closeBtnStyle}
                >
                  &times;
                </button>
              </div>
              <div style={{ padding: "1.5rem" }}>
                <div style={purpleBoxStyle}>
                  <div style={purpleIconCircleStyle}>🕒</div>
                  <p
                    style={{
                      color: "#5b21b6",
                      fontWeight: "600",
                      margin: 0,
                      fontSize: "1rem",
                    }}
                  >
                    Your current shift:{" "}
                    <span style={{ fontWeight: "700", textTransform: "capitalize" }}>
                      {currentShift}
                    </span>
                  </p>
                </div>

                <label style={labelStyle}>Select New Shift:</label>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "1rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  {["morning", "evening", "night"].map((shift) => (
                    <div
                      key={shift}
                      onClick={() => setSelectedShift(shift)}
                      style={shiftOptionStyle(selectedShift === shift)}
                      aria-pressed={selectedShift === shift}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          setSelectedShift(shift);
                        }
                      }}
                    >
                      <span style={{ fontSize: "1.5rem" }}>{getShiftIcon(shift)}</span>
                      <span
                        style={{
                          marginTop: "0.5rem",
                          textTransform: "capitalize",
                          fontWeight: "600",
                          color: "#4b5563",
                        }}
                      >
                        {shift}
                      </span>
                    </div>
                  ))}
                </div>

                <label htmlFor="reason" style={labelStyle}>
                  Reason for change:
                </label>
                <textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                  placeholder="Explain why you want to change shifts..."
                  style={textareaStyle}
                  onFocus={(e) =>
                    Object.assign(e.currentTarget.style, textareaFocusStyle)
                  }
                  onBlur={(e) =>
                    Object.assign(e.currentTarget.style, {
                      outline: "none",
                      borderColor: "#d1d5db",
                      boxShadow: "none",
                    })
                  }
                />

                <button
                  onClick={handleRequest}
                  disabled={!reason.trim()}
                  style={btnSubmitStyle(reason.trim() !== "")}
                >
                  📨 Submit Request
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
