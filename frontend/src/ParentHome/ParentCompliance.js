import React, { useState, useEffect } from "react";
import ParentSide from "./ParentSide";
import ParentNav from "./ParentNav";
import axios from "axios";

const styles = {
  container: {
    padding: "2rem",
    maxWidth: 800,
    margin: "2rem auto",
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  header: {
    textAlign: "center",
    marginBottom: "1rem",
    color: "#374151",
  },
  form: {
    display: "flex",
    gap: "1rem",
    marginBottom: "2rem",
  },
  textarea: {
    flex: 1,
    padding: "1rem",
    height: "80px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    fontSize: "1rem",
    resize: "vertical",
  },
  submitBtn: {
    padding: "0 1.5rem",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    borderRadius: 8,
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
  },
  thead: {
    background: "#eef2ff"
  },
  th: {
    padding: "12px 16px",
    textAlign: "left",
    fontSize: "0.95rem",
    color: "#334155",
    borderBottom: "2px solid #e5e7eb"
  },
  tr: {
    transition: "background-color 0.2s"
  },
  td: {
    padding: "12px 16px",
    fontSize: "0.93rem",
    color: "#475569",
    borderBottom: "1px solid #e5e7eb",
    verticalAlign: "middle"
  },
  statusPill: {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "9999px",
    fontWeight: 600,
    fontSize: "0.85rem"
  }
};

export default function ParentCompliance() {
  const auth = JSON.parse(localStorage.getItem("user"));
  const parentId = auth?.regid;

  const [message, setMessage] = useState("");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const statusMap = {
    0: { text: "Pending", color: "#f59e0b" },
    1: { text: "In Progress", color: "#3b82f6" },
    2: { text: "Resolved", color: "#10b981" },
    3: { text: "Rejected", color: "#ef4444" },
  };

  // Fetch list
  const fetchList = () => {
    axios
      .post("http://localhost:5000/demo/getComplianceByParent", { parentId })
      .then((r) => {
        if (r.data.success) setRequests(r.data.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(fetchList, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return alert("Enter your message");
    axios
      .post("http://localhost:5000/demo/createCompliance", {
        parentId,
        message,
      })
      .then((r) => {
        if (r.data.success) {
          setMessage("");
          fetchList();
        }
      })
      .catch(() => alert("Failed to submit"));
  };

  return (
    <div className="container-fluid p-0" style={{ backgroundColor: '#f8fafc', minHeight: '100vh', overflow: 'hidden' }}>
      <ParentSide />
      <div className="content" style={{
        marginLeft: "260px",
        flex: 1,
        overflowY: "auto",
        display: 'flex',
        flexDirection: 'column'
      }}>
        <ParentNav />

        {/* Header Section */}
        <div style={{ padding: '1.5rem 2rem' }}>
          <div style={{
            background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
            color: "white",
            padding: '3rem 2rem',
            borderRadius: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            textAlign: 'left'
          }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Compliance Requests 📩</h1>
            <p style={{ opacity: 0.9, fontSize: '1.1rem' }}>Submit and track your requests regarding facility compliance.</p>
          </div>
        </div>

        <div className="container-fluid px-4" style={{ maxWidth: '1400px', paddingBottom: '4rem' }}>
          <div style={{ ...styles.container, marginTop: '1rem', marginLeft: '0', marginRight: '0', maxWidth: '100%' }}>
            <h2 style={{ ...styles.header, textAlign: 'left', fontWeight: '700', color: '#1e293b' }}>Send New Request</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your compliance issue..."
                style={styles.textarea}
              />
              <button type="submit" style={styles.submitBtn}>
                Send
              </button>
            </form>

            {!loading && requests.length > 0 && (
              <div style={{ overflowX: "auto" }}>
                <table style={styles.table}>
                  <thead style={styles.thead}>
                    <tr>
                      <th style={styles.th}>Date</th>
                      <th style={styles.th}>Message</th>
                      <th style={styles.th}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((req, idx) => (
                      <tr
                        key={req._id}
                        style={{
                          ...styles.tr,
                          backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f9fafb"
                        }}
                      >
                        <td style={styles.td}>
                          {new Date(req.date).toLocaleString()}
                        </td>
                        <td style={styles.td}>{req.message}</td>
                        <td style={styles.td}>
                          <span
                            style={{
                              ...styles.statusPill,
                              backgroundColor: statusMap[req.status].color + "20",
                              color: statusMap[req.status].color,
                            }}
                          >
                            {statusMap[req.status].text}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
