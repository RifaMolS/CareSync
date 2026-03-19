import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StaffSide from "./StaffSide";
import StaffNav from "./StaffNav";
import { Link } from "react-router-dom";
import { FaPlus, FaClock, FaEdit, FaChild, FaUser, FaFilter } from "react-icons/fa";

export default function DailyActivities() {
  const [refresh, setRefresh] = useState(0);
  const [activityName, setActivityName] = useState("");
  const [time, setTime] = useState("");
  const [category, setCategory] = useState("child");
  const [age, setAge] = useState("1-3");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [activities, setActivities] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const auth = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();
  const staffId = auth?.regid;

  const childAges = ["1-3", "4-6", "7-10", "11-13", "14-17"];
  const adultAges = ["60-65", "66-70", "70+"];

  const generateDateOptions = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) { // Optimized to last 30 days for dropdown
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split("T")[0]);
    }
    return dates;
  };

  const formatDate = (dateStr) => new Date(dateStr).toISOString().split("T")[0];

  useEffect(() => {
    fetch("http://localhost:5000/demo/activityview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ staffId }),
    })
      .then((res) => res.json())
      .then((data) => setActivities(data))
      .catch((err) => console.error("Error fetching activities:", err));
  }, [refresh, staffId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activityName || !time) return alert("Please fill in all fields.");

    const param = {
      activityName,
      time,
      category,
      age,
      date: selectedDate,
      staffId: staffId,
    };

    try {
      const res = await fetch("http://localhost:5000/demo/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(param),
      });

      if (!res.ok) throw new Error("Failed");

      setRefresh((prev) => prev + 1);
      setActivityName("");
      setTime("");
      setShowAddForm(false);
      alert("✅ Activity Logged Successfully!");
    } catch (err) {
      alert("Error adding activity. Please try again.");
    }
  };

  const filteredActivities = activities.filter(
    (act) => formatDate(act.date) === formatDate(selectedDate)
  );

  const ActivityCard = ({ act }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ translateY: -5 }}
      className="card border-0 shadow-sm h-100"
    >
      <div className={`card-body p-4 border-start border-4 ${act.category === 'child' ? 'border-success' : 'border-info'}`}>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <span className={`badge ${act.category === 'child' ? 'bg-success-subtle text-success' : 'bg-info-subtle text-info'} rounded-pill px-3`}>
            {act.category === 'child' ? <FaChild className="me-1" /> : <FaUser className="me-1" />}
            {act.category === 'child' ? 'Child Care' : 'Adult Care'}
          </span>
          <Link to="/updateactivity" state={{ id: act._id }} className="text-secondary opacity-50 hover-opacity-100">
            <FaEdit />
          </Link>
        </div>

        <h5 className="fw-bold text-dark mb-2">{act.activityName}</h5>

        <div className="d-flex align-items-center text-muted small mb-3">
          <FaClock className="me-2" /> {act.time}
        </div>

        <div className="d-flex justify-content-between align-items-center border-top pt-3 mt-2">
          <span className="text-muted small">Target Group:</span>
          <span className="fw-bold text-dark">{act.age} yrs</span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="container-xxl position-relative bg-light d-flex p-0" style={{ minHeight: '100vh' }}>
      <StaffSide />
      <div className="content">
        <StaffNav />

        <div className="container-fluid pt-4 px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="d-flex flex-wrap justify-content-between align-items-center mb-5 p-4 rounded-4"
            style={{
              background: 'white',
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
              border: '1px solid rgba(0,0,0,0.05)'
            }}
          >
            <div>
              <h3 className="fw-bold text-dark mb-1">📅 Activity Scheduler</h3>
              <p className="text-muted mb-0">Plan and track daily care routines with precision.</p>
            </div>
            <button
              className="btn btn-primary rounded-pill px-4 py-2 shadow-sm d-flex align-items-center"
              style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', border: 'none' }}
              onClick={() => setShowAddForm(!showAddForm)}
            >
              <FaPlus className="me-2" /> Log New Activity
            </button>
          </motion.div>

          {/* Add Activity Form Panel */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="card border-0 shadow-lg mb-5 overflow-hidden bg-white rounded-4"
              >
                <div className="card-header bg-dark text-white p-4 border-bottom-0 d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 fw-bold">Log New Activity</h5>
                  <button className="btn-close btn-close-white" onClick={() => setShowAddForm(false)}></button>
                </div>
                <div className="card-body p-4">
                  <form onSubmit={handleSubmit}>
                    <div className="row g-4">
                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-bold text-uppercase">Activity Name</label>
                        <input
                          type="text"
                          className="form-control form-control-lg border-2 shadow-sm"
                          style={{ borderRadius: '12px' }}
                          placeholder="e.g. Morning Yoga, Painting..."
                          value={activityName}
                          onChange={(e) => setActivityName(e.target.value)}
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label text-muted small fw-bold text-uppercase">Time</label>
                        <input
                          type="time"
                          className="form-control form-control-lg border-2 shadow-sm"
                          style={{ borderRadius: '12px' }}
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label text-muted small fw-bold text-uppercase">Date</label>
                        <input
                          type="date"
                          className="form-control form-control-lg border-2 shadow-sm"
                          style={{ borderRadius: '12px' }}
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label text-muted small fw-bold text-uppercase">Category</label>
                        <select
                          className="form-select form-select-lg border-2 shadow-sm"
                          style={{ borderRadius: '12px' }}
                          value={category}
                          onChange={(e) => {
                            setCategory(e.target.value);
                            setAge(e.target.value === "child" ? childAges[0] : adultAges[0]);
                          }}
                        >
                          <option value="child">Child Care</option>
                          <option value="adult">Adult Care</option>
                        </select>
                      </div>
                      <div className="col-md-3">
                        <label className="form-label text-muted small fw-bold text-uppercase">Target Age</label>
                        <select
                          className="form-select form-select-lg border-2 shadow-sm"
                          style={{ borderRadius: '12px' }}
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                        >
                          {(category === "child" ? childAges : adultAges).map((a) => (
                            <option key={a} value={a}>{a} yrs</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-12 d-flex justify-content-end mt-5">
                        <button type="button" className="btn btn-light me-3 rounded-pill px-4 border" onClick={() => setShowAddForm(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary rounded-pill px-5 fw-bold shadow" style={{ background: '#4f46e5' }}>Save Activity</button>
                      </div>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Filters & Content */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="bg-white p-2 px-3 rounded-pill shadow-sm border d-flex align-items-center">
              <FaFilter className="text-primary me-2" />
              <span className="text-muted small fw-bold text-uppercase me-3">Date Filter:</span>
              <select
                className="form-select form-select-sm border-0 shadow-none fw-bold text-primary"
                style={{ width: 'auto', background: 'transparent' }}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              >
                {generateDateOptions().map((date) => (
                  <option key={date} value={date}>
                    {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredActivities.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-5 bg-white rounded-4 shadow-sm border-dashed border-2"
            >
              <div className="mb-3 text-muted display-4 opacity-25">📋</div>
              <h4 className="fw-bold text-dark">No activities scheduled</h4>
              <p className="text-muted small">Log a new routine to start tracking care for this date.</p>
            </motion.div>
          ) : (
            <div className="row g-4">
              {filteredActivities.map((act) => (
                <div key={act._id} className="col-md-6 col-xl-3">
                  <ActivityCard act={act} />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
