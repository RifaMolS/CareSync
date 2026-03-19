import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Side from './Side';
import AdminNav from './AdminNav';
import { useNavigate } from 'react-router-dom';

const ManageOperations = () => {
  const [type, setType] = useState("");
  const [bed, setBed] = useState("");
  const [room, setRoom] = useState("");
  const [floor, setFloor] = useState("");
  const [washroom, setWashroom] = useState("");
  const [roomname, setRoomname] = useState("");
  const [price, setPrice] = useState("");
  const [services, setServices] = useState("");
  const [roomassign, setRoomassign] = useState("");
  const [staffList, setStaffList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/demo/approval")
      .then((res) => res.json())
      .then((data) => {
        setStaffList(data);
      })
      .catch((err) => console.error("Error fetching staff:", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const param = {
      type,
      bed,
      room,
      floor,
      washroom,
      roomname,
      price,
      services,
      roomassign
    };

    fetch("http://localhost:5000/demo/room", {
      method: 'POST',
      headers: {
        Accept: "application/json",
        'Content-Type': "application/json"
      },
      body: JSON.stringify(param)
    })
      .then((res) => res.json())
      .then(() => {
        alert("✅ Room added successfully");
        setType(""); setBed(""); setRoom(""); setFloor(""); setWashroom("");
        setRoomname(""); setPrice(""); setServices(""); setRoomassign("");
        navigate('/ManageRoom');
      })
      .catch(err => alert("❌ Failed to add room: " + err.message));
  };

  return (
    <div className="container-xxl position-relative bg-light d-flex p-0" style={{ minHeight: '100vh' }}>
      <Side />
      <div className="content">
        <AdminNav />
        <div style={containerStyle}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={headerStyle}
          >
            <h2 style={{ color: '#fff', fontSize: '2.5rem', marginBottom: '10px' }}>Room Operations</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' }}>Define new spaces and assign care resources effortlessly.</p>
          </motion.div>

          <AnimatePresence>
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={formStyle}
            >
              <div className="row g-4">

                {/* Basic Info Section */}
                <div className="col-md-12">
                  <h5 style={sectionTitleStyle}>🏡 Basic Room Details</h5>
                </div>

                <div className="col-md-6">
                  <InputBlock label="📛 Room Name" value={roomname} onChange={setRoomname} placeholder="e.g. Sunny Daycare Room A" icon="🏷️" />
                </div>
                <div className="col-md-3">
                  <InputBlock label="🏢 Floor Number" type="number" value={floor} onChange={setFloor} placeholder="e.g. 2" icon="📶" />
                </div>
                <div className="col-md-3">
                  <InputBlock label="🔢 Room Number" value={room} onChange={setRoom} placeholder="e.g. 204" icon="#️⃣" />
                </div>

                {/* Facilities Section */}
                <div className="col-md-12 mt-4">
                  <h5 style={sectionTitleStyle}>✨ Features & Facilities</h5>
                </div>

                <div className="col-md-6">
                  <label style={labelStyle}>🛏️ Bed Configuration</label>
                  <select value={bed} onChange={(e) => setBed(e.target.value)} style={selectStyle} required>
                    <option value="">Select Bed Type...</option>
                    <option value="Crib 👶">Crib (Infant)</option>
                    <option value="Single Bed 🛏️">Single Bed (Child/Adult)</option>
                    <option value="Double Bed 🛌">Double Bed</option>
                    <option value="Medical Bed 🏥">Medical Bed (Senior)</option>
                    <option value="No Bed (Play Area) 🧸">No Bed (Play Area)</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label style={labelStyle}>🚿 Washroom Access</label>
                  <div style={radioGroupStyle}>
                    {["Attached Private", "Shared Common"].map(opt => (
                      <label key={opt} style={radioLabelStyle(washroom === opt)}>
                        <input
                          type="radio"
                          name="washroom"
                          value={opt}
                          checked={washroom === opt}
                          onChange={(e) => setWashroom(e.target.value)}
                          style={{ marginRight: '8px' }}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="col-md-12">
                  <InputBlock label="🛠️ Included Services" value={services} onChange={setServices} placeholder="WiFi, Oxygen, TV, Gaming Console..." icon="✨" />
                </div>

                {/* Commercial & Staff */}
                <div className="col-md-12 mt-4">
                  <h5 style={sectionTitleStyle}>💰 Commercial & Assignment</h5>
                </div>

                <div className="col-md-6">
                  <InputBlock label="💲 Monthly Rate ($)" type="number" value={price} onChange={setPrice} placeholder="0.00" icon="💵" />
                </div>

                <div className="col-md-6">
                  <label style={labelStyle}>🧑‍⚕️ Assigned Caregiver</label>
                  <select
                    value={roomassign}
                    onChange={(e) => setRoomassign(e.target.value)}
                    style={selectStyle}
                    required
                    className="form-select custom-select"
                  >
                    <option value="">-- Assign Staff --</option>
                    {staffList.map((staff, idx) => (
                      <option key={idx} value={staff._id}>{staff.name} ({staff.email})</option>
                    ))}
                  </select>
                </div>

              </div>

              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 5px 15px rgba(0,0,0,0.2)' }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                style={submitButtonStyle}
              >
                Create Room
              </motion.button>
            </motion.form>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const InputBlock = ({ label, value, onChange, placeholder, icon, type = "text" }) => (
  <div style={{ marginBottom: '15px' }}>
    <label style={labelStyle}>{label}</label>
    <div style={{ position: 'relative' }}>
      <span style={iconStyle}>{icon}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={inputStyle}
        required
      />
    </div>
  </div>
);

// Styles
const containerStyle = {
  padding: '40px',
  maxWidth: '900px',
  margin: '0 auto',
};

const headerStyle = {
  textAlign: 'center',
  marginBottom: '-40px',
  padding: '60px 20px 80px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '20px',
  boxShadow: '0 10px 30px rgba(118, 75, 162, 0.3)'
};

const formStyle = {
  background: '#ffffff',
  padding: '40px',
  borderRadius: '20px',
  boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  zIndex: 10,
  margin: '0 20px'
};

const sectionTitleStyle = {
  color: '#764ba2',
  fontWeight: 'bold',
  borderBottom: '2px solid #eee',
  paddingBottom: '10px',
  marginBottom: '20px',
  fontSize: '1.1rem',
  textTransform: 'uppercase',
  letterSpacing: '1px'
};

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontWeight: '600',
  color: '#444',
  fontSize: '0.9rem'
};

const inputStyle = {
  width: '100%',
  padding: '12px 15px 12px 45px',
  borderRadius: '10px',
  border: '2px solid #f0f0f0',
  fontSize: '15px',
  backgroundColor: '#f9fafb',
  transition: 'border-color 0.3s',
  outline: 'none',
};

const selectStyle = {
  ...inputStyle,
  paddingLeft: '15px',
};

const iconStyle = {
  position: 'absolute',
  left: '15px',
  top: '50%',
  transform: 'translateY(-50%)',
  fontSize: '1.2rem',
  opacity: 0.7
};

const radioGroupStyle = {
  display: 'flex',
  gap: '15px',
  height: '48px', // Match input height
  alignItems: 'center'
};

const radioLabelStyle = (checked) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '8px 15px',
  borderRadius: '20px',
  backgroundColor: checked ? '#e0f2fe' : '#f3f4f6',
  border: checked ? '2px solid #3b82f6' : '2px solid transparent',
  cursor: 'pointer',
  transition: 'all 0.2s',
  fontWeight: checked ? 'bold' : 'normal',
  color: checked ? '#0369a1' : '#4b5563'
});

const submitButtonStyle = {
  marginTop: '30px',
  padding: '15px',
  background: 'linear-gradient(to right, #667eea, #764ba2)',
  color: '#fff',
  fontWeight: 'bold',
  fontSize: '1.1rem',
  border: 'none',
  borderRadius: '12px',
  cursor: 'pointer',
  width: '100%',
  textTransform: 'uppercase',
  letterSpacing: '1px'
};

export default ManageOperations;
