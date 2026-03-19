import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footerpage from './Footerpage';
import axios from 'axios';

const ChildCareAttendance = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [animate, setAnimate] = useState(false);

  // Dynamic Data State
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [healthReports, setHealthReports] = useState([]);
  const [stats, setStats] = useState({
    present: 0,
    absent: 0,
    rate: 0
  });

  useEffect(() => {
    setAnimate(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // 1. Fetch Attendance (using Validation ID)
      if (user && user._id) {
        const attRes = await axios.post("http://localhost:5000/demo/child/attendance/self", { childId: user._id });
        const records = attRes.data;
        setAttendanceRecords(records);

        // Calculate Stats
        const presentCount = records.filter(r => r.status.includes("Present") || r.status.includes("Check-in")).length;
        const absentCount = records.filter(r => r.status.includes("Absent")).length;
        const total = records.length;
        const rate = total > 0 ? Math.round((presentCount / total) * 100) : 0;

        setStats({ present: presentCount, absent: absentCount, rate });
      }

      // 2. Fetch Health Reports (using Profile ID)
      if (user && user.regid) {
        const healthRes = await axios.post("http://localhost:5000/demo/child/health/self", { id: user.regid });
        setHealthReports(healthRes.data);
      }

    } catch (err) {
      console.error("Error fetching child data:", err);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: '0 auto', paddingStart: '130px', paddingEnd: '130px', paddingTop: '10px' }}>
      <Navbar />
      <div style={{ padding: '0 130px', marginTop: '40px' }}>
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ color: '#4a6fa5', fontSize: '36px', margin: '0 0 10px 0' }}>My Attendance & Health 🌟</h1>
          <p style={{ color: '#666', fontSize: '18px' }}>Tracking your daily shines and growing strong!</p>
        </header>

        {/* Top Stats Cards */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', gap: '20px' }}>
          <div
            style={{
              flex: '1',
              background: 'linear-gradient(135deg, #6a98d3, #4a6fa5)',
              borderRadius: '12px',
              padding: '20px',
              color: 'white',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              transform: animate ? 'translateY(0)' : 'translateY(20px)',
              opacity: animate ? '1' : '0',
              transition: 'transform 0.5s ease, opacity 0.5s ease',
            }}
          >
            <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>My Attendance Rate</h3>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.rate}%</div>
            <div style={{ fontSize: '14px', marginTop: '5px' }}>
              Keep showing up! 🚀
            </div>
          </div>

          <div
            style={{
              flex: '1',
              background: 'linear-gradient(135deg, #66bb6a, #43a047)',
              borderRadius: '12px',
              padding: '20px',
              color: 'white',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              transform: animate ? 'translateY(0)' : 'translateY(20px)',
              opacity: animate ? '1' : '0',
              transition: 'transform 0.5s ease 0.2s, opacity 0.5s ease 0.2s',
            }}
          >
            <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>Days Present</h3>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.present}</div>
            <div style={{ fontSize: '14px', marginTop: '5px' }}>
              Days of fun & learning!
            </div>
          </div>

          <div
            style={{
              flex: '1',
              background: 'linear-gradient(135deg, #ff9966, #ff5e62)',
              borderRadius: '12px',
              padding: '20px',
              color: 'white',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              transform: animate ? 'translateY(0)' : 'translateY(20px)',
              opacity: animate ? '1' : '0',
              transition: 'transform 0.5s ease 0.4s, opacity 0.5s ease 0.4s',
            }}
          >
            <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>Health Checks</h3>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{healthReports.length}</div>
            <div style={{ fontSize: '14px', marginTop: '5px' }}>
              Reports on file
            </div>
          </div>
        </div>

        {/* Attendance History List */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '30px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transform: animate ? 'translateY(0)' : 'translateY(20px)',
            opacity: animate ? '1' : '0',
            transition: 'transform 0.5s ease 0.6s, opacity 0.5s ease 0.6s',
          }}
        >
          <h2 style={{ margin: '0 0 20px 0', color: '#4a6fa5', fontSize: '20px' }}>Recent Attendance Log</h2>
          {attendanceRecords.length > 0 ? (
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {attendanceRecords.map((record, index) => (
                <div
                  key={record._id || index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '15px',
                    borderBottom: '1px solid #eee',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#333' }}>
                      {new Date(record.date).toLocaleDateString()}
                    </div>
                    <div style={{ fontSize: '12px', color: '#888' }}>
                      {new Date(record.date).toLocaleTimeString()}
                    </div>
                  </div>
                  <span
                    style={{
                      padding: '5px 12px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      backgroundColor: record.status.includes('Absent') ? '#ffebee' : '#e8f5e9',
                      color: record.status.includes('Absent') ? '#c62828' : '#2e7d32'
                    }}
                  >
                    {record.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: '#777', fontStyle: 'italic' }}>No attendance records found yet.</p>
          )}
        </div>

        {/* Health Reports Section */}
        {healthReports.length > 0 && (
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '30px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              transform: animate ? 'translateY(0)' : 'translateY(20px)',
              opacity: animate ? '1' : '0',
              transition: 'transform 0.5s ease 0.8s, opacity 0.5s ease 0.8s',
            }}
          >
            <h2 style={{ margin: '0 0 20px 0', color: '#4a6fa5', fontSize: '20px' }}>My Growth Updates</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
              {healthReports.map((report, idx) => (
                <div key={idx} style={{ border: '1px solid #e0e0e0', borderRadius: '10px', padding: '15px', backgroundColor: '#fafafa' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px', color: '#0277bd' }}>
                    {new Date(report.date).toLocaleDateString()}
                  </div>
                  <div style={{ fontSize: '14px' }}>📏 Height: <strong>{report.height} cm</strong></div>
                  <div style={{ fontSize: '14px' }}>⚖️ Weight: <strong>{report.weight} kg</strong></div>
                  {report.incidentDescription && (
                    <div style={{ marginTop: '10px', fontSize: '13px', color: '#d32f2f', backgroundColor: '#ffebee', padding: '5px', borderRadius: '5px' }}>
                      Note: {report.incidentDescription}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <Footerpage />
      </div>
    </div>
  );
};

export default ChildCareAttendance;