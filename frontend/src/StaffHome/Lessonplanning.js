import React, { useEffect, useState } from 'react';
import StaffSide from './StaffSide';
import StaffNav from './StaffNav';

export default function LessonPlanningCompanyStyle() {
  const [lessons, setLessons] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [auth, setAuth] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  const [category, setCategory] = useState("child");
  const [ageGroup, setAgeGroup] = useState("4-6");
  const [book, setBook] = useState("");
  const [studyTime, setStudyTime] = useState("");
  const [revisionTime, setRevisionTime] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("");
  const [price, setPrice] = useState("");

  const [editId, setEditId] = useState(null);

  const childAges = ['4-6', '7-9', '10-12', '13-17'];
  const adultAges = ['60+'];

  useEffect(() => {
    const staffId = auth?.regid;
    console.log("Fetching lessons for staffId:", staffId);
    if (!staffId) return;

    fetch("http://localhost:5000/demo/lessonidview", {
      method: 'POST',
      headers: {
        Accept: "application/json",
        'Content-Type': "application/json"
      },
      body: JSON.stringify({ staffassign: staffId })
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch lessons");
        return res.json();
      })
      .then(data => {
        console.log("Fetched lessons:", data);
        setLessons(data);
      })
      .catch(err => console.error("Lesson fetch error", err));
  }, [refresh, auth]);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const param = {
      category,
      ageGroup,
      book,
      studyTime,
      revisionTime,
      date,
      time,
      price,
      staffassign: auth?.regid,
      id: editId // send id if editing
    };

    const url = editId ? "http://localhost:5000/demo/lessonupdate" : "http://localhost:5000/demo/lesson";

    fetch(url, {
      method: 'POST',
      headers: {
        Accept: "application/json",
        'Content-Type': "application/json"
      },
      body: JSON.stringify(param)
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to submit lesson");
        return res.json();
      })
      .then(() => {
        alert(`✅ Lesson ${editId ? 'updated' : 'added'} successfully!`);
        setRefresh(prev => prev + 1);
        setEditId(null);
        resetForm();
      })
      .catch(err => console.error("Submit error", err));
  };

  const handleEdit = (lesson) => {
    setEditId(lesson._id);
    setCategory(lesson.category);
    setAgeGroup(lesson.ageGroup);
    setBook(lesson.book);
    setStudyTime(lesson.studyTime);
    setRevisionTime(lesson.revisionTime);
    setDate(lesson.date.split("T")[0]);
    setTime(lesson.time);
    setPrice(lesson.price);
  };

  const handleDelete = (id) => {
    fetch('http://localhost:5000/demo/lessondelete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then(() => setRefresh(prev => prev + 1))
      .catch((err) => console.error('Error deleting lesson:', err));
  };

  const resetForm = () => {
    setCategory("child");
    setAgeGroup("4-6");
    setBook("");
    setStudyTime("");
    setRevisionTime("");
    setDate(new Date().toISOString().split("T")[0]);
    setTime("");
    setPrice("");
  };

  // --- Premium Styles ---
  const styles = {
    container: {
      backgroundColor: "#f3f4f6",
      minHeight: "100vh",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      marginLeft: "20px"
    },
    header: {
      background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
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
    button: {
      background: editId
        ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
        : "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
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
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: "2rem",
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
    },
    cardHeader: {
      padding: "1.5rem",
      borderBottom: "1px solid #f3f4f6",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      background: "#fafafa",
    },
    cardBody: {
      padding: "1.5rem",
      flexGrow: 1,
    },
    cardFooter: {
      padding: "1rem 1.5rem",
      background: "#f9fafb",
      borderTop: "1px solid #f3f4f6",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    badge: {
      padding: "0.25rem 0.75rem",
      borderRadius: "9999px",
      fontSize: "0.75rem",
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
    },
    infoRow: {
      display: "flex",
      alignItems: "center",
      marginBottom: "0.75rem",
      color: "#4b5563",
      fontSize: "0.95rem",
    },
    icon: {
      marginRight: "0.75rem",
      width: "1.25rem",
      textAlign: "center",
      fontSize: "1.1rem",
    },
  };

  return (
    <div className="container-fluid position-relative d-flex p-0" style={styles.container}>
      <StaffSide />
      <div className="content" style={{ flex: 1, overflowY: "auto" }}>
        <StaffNav />

        {/* Header Section */}
        <div style={styles.header}>
          <div className="container">
            <h1 style={styles.title}>Lesson Planning Studio</h1>
            <p style={styles.subtitle}>Curate and manage educational content for all age groups.</p>
          </div>
        </div>

        <div className="container pb-5">
          {/* Form Section */}
          <div style={styles.formCard}>
            <div className="d-flex align-items-center mb-4">
              <span style={{ fontSize: "1.5rem", marginRight: "1rem" }}>{editId ? "✏️" : "✨"}</span>
              <h3 className="m-0 fw-bold text-dark">{editId ? "Edit Lesson Plan" : "Create New Lesson"}</h3>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="row g-4">
                <div className="col-md-6 col-lg-3">
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Category</label>
                    <select
                      style={styles.input}
                      value={category}
                      onChange={(e) => {
                        const newCat = e.target.value;
                        setCategory(newCat);
                        // Reset ageGroup to the first valid option for the new category
                        if (newCat === 'child') {
                          setAgeGroup(childAges[0]);
                        } else {
                          setAgeGroup(adultAges[0]);
                        }
                      }}
                    >
                      <option value="child">🧒 Child</option>
                      <option value="adult">🧑 Adult</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-6 col-lg-3">
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Age Group</label>
                    <select
                      style={styles.input}
                      value={ageGroup}
                      onChange={(e) => setAgeGroup(e.target.value)}
                    >
                      {(category === 'child' ? childAges : adultAges).map(age => (
                        <option key={age} value={age}>{age} yrs</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="col-md-6 col-lg-6">
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Book / Topic Name</label>
                    <input
                      type="text"
                      style={styles.input}
                      value={book}
                      onChange={(e) => setBook(e.target.value)}
                      placeholder="e.g. Introduction to Science..."
                    />
                  </div>
                </div>

                <div className="col-md-6 col-lg-3">
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Study Duration</label>
                    <input
                      type="text"
                      style={styles.input}
                      value={studyTime}
                      onChange={(e) => setStudyTime(e.target.value)}
                      placeholder="e.g. 45 mins"
                    />
                  </div>
                </div>

                <div className="col-md-6 col-lg-3">
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Revision Duration</label>
                    <input
                      type="text"
                      style={styles.input}
                      value={revisionTime}
                      onChange={(e) => setRevisionTime(e.target.value)}
                      placeholder="e.g. 15 mins"
                    />
                  </div>
                </div>

                <div className="col-md-6 col-lg-3">
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Date</label>
                    <input
                      type="date"
                      style={styles.input}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="col-md-6 col-lg-3">
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Time</label>
                    <input
                      type="time"
                      style={styles.input}
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    />
                  </div>
                </div>

                <div className="col-md-12 col-lg-3">
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Price (₹)</label>
                    <input
                      type="number"
                      style={styles.input}
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="col-md-12 col-lg-9 d-flex align-items-end">
                  <button
                    type="submit"
                    style={styles.button}
                    onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                    onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
                  >
                    {editId ? "Update Lesson Plan" : "Create Lesson Plan"}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* List Section */}
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h3 className="fw-bold text-secondary m-0">📚 Active Schedules</h3>
            <span className="badge bg-primary rounded-pill px-3 py-2">{lessons.length} Plans</span>
          </div>

          <div style={styles.grid}>
            {lessons.length === 0 && (
              <div className="col-12 py-5 text-center">
                <div style={{ fontSize: "3rem", opacity: 0.2 }}>📭</div>
                <p className="text-muted mt-3">No lesson plans found. Create one above!</p>
              </div>
            )}

            {lessons.map((lesson) => (
              <div
                key={lesson._id}
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
                  <span
                    style={{
                      ...styles.badge,
                      background: lesson.category === 'child' ? '#dbeafe' : '#fce7f3',
                      color: lesson.category === 'child' ? '#1e40af' : '#9d174d'
                    }}
                  >
                    {lesson.category === 'child' ? '🧒 Child' : '🧑 Adult'}
                  </span>
                  <span style={{ fontSize: "0.85rem", color: "#6b7280", fontWeight: "600" }}>
                    ₹{lesson.price}
                  </span>
                </div>

                <div style={styles.cardBody}>
                  <h4 style={{ fontWeight: "700", color: "#111827", marginBottom: "1rem" }}>
                    {lesson.book}
                  </h4>

                  <div style={styles.infoRow}>
                    <span style={styles.icon}>🎯</span>
                    <span>Age: <strong>{lesson.ageGroup}</strong> yrs</span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.icon}>📅</span>
                    <span>{new Date(lesson.date).toDateString()}</span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.icon}>⏰</span>
                    <span>{lesson.time} ({lesson.studyTime})</span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.icon}>🔁</span>
                    <span>Rev: {lesson.revisionTime}</span>
                  </div>
                </div>

                <div style={styles.cardFooter}>
                  <button
                    className="btn btn-outline-primary btn-sm rounded-pill px-3"
                    onClick={() => handleEdit(lesson)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm rounded-pill px-3"
                    onClick={() => handleDelete(lesson._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
