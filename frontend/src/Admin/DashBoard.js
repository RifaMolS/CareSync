import React, { useEffect, useState } from 'react';
import Side from './Side';
import AdminNav from './AdminNav';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function DashBoard() {
  const [stats, setStats] = useState({
    children: 0,
    adults: 0,
    staff: 0,
    complaints: 0,
    guardians: 0,
    rooms: 0
  });
  const [loading, setLoading] = useState(true);

  // Inject animation on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [childRes, adultRes, staffRes, complianceRes, parentRes, roomRes] = await Promise.all([
          axios.get("http://localhost:5000/demo/childview"),
          axios.get("http://localhost:5000/demo/adultview"),
          axios.get("http://localhost:5000/demo/staffview"),
          axios.get("http://localhost:5000/demo/getCompliance"),
          axios.get("http://localhost:5000/demo/parentview"),
          axios.get("http://localhost:5000/demo/roomview")
        ]);

        setStats({
          children: childRes.data.length,
          adults: adultRes.data.length,
          staff: staffRes.data.length,
          complaints: complianceRes.data.data ? complianceRes.data.data.filter(c => c.status === 0).length : 0,
          guardians: parentRes.data.length,
          rooms: roomRes.data.length
        });
      } catch (err) {
        console.error("Dashboard fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes fadeSlideUp {
        0% { opacity: 0; transform: translateY(20px); }
        100% { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }, []);

  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
    marginBottom: '24px',
    transition: 'all 0.3s ease',
    flex: 1,
    minWidth: '280px',
    border: '1px solid #f0f0f0'
  };

  const Card = ({ iconClass, iconBg, label, value, delay }) => (
    <div className="col-sm-6 col-xl-4">
      <div
        className="bg-white rounded d-flex align-items-center justify-content-between p-4 shadow-sm h-100"
        style={{
          animation: 'fadeSlideUp 0.8s ease forwards',
          animationDelay: delay,
          opacity: 0,
          borderLeft: `none`, // Removed the thick black/dark bar
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Colorful left accent pill */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: '20%',
          bottom: '20%',
          width: '4px',
          backgroundColor: iconBg,
          borderRadius: '0 4px 4px 0'
        }} />

        <div className="d-flex align-items-center">
          <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px', backgroundColor: `${iconBg}15` }}>
            <i className={`fa ${iconClass}`} style={{ color: iconBg, fontSize: '1.5rem' }}></i>
          </div>
          <div className="ms-3">
            <p className="mb-0 text-muted small text-uppercase fw-bold" style={{ letterSpacing: '0.5px' }}>{label}</p>
            <h3 className="mb-0 fw-bold text-dark">{loading ? "..." : value}</h3>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="container-xxl position-relative bg-white d-flex p-0">
        <Side />
        <div className="content">
          <AdminNav />
          <div className="container-fluid pt-4 px-4">
            <h3 className="mb-4 text-primary fw-bold">Admin Dashboard</h3>

            {/* Row 1: Children, Adults, Staff */}
            <div className="row g-4 mb-4">
              <Card iconClass="fa-child" iconBg="#28a745" label="Total Children" value={stats.children} delay="0.1s" />
              <Card iconClass="fa-user" iconBg="#17a2b8" label="Total Adults" value={stats.adults} delay="0.2s" />
              <Card iconClass="fa-user-nurse" iconBg="#ffc107" label="Total Staff" value={stats.staff} delay="0.3s" />
            </div>

            {/* Row 2: Guardians, Rooms, Pending Issues */}
            <div className="row g-4 mb-4">
              <Card iconClass="fa-users" iconBg="#6f42c1" label="Total Guardians" value={stats.guardians} delay="0.4s" />
              <Card iconClass="fa-bed" iconBg="#fd7e14" label="Total Rooms" value={stats.rooms} delay="0.5s" />
              <Card iconClass="fa-exclamation-circle" iconBg="#dc3545" label="Pending Issues" value={stats.complaints} delay="0.6s" />
            </div>

            <div className="row">
              <div className="col-md-8">
                <motion.div style={cardStyle} whileHover={{ scale: 1.01 }}>
                  <h5 className="mb-4">Enrollment Growth</h5>
                  <div style={{ width: '100%', height: '300px' }}>
                    <ResponsiveContainer>
                      <LineChart data={[
                        { month: 'Jan', children: 20, adults: 5 },
                        { month: 'Feb', children: 25, adults: 8 },
                        { month: 'Mar', children: stats.children, adults: stats.adults }, // Current point
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }} />
                        <Line type="monotone" dataKey="children" stroke="#28a745" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="adults" stroke="#17a2b8" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              </div>

              <div className="col-md-4">
                <motion.div style={{ ...cardStyle, height: '100%' }} whileHover={{ scale: 1.01 }}>
                  <h5 className="mb-4 text-center">Occupancy Rate</h5>
                  <div style={{ width: '180px', margin: '0 auto' }}>
                    <CircularProgressbar
                      value={((stats.children + stats.adults) / 500) * 100} // Assuming 500 capacity
                      text={`${Math.round(((stats.children + stats.adults) / 500) * 100)}%`}
                      styles={buildStyles({
                        textColor: '#333',
                        pathColor: '#007bff',
                        trailColor: '#f4f4f4'
                      })}
                    />
                  </div>
                  <p className="text-center mt-3 text-muted">Total Capacity: 500</p>
                </motion.div>
              </div>
            </div>

            {/* Recent Activity Mock for Visuals */}
            <div className="row">
              <div className="col-12">
                <motion.div style={cardStyle}>
                  <h5 className="mb-3">Administrative Actions</h5>
                  <div className="alert alert-light border-start border-4 border-info">
                    <strong>System Update:</strong> New Emergency Contact module live.
                  </div>
                  <div className="alert alert-light border-start border-4 border-success">
                    <strong>Enrollment:</strong> {stats.children} children and {stats.adults} adults currently active.
                  </div>
                </motion.div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
