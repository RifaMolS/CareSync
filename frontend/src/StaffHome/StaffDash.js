import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
} from 'recharts';
import StaffSide from './StaffSide';
import StaffNav from './StaffNav';
import axios from 'axios';
import { FaUserMd, FaChild, FaUserClock, FaTasks } from 'react-icons/fa';

export default function StaffDash() {
  const [userData, setUserData] = useState({});
  const [shiftData, setShiftData] = useState(null);
  const [assignments, setAssignments] = useState({ children: 0, adults: 0, list: [] });
  const [loading, setLoading] = useState(true);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const auth = JSON.parse(localStorage.getItem("user"));
        const staffId = auth?._id || auth?.regid;

        if (!staffId) return;

        // 1. Fetch Staff Profile
        const staffRes = await axios.get('http://localhost:5000/demo/staffview');
        const staff = staffRes.data.find(
          (item) => String(item._id) === String(staffId) || String(item.regid) === String(staffId)
        );
        if (staff) setUserData(staff);

        // 2. Fetch Shift Details
        try {
          const shiftRes = await axios.post("http://localhost:5000/demo/staffidview", { auth: auth.regid });
          setShiftData(shiftRes.data);
        } catch (e) { console.log("Shift fetch error", e); }

        // 3. Fetch Assignments (My Wards)
        const assignRes = await axios.get("http://localhost:5000/demo/assignments");
        const myAssignments = assignRes.data.filter(a => {
          const sId = a.staffId?._id || a.staffId;
          return String(sId) === String(staff?._id);
        });

        setAssignments({
          children: myAssignments.filter(a => a.childId).length,
          adults: myAssignments.filter(a => a.adultId).length,
          list: myAssignments
        });

      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const role = (userData?.role || userData?.regid?.role || "Staff").toLowerCase();
  const currentShift = shiftData?.shift || userData?.shift || "Not Assigned";

  const taskData = [
    { name: 'Completed', value: 12, color: '#22c55e' },
    { name: 'Pending', value: 5, color: '#f59e0b' }
  ];

  if (loading) {
    return (
      <div className="d-flex min-vh-100 bg-light">
        <StaffSide />
        <div className="content w-100">
          <StaffNav />
          <div className="d-flex justify-content-center align-items-center h-100">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex min-vh-100 bg-light">
      <StaffSide />
      <div className="content w-100">
        <StaffNav />
        <motion.div
          className="container-fluid pt-4 px-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Welcome Header */}
          <motion.div
            variants={itemVariants}
            className="d-flex justify-content-between align-items-center mb-5 p-4 rounded-4"
            style={{
              background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
              color: "white",
              boxShadow: "0 10px 30px rgba(79, 70, 229, 0.3)"
            }}
          >
            <div>
              <h2 className="fw-bold mb-1">
                Welcome back, {userData?.regid?.name || "Member"}! 👋
              </h2>
              <p className="mb-0 opacity-75">Here me your care unit overview for today.</p>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-md p-2 px-4 rounded-pill border border-white border-opacity-30">
              <span className="small text-uppercase text-primary fw-bold me-2">Role:</span>
              <span className="badge bg-white text-primary text-capitalize px-3 py-2 rounded-pill shadow-sm">{role}</span>
            </div>
          </motion.div>

          {/* Key Metrics Cards */}
          <div className="row g-4 mb-5">
            <div className="col-md-3">
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="card border-0 shadow-sm h-100 rounded-4 overflow-hidden"
                style={{ background: "#ffffff" }}
              >
                <div className="card-body p-4 position-relative">
                  <div className="position-absolute end-0 bottom-0 m-3 opacity-10">
                    <FaUserClock size={60} color="#6366f1" />
                  </div>
                  <h6 className="text-uppercase text-muted small fw-bold mb-3" style={{ letterSpacing: '1px' }}>Current Shift</h6>
                  <h3 className="fw-bold mb-1 text-capitalize text-indigo" style={{ color: '#4338ca' }}>
                    {currentShift}
                  </h3>
                  <div className="mt-3">
                    <span className="badge bg-success-subtle text-success rounded-pill px-3 py-2 border border-success-subtle">
                      <span className="d-inline-block bg-success rounded-circle me-2" style={{ width: '8px', height: '8px' }}></span>
                      Active & On Time
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="col-md-3">
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="card border-0 shadow-sm h-100 rounded-4"
                style={{ background: "#ffffff" }}
              >
                <div className="card-body p-4">
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <div className="bg-success-subtle p-3 rounded-4 text-success border border-success-subtle">
                      <FaChild size={24} />
                    </div>
                    <div className="text-end">
                      <h6 className="text-uppercase text-muted small fw-bold mb-1">Children</h6>
                      <h2 className="fw-bold mb-0 text-success">{assignments.children}</h2>
                    </div>
                  </div>
                  <div className="progress rounded-pill shadow-sm" style={{ height: '8px', background: '#f0fdf4' }}>
                    <div className="progress-bar bg-success rounded-pill" style={{ width: '70%', boxShadow: '0 0 10px rgba(34, 197, 94, 0.4)' }}></div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="col-md-3">
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="card border-0 shadow-sm h-100 rounded-4"
                style={{ background: "#ffffff" }}
              >
                <div className="card-body p-4">
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <div className="bg-info-subtle p-3 rounded-4 text-info border border-info-subtle">
                      <FaUserMd size={24} />
                    </div>
                    <div className="text-end">
                      <h6 className="text-uppercase text-muted small fw-bold mb-1">Adults</h6>
                      <h2 className="fw-bold mb-0 text-info">{assignments.adults}</h2>
                    </div>
                  </div>
                  <div className="progress rounded-pill shadow-sm" style={{ height: '8px', background: '#f0f9ff' }}>
                    <div className="progress-bar bg-info rounded-pill" style={{ width: '45%', boxShadow: '0 0 10px rgba(14, 165, 233, 0.4)' }}></div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="col-md-3">
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="card border-0 shadow-sm h-100 rounded-4"
                style={{
                  background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                  color: "white"
                }}
              >
                <div className="card-body p-4 d-flex flex-column justify-content-between">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <FaTasks size={32} className="opacity-50" />
                    <span className="badge bg-white bg-opacity-20 rounded-pill px-3 text-primary">Weekly Target</span>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-0">Tasks Progress</h5>
                    <h2 className="display-4 fw-bold mb-0">85%</h2>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="row g-4">
            {/* My Wards List */}
            <div className="col-md-8">
              <motion.div variants={itemVariants} className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-header bg-white p-4 border-bottom-0 d-flex justify-content-between align-items-center">
                  <h5 className="fw-bold mb-0">👥 My Care Recipients</h5>
                  <button className="btn btn-sm btn-light rounded-pill px-3 border shadow-sm">View All</button>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table align-middle table-hover mb-0">
                      <thead style={{ background: '#f8fafc' }}>
                        <tr>
                          <th className="ps-4 py-3 border-0 text-muted small text-uppercase">Name</th>
                          <th className="py-3 border-0 text-muted small text-uppercase">Type</th>
                          <th className="py-3 border-0 text-muted small text-uppercase">Guardian</th>
                          <th className="py-3 border-0 text-muted small text-uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assignments.list.length === 0 ? (
                          <tr><td colSpan="4" className="text-center py-5 text-muted italic">No wards assigned yet.</td></tr>
                        ) : (
                          assignments.list.map((assign, idx) => {
                            const ward = assign.childId || assign.adultId;
                            const isChild = !!assign.childId;
                            const details = ward?.regid || {};
                            const name = details.childname || details.adultname || details.name || "Unknown";

                            return (
                              <tr key={idx} style={{ cursor: 'pointer' }}>
                                <td className="ps-4 py-3">
                                  <div className="d-flex align-items-center">
                                    <div className={`rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3 shadow-sm ${isChild ? 'bg-success' : 'bg-info'}`}
                                      style={{
                                        width: '42px',
                                        height: '42px',
                                        background: isChild ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)'
                                      }}>
                                      {name[0]}
                                    </div>
                                    <div>
                                      <h6 className="mb-0 fw-bold">{name}</h6>
                                      <small className="text-muted">{details.age ? `${details.age} yrs` : 'N/A'}</small>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3">
                                  <span className={`badge ${isChild ? 'bg-success-subtle text-success' : 'bg-info-subtle text-info'} rounded-pill px-3 py-2 border ${isChild ? 'border-success-subtle' : 'border-info-subtle'}`}>
                                    {isChild ? "Child" : "Adult"}
                                  </span>
                                </td>
                                <td className="py-3">
                                  <span className="text-dark fw-medium">{assign.parentId?.parentname || "N/A"}</span>
                                </td>
                                <td className="py-3">
                                  <span className="badge bg-light text-secondary border rounded-pill px-3 py-1">Active Care</span>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Task Completion Pie Chart */}
            <div className="col-md-4">
              <motion.div variants={itemVariants} className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
                <div className="card-header bg-white p-4 border-bottom-0">
                  <h5 className="fw-bold mb-0">📊 Daily Overview</h5>
                </div>
                <div className="card-body d-flex flex-column align-items-center justify-content-center p-4">
                  <div style={{ width: '100%', height: '220px', position: 'relative' }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={taskData}
                          innerRadius={70}
                          outerRadius={90}
                          paddingAngle={8}
                          dataKey="value"
                        >
                          {taskData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="position-absolute top-50 start-50 translate-middle text-center">
                      <h3 className="fw-bold mb-0">12</h3>
                      <small className="text-muted">Total</small>
                    </div>
                  </div>
                  <div className="text-center mt-4 w-100">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted small">Completed Activities</span>
                      <span className="fw-bold small text-success">12</span>
                    </div>
                    <div className="d-flex justify-content-between mb-4">
                      <span className="text-muted small">Pending Tasks</span>
                      <span className="fw-bold small text-warning">5</span>
                    </div>
                    <button className="btn btn-primary rounded-pill w-100 py-2 fw-bold shadow-sm" style={{ background: '#4f46e5' }}>Activity Log</button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
