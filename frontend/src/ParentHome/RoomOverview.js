import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ParentNav from './ParentNav';
import ParentSide from './ParentSide';

const RoomLessonOverview = () => {
  const [roomData, setRoomData] = useState([]);
  const [lessonPlans, setLessonPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = JSON.parse(localStorage.getItem("user"));
  const id = auth?.regid;


  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("user"));
    const id = auth?.regid;

    Promise.all([
      fetch('http://localhost:5000/demo/roomviewbyparent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parentId: id })
      }).then((res) => res.json()),
      fetch('http://localhost:5000/demo/lessonviewbyparent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parentId: id })
      }).then((res) => res.json()),
    ])
      .then(([rooms, lessons]) => {
        setRoomData(rooms);
        setLessonPlans(lessons);
        setLoading(false);
      })
      .catch(() => {
        setError('❌ Failed to load data.');
        setLoading(false);
      });
  }, []);

  // Merge staff data from both room and lesson plans by ID
  const combinedStaff = {};
  roomData.forEach((room) => {
    if (room.roomassign?._id) {
      combinedStaff[room.roomassign._id] = room.roomassign.name;
    }
  });
  lessonPlans.forEach((lesson) => {
    if (lesson.staffassign?._id) {
      combinedStaff[lesson.staffassign._id] = lesson.staffassign.name;
    }
  });
  const staffList = Object.entries(combinedStaff); // [[_id, name], ...]

  /* --- Premium Styles (Adapted from LessonPlanningCompanyStyle) --- */
  const styles = {
    header: {
      background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
      color: "white",
      padding: "2rem",
      borderRadius: "1rem",
      marginBottom: "2rem",
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
      textAlign: "center",
    },
    sectionTitle: {
      fontSize: "1.5rem",
      fontWeight: "700",
      color: "#374151",
      marginBottom: "1rem",
      borderLeft: "5px solid #6366f1",
      paddingLeft: "10px"
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: "1.5rem",
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
      padding: "1rem 1.25rem",
      background: "#fafafa",
      borderBottom: "1px solid #f3f4f6",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    cardBody: {
      padding: "1.25rem",
      flexGrow: 1,
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
      marginBottom: "0.5rem",
      color: "#4b5563",
      fontSize: "0.9rem",
    },
    icon: {
      marginRight: "0.5rem",
      width: "1.25rem",
      textAlign: "center",
      fontSize: "1rem",
    },
    staffSection: {
      background: "#f9fafb",
      borderRadius: "1rem",
      padding: "2rem",
      marginBottom: "2rem",
      boxShadow: "0 1px 3px 0 rgba(0,0,0,0.1)"
    }
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
            ...styles.header,
            margin: 0,
            padding: '3rem 2rem',
            borderRadius: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            textAlign: 'left'
          }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Room & Lesson Overview 🏨</h1>
            <p style={{ opacity: 0.9, fontSize: '1.1rem' }}>View the environments and learning plans curated for your family.</p>
          </div>
        </div>

        <div className="container-fluid px-4" style={{ maxWidth: '1400px', paddingBottom: '4rem' }}>

          {loading && <p>⏳ Loading data...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {!loading && !error && staffList.length === 0 && <p className="text-muted text-center">No assigned staff data available.</p>}

          {!loading && !error && staffList.map(([staffID, staffName], idx) => {
            const staffRooms = roomData.filter(r => r.roomassign?._id === staffID);
            const staffLessons = lessonPlans.filter(l => l.staffassign?._id === staffID);
            return (
              <motion.div
                key={idx}
                style={styles.staffSection}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="text-primary mb-4">👨‍⚕️ Staff: {staffName}</h3>

                {/* Room Details */}
                <div className="mb-5">
                  <h5 style={styles.sectionTitle}>🏠 Assigned Rooms</h5>
                  <div className="d-flex flex-wrap gap-3">
                    {staffRooms.length > 0 ? staffRooms.map((room, i) => (
                      <div
                        key={i}
                        className="p-3 border rounded bg-white shadow-sm"
                        style={{ width: '300px' }}
                      >
                        <h6 className="fw-bold text-dark">{room.roomname}</h6>
                        <hr className="my-2" />
                        <p className="mb-1"><strong>Price:</strong> ${room.price}</p>
                        <p className="mb-1"><strong>Room No:</strong> {room.room}</p>
                        <p className="mb-1"><strong>Floor:</strong> {room.floor}</p>
                        <p className="mb-1 text-muted small"><em>{room.services}</em></p>
                      </div>
                    )) : <p className="text-muted fst-italic">No rooms assigned.</p>}
                  </div>
                </div>

                {/* Lesson Details - Premium Style */}
                <div>
                  <h5 style={styles.sectionTitle}>📘 Lesson Plans</h5>
                  <div style={styles.grid}>
                    {staffLessons.length > 0 ? staffLessons.map((lesson, j) => (
                      <motion.div
                        key={j}
                        style={styles.card}
                        whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
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
                          <h5 style={{ fontWeight: "700", color: "#111827", marginBottom: "1rem" }}>
                            {lesson.book || "Untitled Lesson"}
                          </h5>

                          <div style={styles.infoRow}>
                            <span style={styles.icon}>🎯</span>
                            <span>Age Group: <strong>{lesson.ageGroup}</strong></span>
                          </div>
                          <div style={styles.infoRow}>
                            <span style={styles.icon}>📅</span>
                            <span>{lesson.date ? new Date(lesson.date).toLocaleDateString() : 'N/A'}</span>
                          </div>
                          <div style={styles.infoRow}>
                            <span style={styles.icon}>⏰</span>
                            <span>{lesson.time ? lesson.time : 'N/A'} ({lesson.studyTime || '-'})</span>
                          </div>
                          <div style={styles.infoRow}>
                            <span style={styles.icon}>🔁</span>
                            <span>Rev: {lesson.revisionTime || '-'}</span>
                          </div>
                          <div style={styles.infoRow}>
                            <span style={styles.icon}>🏷️</span>
                            <span>{lesson.category}</span>
                          </div>
                        </div>
                      </motion.div>
                    )) : <p className="text-muted fst-italic">No lesson plans found for this age group.</p>}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RoomLessonOverview;
