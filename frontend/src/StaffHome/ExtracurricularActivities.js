import React, { useEffect, useState } from "react";
import StaffSide from "./StaffSide";
import StaffNav from "./StaffNav";
import axios from "axios";

export default function ExtracurricularActivities() {
  const [auth, setAuth] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });
  const staffId = auth?.regid;
  const [activities, setActivities] = useState({ children: [], adult: [] });
  const [newActivity, setNewActivity] = useState({
    title: "",
    description: "",
    group: "children",
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await axios.post("http://localhost:5000/demo/viewactivity", {
        staffId,
      });
      const children = res.data.filter((a) => a.group === "children");
      const adult = res.data.filter((a) => a.group === "adult");
      setActivities({ children, adult });
    } catch (err) {
      alert("❌ Failed to fetch activities");
      console.error(err);
    }
  };
  const handleAdd = async () => {
    const { title, description, group } = newActivity;
    if (!title || !description) return alert("⚠️ Please fill all fields");

    try {
      await axios.post("http://localhost:5000/demo/addactivity", {
        ...newActivity,
        staffId,
      });
      alert("✅ Activity added successfully");
      setNewActivity({ title: "", description: "", group: "children" });
      fetchActivities();
    } catch (err) {
      alert("❌ Failed to add activity");
      console.error(err);
    }
  };

  const handleEdit = (activity) => {
    setEditId(activity._id);
    setNewActivity({
      title: activity.title,
      description: activity.description,
      group: activity.group,
    });
    // optionally open modal here
  };
  const handleUpdate = async () => {
    try {
      await axios.post(`http://localhost:5000/demo/updateactivity/${editId}`, {
        ...newActivity,
        staffId,
      });
      alert("✏️ Activity updated successfully");
      setEditId(null);
      setNewActivity({ title: "", description: "", group: "children" });
      fetchActivities();
    } catch (err) {
      alert("❌ Failed to update activity");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this activity?"))
      return;
    try {
      await axios.post("http://localhost:5000/demo/activitydelete", { id });
      alert("🗑️ Activity deleted successfully");
      fetchActivities();
    } catch (err) {
      alert("❌ Failed to delete activity");
      console.error(err);
    }
  };

  // --- Premium Styles ---
  const styles = {
    container: {
      backgroundColor: "#f3f4f6",
      minHeight: "100vh",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      marginLeft: "20px",
    },
    header: {
      background: "linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)",
      color: "white",
      padding: "3rem 1.5rem",
      borderRadius: "0 0 2rem 2rem",
      marginBottom: "2rem",
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      textAlign: "center",
    },
    title: {
      fontSize: "2.5rem",
      fontWeight: "800",
      marginBottom: "0.5rem",
      letterSpacing: "-0.025em",
    },
    subtitle: {
      opacity: 0.9,
      fontSize: "1.1rem",
    },
    formCard: {
      background: "white",
      borderRadius: "1.5rem",
      padding: "2.5rem",
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      marginBottom: "3rem",
      border: "1px solid rgba(229, 231, 235, 0.5)",
      maxWidth: "800px",
      margin: "0 auto 3rem auto",
    },
    inputGroup: {
      marginBottom: "1.5rem",
    },
    label: {
      display: "block",
      fontSize: "0.875rem",
      fontWeight: "600",
      color: "#374151",
      marginBottom: "0.5rem",
      marginLeft: "0.25rem",
    },
    input: {
      width: "100%",
      padding: "0.75rem 1rem",
      borderRadius: "0.75rem",
      border: "1px solid #e5e7eb",
      backgroundColor: "#f9fafb",
      transition: "all 0.2s ease",
      fontSize: "1rem",
      color: "#1f2937",
    },
    textarea: {
      width: "100%",
      padding: "0.75rem 1rem",
      borderRadius: "0.75rem",
      border: "1px solid #e5e7eb",
      backgroundColor: "#f9fafb",
      transition: "all 0.2s ease",
      fontSize: "1rem",
      color: "#1f2937",
      minHeight: "100px",
      resize: "vertical",
    },
    button: {
      background: editId
        ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
        : "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)",
      color: "white",
      fontWeight: "700",
      padding: "1rem 2rem",
      borderRadius: "0.75rem",
      border: "none",
      cursor: "pointer",
      width: "100%",
      transition: "transform 0.2s, box-shadow 0.2s",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    },
    sectionTitle: {
      fontSize: "1.75rem",
      fontWeight: "700",
      color: "#1e293b",
      marginBottom: "1.5rem",
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: "2rem",
      marginBottom: "3rem",
    },
    card: {
      background: "white",
      borderRadius: "1rem",
      overflow: "hidden",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      transition: "transform 0.2s, box-shadow 0.2s",
      border: "1px solid #f3f4f6",
      display: "flex",
      flexDirection: "column",
      height: "100%",
    },
    cardHeader: {
      padding: "1.25rem 1.5rem",
      background: "#f8fafc",
      borderBottom: "1px solid #e2e8f0",
    },
    cardTitle: {
      fontSize: "1.1rem",
      fontWeight: "700",
      color: "#0f172a",
      margin: 0,
    },
    cardBody: {
      padding: "1.5rem",
      flexGrow: 1,
      color: "#475569",
      lineHeight: "1.6",
    },
    cardFooter: {
      padding: "1rem 1.5rem",
      background: "#f9fafb",
      borderTop: "1px solid #f3f4f6",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "1rem",
    },
    actionBtn: {
      flex: 1,
      padding: "0.5rem",
      borderRadius: "0.5rem",
      border: "1px solid transparent",
      fontWeight: "600",
      fontSize: "0.875rem",
      cursor: "pointer",
      transition: "all 0.2s",
    },
    editBtn: {
      background: "#fff",
      border: "1px solid #e2e8f0",
      color: "#475569",
    },
    deleteBtn: {
      background: "#fee2e2",
      color: "#ef4444",
      border: "1px solid #fecaca",
    },
    emptyState: {
      textAlign: "center",
      padding: "3rem",
      background: "white",
      borderRadius: "1rem",
      border: "2px dashed #e2e8f0",
      color: "#94a3b8",
    }
  };

  const renderCard = (activity) => (
    <div
      key={activity._id}
      style={styles.card}
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
        <h3 style={styles.cardTitle}>{activity.title}</h3>
      </div>
      <div style={styles.cardBody}>
        {activity.description}
      </div>
      <div style={styles.cardFooter}>
        <button
          style={{ ...styles.actionBtn, ...styles.editBtn }}
          onClick={() => handleEdit(activity)}
        >
          ✏️ Edit
        </button>
        <button
          style={{ ...styles.actionBtn, ...styles.deleteBtn }}
          onClick={() => handleDelete(activity._id)}
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );

  return (
    <div className="container-fluid position-relative d-flex p-0 " style={styles.container}>
      <StaffSide />
      <div className="content" style={{ flex: 1, overflowY: "auto" }}>
        <StaffNav />

        {/* Header Section */}
        <div style={styles.header}>
          <div className="container">
            <h1 style={styles.title}>Extracurricular Activities</h1>
            <p style={styles.subtitle}>Enrich lives with engaging programs and events.</p>
          </div>
        </div>

        <div className="container pb-5">
          {/* Form Section */}
          <div style={styles.formCard}>
            <div className="d-flex align-items-center mb-4">
              <span style={{ fontSize: "1.5rem", marginRight: "1rem" }}>
                {editId ? "✏️" : "✨"}
              </span>
              <h3 className="m-0 fw-bold text-dark">
                {editId ? "Edit Activity" : "Create New Activity"}
              </h3>
            </div>

            <div className="row g-4">
              <div className="col-md-8">
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Activity Title</label>
                  <input
                    style={styles.input}
                    placeholder="e.g. Art Workshop"
                    value={newActivity.title}
                    onChange={(e) =>
                      setNewActivity({ ...newActivity, title: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="col-md-4">
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Target Group</label>
                  <select
                    style={styles.input}
                    value={newActivity.group}
                    onChange={(e) =>
                      setNewActivity({ ...newActivity, group: e.target.value })
                    }
                  >
                    <option value="children">🧒 Children</option>
                    <option value="adult">👨‍🎓 Adult</option>
                  </select>
                </div>
              </div>

              <div className="col-12">
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Description</label>
                  <textarea
                    style={styles.textarea}
                    placeholder="Describe the activity..."
                    value={newActivity.description}
                    onChange={(e) =>
                      setNewActivity({ ...newActivity, description: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="col-12">
                <button
                  style={styles.button}
                  onClick={editId ? handleUpdate : handleAdd}
                  onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                  onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
                >
                  {editId ? "Update Activity" : "Add Activity"}
                </button>
              </div>
            </div>
          </div>

          <hr className="my-5" style={{ opacity: 0.1 }} />

          {/* Children Section */}
          <div>
            <div style={styles.sectionTitle}>
              <span style={{ fontSize: "2rem" }}>🧒</span>
              <span>Children's Programs</span>
              <span className="badge bg-primary rounded-pill fs-6 ms-2">
                {activities.children.length}
              </span>
            </div>

            {activities.children.length > 0 ? (
              <div style={styles.grid}>
                {activities.children.map(renderCard)}
              </div>
            ) : (
              <div style={styles.emptyState}>
                <p className="m-0">No activities found for children.</p>
              </div>
            )}
          </div>

          {/* Adult Section */}
          <div className="mt-5">
            <div style={styles.sectionTitle}>
              <span style={{ fontSize: "2rem" }}>👨‍🎓</span>
              <span>Adult Programs</span>
              <span className="badge bg-info text-dark rounded-pill fs-6 ms-2">
                {activities.adult.length}
              </span>
            </div>

            {activities.adult.length > 0 ? (
              <div style={styles.grid}>
                {activities.adult.map(renderCard)}
              </div>
            ) : (
              <div style={styles.emptyState}>
                <p className="m-0">No activities found for adults.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
