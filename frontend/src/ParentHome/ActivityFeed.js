import React, { useState, useEffect } from "react";
import ParentSide from "./ParentSide";
import ParentNav from "./ParentNav";
import axios from "axios";

const styles = {
  container: {
    backgroundColor: "#f3f4f6",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    background: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
    color: "white",
    padding: "2.5rem 2rem",
    borderRadius: "0 0 2rem 2rem",
    marginBottom: "2rem",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  headerTitle: {
    fontSize: "2.2rem",
    fontWeight: "800",
    marginBottom: "0.5rem",
    letterSpacing: "-0.025em",
  },
  headerSubtitle: {
    opacity: 0.9,
    fontSize: "1.1rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "1.5rem",
    padding: "0 1rem 3rem 1rem",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "1rem",
    padding: "1.5rem",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    transition: "transform 0.2s, box-shadow 0.2s",
    border: "1px solid #e5e7eb",
    position: "relative",
    overflow: "hidden",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  emojiContainer: {
    fontSize: "2.5rem",
    background: "#f3f4f6",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  activityTitle: {
    fontSize: "1.25rem",
    fontWeight: "700",
    color: "#1f2937",
    margin: 0,
  },
  meta: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    color: "#6b7280",
    fontSize: "0.9rem",
    marginBottom: "0.5rem",
  },
  badge: {
    padding: "0.25rem 0.75rem",
    borderRadius: "9999px",
    fontSize: "0.75rem",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  emptyState: {
    textAlign: "center",
    padding: "4rem 2rem",
    backgroundColor: "white",
    borderRadius: "1rem",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    maxWidth: "600px",
    margin: "0 auto",
  },
};

export default function ActivityFeed() {
  const [auth, setAuth] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });
  const [staffActivities, setStaffActivities] = useState([]);

  useEffect(() => {
    if (auth?.regid) {
      axios
        .post("http://localhost:5000/demo/getactivitybyparentid", {
          parentId: auth.regid,
        })
        .then((res) => setStaffActivities(res.data.activities))
        .catch((err) => console.error("Error:", err));
    }
  }, [auth]);

  const activityEmojis = {
    eat: "🍽️",
    sleep: "😴",
    study: "📚",
    play: "🎮",
    work: "💼",
    bath: "🛁",
    walk: "🚶‍♂️",
    tv: "📺",
    music: "🎵",
  };

  const activityColors = {
    eat: "#fbbf24", // amber
    sleep: "#818cf8", // indigo
    study: "#a3e635", // lime
    play: "#f472b6", // pink
    work: "#60a5fa", // blue
    bath: "#22d3ee", // cyan
    walk: "#34d399", // emerald
    tv: "#fb923c", // orange
    music: "#c084fc", // purple
  };

  const getBadgeColor = (type) => {
    if (type === 'child' || type === 'children') return { bg: '#dcfce7', text: '#166534' }; // green
    return { bg: '#dbeafe', text: '#1e40af' }; // blue
  };

  return (
    <div className="container-fluid p-0" style={{ ...styles.container, overflow: 'hidden' }}>
      <ParentSide />
      <div className="content" style={{
        marginLeft: "260px",
        flex: 1,
        overflowY: "auto",
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f8fafc'
      }}>
        <ParentNav />

        {/* Header */}
        <div style={{ padding: '1.5rem 2rem' }}>
          <div style={{
            ...styles.header,
            margin: 0,
            padding: '3rem 2rem',
            borderRadius: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            textAlign: 'left'
          }}>
            <h1 style={{ ...styles.headerTitle, fontSize: '2.5rem' }}>Activity Timeline 🕒</h1>
            <p style={{ ...styles.headerSubtitle, opacity: 0.9 }}>Real-time updates on your family's daily activities.</p>
          </div>
        </div>

        <div className="container-fluid px-4" style={{ maxWidth: '1400px', margin: '0 0' }}>
          {staffActivities.length > 0 ? (
            <div style={styles.grid}>
              {staffActivities.map((item, index) => {
                const activityKey = item.activityName?.toLowerCase();
                const accentColor = activityColors[activityKey] || "#9ca3af";
                const badgeStyle = getBadgeColor(item.category);

                return (
                  <div
                    key={index}
                    style={{
                      ...styles.card,
                      borderLeft: `6px solid ${accentColor}`
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "translateY(-5px)";
                      e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
                    }}
                  >
                    <div style={styles.cardHeader}>
                      <div>
                        <h4 style={styles.activityTitle}>{item.activityName}</h4>
                        <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                          {new Date(item.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div style={styles.emojiContainer}>
                        {activityEmojis[activityKey] || "📝"}
                      </div>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <div style={styles.meta}>
                        <i className="fa fa-clock text-muted"></i>
                        <span>{item.time}</span>
                      </div>
                      <div style={styles.meta}>
                        <i className="fa fa-users text-muted"></i>
                        <span>Age Group: <strong>{item.age}</strong></span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                      <span style={{
                        ...styles.badge,
                        backgroundColor: badgeStyle.bg,
                        color: badgeStyle.text
                      }}>
                        {(item.category === 'child' || item.category === 'children') ? '🧒 Child Care' : '🧑 Adult Care'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📭</div>
              <h3 style={{ fontWeight: "700", color: "#374151" }}>No Activities Logged Yet</h3>
              <p style={{ color: "#6b7280" }}>
                Your assigned staff haven't posted any updates tailored for your family members today.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
