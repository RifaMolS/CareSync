import React, { useEffect } from 'react';
import { motion } from 'framer-motion'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts'
import ParentNav from './ParentNav';
import ParentSide from './ParentSide';

export default function ParentHome() {

  const styles = {
    container: {
      backgroundColor: "#f3f4f6", // Light gray background
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
    },
    headerTitle: {
      fontSize: "2.2rem",
      fontWeight: "800",
      marginBottom: "0.5rem",
    },
    headerSubtitle: {
      fontSize: "1.1rem",
      opacity: 0.9,
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "1.5rem",
      marginBottom: "2rem",
    },
    card: {
      backgroundColor: "white",
      borderRadius: "1rem",
      padding: "1.5rem",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      transition: "transform 0.2s, box-shadow 0.2s",
      border: "1px solid #e5e7eb",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: "100%",
    },
    cardTitle: {
      fontSize: "1rem",
      fontWeight: "600",
      color: "#6b7280",
      marginBottom: "0.5rem",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
    },
    cardValue: {
      fontSize: "2rem",
      fontWeight: "800",
      color: "#1f2937",
    },
    cardIcon: {
      fontSize: "2.5rem",
      opacity: 0.8,
    },
    sectionTitle: {
      fontSize: "1.5rem",
      fontWeight: "700",
      color: "#1f2937",
      marginBottom: "1.5rem",
      borderLeft: "5px solid #3b82f6",
      paddingLeft: "1rem",
    },
    chartContainer: {
      backgroundColor: "white",
      borderRadius: "1rem",
      padding: "1.5rem",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      height: "400px",
      marginBottom: "2rem",
    },
    tableContainer: {
      backgroundColor: "white",
      borderRadius: "1rem",
      padding: "1.5rem",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    th: {
      textAlign: "left",
      padding: "1rem",
      borderBottom: "2px solid #f3f4f6",
      color: "#6b7280",
      fontWeight: "600",
      fontSize: "0.9rem",
    },
    td: {
      padding: "1rem",
      borderBottom: "1px solid #f3f4f6",
      color: "#374151",
    }
  };

  // Inject animation on mount
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes fadeSlideUp {
        0% { opacity: 0; transform: translateY(20px); }
        100% { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }, []);

  const [liveAlerts, setLiveAlerts] = React.useState({ medication: null, immunization: null });
  const auth = JSON.parse(localStorage.getItem("user"));
  const parentId = auth?.regid;

  useEffect(() => {
    if (parentId) {
      // Fetch Medication
      fetch("http://localhost:5000/demo/getmedicationsbyparentid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parentId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            // Find the most relevant pending med (closest time today)
            const pending = data.find(m => {
              const lastTaken = m.takenHistory?.length ? m.takenHistory[m.takenHistory.length - 1] : null;
              return !lastTaken || new Date(lastTaken.date).toDateString() !== new Date().toDateString();
            });
            setLiveAlerts(prev => ({ ...prev, medication: pending || null }));
          }
        });

      // Fetch Immunization
      fetch("http://localhost:5000/demo/get-immunizations-by-parent-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parentId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            // Find closest upcoming due date
            const upcoming = data
              .filter(r => r.status !== 'completed' && r.nextDueDate)
              .sort((a, b) => new Date(a.nextDueDate) - new Date(b.nextDueDate))[0];
            setLiveAlerts(prev => ({ ...prev, immunization: upcoming || null }));
          }
        });
    }
  }, [parentId]);

  // Reusable Stat Card
  const StatCard = ({ iconClass, iconColor, label, value, delay }) => (
    <motion.div
      style={styles.card}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: parseFloat(delay) }}
      whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
    >
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <div style={styles.cardTitle}>{label}</div>
          <div style={styles.cardValue}>{value}</div>
        </div>
        <i className={`fa ${iconClass} ${iconColor}`} style={styles.cardIcon}></i>
      </div>
    </motion.div>
  );

  return (
    <div className="container-fluid p-0" style={{ ...styles.container, overflow: 'hidden' }}>
      <ParentSide />
      <div className="content-main" style={{
        marginLeft: "260px",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f8fafc",
        transition: "margin-left 0.3s ease"
      }}>
        <ParentNav />

        {/* Scrollable Content Area */}
        <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
          {/* Header Banner */}
          <div style={{ padding: "1.5rem 2rem" }}>
            <div style={{
              ...styles.header,
              margin: 0,
              padding: "3rem 2.5rem",
              borderRadius: "24px",
              background: "linear-gradient(135deg, #0d6efd 0%, #00d2ff 100%)",
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h1 style={{ ...styles.headerTitle, fontSize: '2.5rem', marginBottom: '0.8rem' }}>Welcome Back, Guardian! 👋</h1>
                <p style={{ ...styles.headerSubtitle, fontSize: '1.2rem', opacity: 0.95 }}>Here is your dashboard overview for today.</p>
              </div>
              {/* Decorative circle */}
              <div style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                zIndex: 0
              }} />
            </div>
          </div>

          <div className="container-fluid pb-5 px-4">
            {/* Stats Grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1.5rem",
              marginBottom: "2.5rem"
            }}>
              <StatCard iconClass="fa-child" iconColor="text-primary" label="Children Enrolled" value="1" delay="0.1" />
              <StatCard iconClass="fa-user" iconColor="text-info" label="Adults Enrolled" value="2" delay="0.2" />
              <StatCard iconClass="fa-layer-group" iconColor="text-warning" label="Active Features" value="12" delay="0.3" />
              <StatCard iconClass="fa-chart-line" iconColor="text-success" label="Engagement" value="92%" delay="0.4" />
            </div>

            {/* Health Alerts Section */}
            <div className="row mb-4">
              <div className="col-12">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{
                    backgroundColor: '#fffbeb',
                    border: '1px solid #fef3c7',
                    borderRadius: '20px',
                    padding: '1.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-warning-subtle p-2 rounded-circle text-warning me-3">
                      <i className="fa fa-heartbeat"></i>
                    </div>
                    <h5 className="mb-0 fw-bold text-warning-emphasis">Active Health Reminders</h5>
                  </div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="bg-white p-3 rounded-4 border h-100">
                        <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '0.65rem' }}>Next Immunization</small>
                        {liveAlerts.immunization ? (
                          <p className="mb-0 mt-1 fw-bold text-primary" style={{ fontSize: '0.9rem' }}>
                            💉 {liveAlerts.immunization.vaccineName} for {liveAlerts.immunization.childId?.childname || liveAlerts.immunization.adultId?.adultname} on {new Date(liveAlerts.immunization.nextDueDate).toLocaleDateString()}
                          </p>
                        ) : (
                          <p className="mb-0 mt-1 text-muted" style={{ fontSize: '0.9rem' }}>No upcoming vaccinations.</p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="bg-white p-3 rounded-4 border h-100">
                        <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '0.65rem' }}>Next Medication</small>
                        {liveAlerts.medication ? (
                          <p className="mb-0 mt-1 fw-bold text-success" style={{ fontSize: '0.9rem' }}>
                            💊 {liveAlerts.medication.name} ({liveAlerts.medication.dosage}) at {liveAlerts.medication.time} for {liveAlerts.medication.childId?.regid?.childname || liveAlerts.medication.adultId?.regid?.adultname}
                          </p>
                        ) : (
                          <p className="mb-0 mt-1 text-muted" style={{ fontSize: '0.9rem' }}>No pending medicines today.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="row g-4 mb-4">
              <div className="col-lg-7">
                <div style={{ ...styles.chartContainer, padding: '2rem', borderRadius: '24px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 style={{ ...styles.sectionTitle, border: 'none', margin: 0, fontSize: '1.25rem' }}>Growth Trends</h4>
                    <span className="badge bg-light text-primary px-3 py-2 rounded-pill">Yearly Progress</span>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={[
                      { age: '1', height: 74, weight: 10 },
                      { age: '2', height: 85, weight: 12 },
                      { age: '3', height: 95, weight: 14 },
                      { age: '4', height: 102, weight: 16 },
                      { age: '5', height: 110, weight: 18 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="age" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                        itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                      />
                      <Line type="monotone" dataKey="height" stroke="#0d6efd" strokeWidth={4} dot={{ r: 6, fill: '#0d6efd', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={4} dot={{ r: 6, fill: '#10b981', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="col-lg-5">
                <div style={{ ...styles.chartContainer, padding: '2rem', borderRadius: '24px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 style={{ ...styles.sectionTitle, border: 'none', margin: 0, fontSize: '1.25rem' }}>Skill Development</h4>
                    <span className="badge bg-light text-purple px-3 py-2 rounded-pill" style={{ color: '#8b5cf6' }}>Activity Metrics</span>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { name: 'Lang', progress: 80 },
                      { name: 'Motor', progress: 70 },
                      { name: 'Social', progress: 90 },
                      { name: 'Cogn', progress: 85 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                      <Bar dataKey="progress" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={35} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Feedback Section */}
            <div className="row g-4">
              <div className="col-12">
                <div style={{ ...styles.card, padding: '2.5rem', borderRadius: '24px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                  <div className="d-flex align-items-center mb-4">
                    <h4 style={{ ...styles.sectionTitle, border: 'none', margin: 0 }}>Recent Staff Feedback</h4>
                  </div>
                  <div className="row g-4">
                    {[
                      { name: "Mrs. Priya", rating: 5, comment: "Great care and development!", role: "Caregiver", icon: "fa-user-nurse" },
                      { name: "Mr. Arun", rating: 4, comment: "Good progress, happy with staff participation.", role: "Activity Coord.", icon: "fa-user-tie" },
                      { name: "Mrs. Rekha", rating: 5, comment: "Amazing support and growth tracking.", role: "Nurse", icon: "fa-stethoscope" }
                    ].map((fb, idx) => (
                      <div className="col-md-4" key={idx}>
                        <div style={{ background: "#f8fafc", padding: "1.5rem", borderRadius: "20px", border: "1px solid #f1f5f9", height: '100%' }}>
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="d-flex align-items-center">
                              <div className="bg-white rounded-circle p-2 me-2 border d-flex align-items-center justify-content-center" style={{ width: '35px', height: '35px' }}>
                                <i className={`fa ${fb.icon} text-primary`} style={{ fontSize: '0.9rem' }}></i>
                              </div>
                              <h5 className="m-0 fw-bold" style={{ fontSize: '0.95rem', color: '#1e293b' }}>{fb.name}</h5>
                            </div>
                            <div style={{ color: '#fbbf24', fontSize: '0.75rem' }}>
                              {"★".repeat(fb.rating)}{"☆".repeat(5 - fb.rating)}
                            </div>
                          </div>
                          <small className="text-muted d-block mb-3 fw-medium text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>{fb.role}</small>
                          <p className="mb-0 text-secondary italic" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>"{fb.comment}"</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
