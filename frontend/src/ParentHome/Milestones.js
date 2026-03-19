import React, { useState, useEffect } from 'react';
import ParentSide from './ParentSide';
import ParentNav from './ParentNav';
import axios from 'axios';
import { motion } from 'framer-motion';

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
  sectionTitle: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: "1rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    borderBottom: "2px solid #e5e7eb",
    paddingBottom: "0.5rem"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "1.5rem",
    marginBottom: "3rem",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "1rem",
    padding: "1.5rem",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    border: "1px solid #e5e7eb",
    textAlign: "center",
    transition: "transform 0.2s",
  },
  milestoneText: {
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "0.5rem",
  },
  statusText: {
    fontSize: "0.95rem",
    fontWeight: "600",
    padding: "0.25rem 0.75rem",
    borderRadius: "9999px",
    display: "inline-block",
  },
  emptyState: {
    textAlign: "center",
    padding: "3rem",
    backgroundColor: "white",
    borderRadius: "1rem",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    color: "#6b7280"
  }
};

export default function Milestones() {
  const [milestoneRecords, setMilestoneRecords] = useState([]);
  const [auth] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  console.log(milestoneRecords, "milestoneRecords");


  const predefinedChildMilestones = [
    { label: "First Word 🗣️", value: "First Word 🗣️" },
    { label: "Walking 🚶‍♂️", value: "Walking 🚶‍♂️" },
    { label: "First Drawing 🎨", value: "First Drawing 🎨" },
    { label: "Reading Letters 🔤", value: "Reading Letters 🔤" },
    { label: "First Dance 💃", value: "First Dance 💃" },
    { label: "School Enrollment 🏫", value: "School Enrollment 🏫" },
    { label: "Potty Trained 🚽", value: "Potty Trained 🚽" },
    { label: "Riding Bike 🚲", value: "Riding Bike 🚲" }
  ];

  const predefinedAdultMilestones = [
    { label: "Walked without support 🚶", value: "Walked without support 🚶" },
    { label: "Completed Physiotherapy 🧘", value: "Completed Physiotherapy 🧘" },
    { label: "Medication Adherence 💊", value: "Medication Adherence 💊" },
    { label: "Improved Memory Score 🧠", value: "Improved Memory Score 🧠" },
    { label: "Social Participation 🗣️", value: "Social Participation 🗣️" },
    { label: "Self-Feeding Independence 🍽️", value: "Self-Feeding Independence 🍽️" },
    { label: "Regular Sleep Pattern 😴", value: "Regular Sleep Pattern 😴" },
    { label: "Stable Blood Pressure 💓", value: "Stable Blood Pressure 💓" }
  ];
  useEffect(() => {
    if (auth?.regid) {
      axios.post("http://localhost:5000/demo/getmilestonesbyparent", {
        parentId: auth.regid
      })
        .then(res => setMilestoneRecords(res.data))
        .catch(err => {
          console.error("Error:", err);
          // alert("Failed to fetch milestones."); 
        });
    }
  }, [auth]);

  const generateMilestoneStatus = (milestoneType, achievedList) => {
    const predefinedList = milestoneType === 'child' ? predefinedChildMilestones : predefinedAdultMilestones;
    return predefinedList.map(item => ({
      milestone: item.label,
      status: achievedList.includes(item.value)
    }));
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

        {/* Header Section */}
        <div style={{ padding: '1.5rem 2rem' }}>
          <div style={{
            ...styles.header,
            margin: 0,
            padding: '3rem 2rem',
            borderRadius: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            textAlign: 'left',
            background: "linear-gradient(135deg, #0fb9b1 0%, #10b981 100%)",
          }}>
            <h1 style={{ ...styles.headerTitle, fontSize: '2.5rem' }}>Milestone Tracker 🌟</h1>
            <p style={{ ...styles.headerSubtitle, opacity: 0.9 }}>Celebrating every step of the journey, big or small.</p>
          </div>
        </div>

        <div className="container-fluid px-4" style={{ maxWidth: '1400px', paddingBottom: '3rem' }}>
          {milestoneRecords.length > 0 ? (
            milestoneRecords.map((record, index) => {
              // Logic: correctly identify the name based on type
              // Backend populates childId with 'childname' and adultId with 'name' (presumably)
              const name = record.milestoneType === 'child'
                ? record.childId?.regid?.childname || record.childId?.childname || 'Unnamed Child'
                : record.adultId?.regid?.adultname || record.adultId?.regid?.name || 'Adult Member';

              const titleIcon = record.milestoneType === 'child' ? '🧒' : '🧑';
              const titleText = record.milestoneType === 'child' ? 'Child Milestones' : 'Adult Milestones';
              const milestoneData = generateMilestoneStatus(record.milestoneType, record.milestones || []);

              return (
                <div key={record._id || index} style={{ marginBottom: '4rem', marginTop: '2rem' }}>
                  <h2 style={{ ...styles.sectionTitle, border: 'none', marginBottom: '1.5rem' }}>
                    <span className="me-2">{titleIcon}</span>
                    <span>{titleText} — {name}</span>
                  </h2>
                  <div style={styles.grid}>
                    {milestoneData.map((item, idx) => (
                      <motion.div
                        key={idx}
                        style={styles.card}
                        whileHover={{ translateY: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                      >
                        <p style={styles.milestoneText}>{item.milestone}</p>
                        <div style={{
                          ...styles.statusText,
                          backgroundColor: item.status ? '#dcfce7' : '#fee2e2',
                          color: item.status ? '#166534' : '#991b1b',
                        }}>
                          {item.status ? 'Achieved ✅' : 'Pending ⏳'}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <div style={styles.emptyState}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏆</div>
              <h3>No Milestones Yet</h3>
              <p>Milestones tracked by your staff will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
