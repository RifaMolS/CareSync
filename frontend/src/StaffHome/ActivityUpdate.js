import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import StaffNav from './StaffNav';
import StaffSide from './StaffSide';
import { FaEdit, FaSave, FaArrowLeft, FaClock, FaChild, FaUser, FaCalendarAlt } from 'react-icons/fa';

const ActivityUpdate = () => {
  const [activityName, setActivityName] = useState('');
  const [time, setTime] = useState('');
  const [category, setCategory] = useState('child');
  const [age, setAge] = useState('1-3');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const location = useLocation();
  const navigate = useNavigate();

  const [auth] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  const staffId = auth?.regid;

  // Consistent age ranges with DailyActivities.js
  const childAges = ['1-3', '4-6', '7-10', '11-13', '14-17'];
  const adultAges = ["60-65", "66-70", "70+"];

  useEffect(() => {
    if (!location.state || !location.state.id) return navigate('/DailyActivities');

    const fetchActivity = async () => {
      try {
        const res = await fetch("http://localhost:5000/demo/activityid", {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id: location.state.id })
        });
        const result = await res.json();
        if (result) {
          setActivityName(result.activityName || '');
          setTime(result.time || '');
          setCategory(result.category || 'child');
          setAge(result.age || (result.category === 'adult' ? adultAges[0] : childAges[0]));
          setDate(result.date ? new Date(result.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
        }
      } catch (err) {
        console.error('Error fetching activity:', err);
      }
    };

    fetchActivity();
  }, [location.state, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!location.state || !location.state.id) return;

    const updatedActivity = {
      id: location.state.id,
      activityName,
      time,
      category,
      age,
      date,
      staffId
    };

    try {
      const res = await fetch('http://localhost:5000/demo/activityupdate', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedActivity)
      });

      const data = await res.json();

      // Note: Check backend response structure. Defaulting to success if no error thrown for now
      if (res.ok) {
        alert('✅ Activity updated successfully!');
        navigate('/DailyActivities');
      } else {
        alert(`⚠️ Update failed: ${data.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error('❌ Update failed', err);
      alert('❌ Failed to update activity.');
    }
  };

  return (
    <div className="container-xxl position-relative bg-light d-flex p-0" style={{ minHeight: '100vh' }}>
      <StaffSide />
      <div className="content">
        <StaffNav />

        <div className="container-fluid pt-4 px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="d-flex align-items-center mb-4"
          >
            <button onClick={() => navigate(-1)} className="btn btn-light rounded-circle me-3 shadow-sm"><FaArrowLeft /></button>
            <div>
              <h3 className="fw-bold text-dark mb-0">Edit Activity</h3>
              <p className="text-muted mb-0">Modify scheduled care details</p>
            </div>
          </motion.div>

          <div className="row justify-content-center">
            <div className="col-lg-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card border-0 shadow-lg rounded-4 overflow-hidden"
              >
                <div className="card-header bg-primary text-white p-4 border-bottom-0">
                  <div className="d-flex align-items-center">
                    <FaEdit className="display-6 me-3 opacity-50" />
                    <h5 className="mb-0 fw-bold">Activity Information</h5>
                  </div>
                </div>

                <div className="card-body p-4 p-md-5">
                  <form onSubmit={handleUpdate}>
                    <div className="row g-4">
                      <div className="col-12">
                        <label className="form-label text-muted fw-bold small text-uppercase">Activity Name</label>
                        <input
                          type="text"
                          className="form-control form-control-lg bg-light border-0"
                          placeholder="e.g. Morning Walk"
                          value={activityName}
                          onChange={(e) => setActivityName(e.target.value)}
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label text-muted fw-bold small text-uppercase">Care Category</label>
                        <div className="d-flex gap-3">
                          <label className={`btn btn-outline-success flex-fill rounded-pill py-2 border-2 ${category === 'child' ? 'active fw-bold' : ''}`}>
                            <input type="radio" name="cat" value="child" checked={category === 'child'} onChange={(e) => { setCategory('child'); setAge(childAges[0]) }} className="d-none" />
                            <FaChild className="me-2" /> Child
                          </label>
                          <label className={`btn btn-outline-info flex-fill rounded-pill py-2 border-2 ${category === 'adult' ? 'active fw-bold' : ''}`}>
                            <input type="radio" name="cat" value="adult" checked={category === 'adult'} onChange={(e) => { setCategory('adult'); setAge(adultAges[0]) }} className="d-none" />
                            <FaUser className="me-2" /> Adult
                          </label>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label text-muted fw-bold small text-uppercase">Target Age</label>
                        <select
                          className="form-select form-select-lg bg-light border-0"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                        >
                          {(category === 'child' ? childAges : adultAges).map(a => (
                            <option key={a} value={a}>{a} yrs</option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label text-muted fw-bold small text-uppercase"><FaClock className='me-2' />Time</label>
                        <input
                          type="text"
                          className="form-control form-control-lg bg-light border-0"
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          placeholder="10:00 AM"
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label text-muted fw-bold small text-uppercase"><FaCalendarAlt className='me-2' />Date</label>
                        <input
                          type="date"
                          className="form-control form-control-lg bg-light border-0"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                        />
                      </div>

                      <div className="col-12 mt-5 text-end">
                        <button type="button" onClick={() => navigate('/DailyActivities')} className="btn btn-light rounded-pill px-4 me-2">Cancel</button>
                        <button type="submit" className="btn btn-primary rounded-pill px-5 fw-bold shadow-sm">
                          <FaSave className="me-2" /> Save Changes
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityUpdate;
