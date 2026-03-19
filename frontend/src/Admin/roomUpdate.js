import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Side from './Side';
import AdminNav from './AdminNav';
import { useLocation, useNavigate } from 'react-router-dom';

const RoomUpdate = () => {
  const [type, setType] = useState("");
  const [bed, setBed] = useState("");
  const [room, setRoom] = useState("");
  const [floor, setFloor] = useState("");
  const [washroom, setWashroom] = useState("");
  const [roomname, setRoomName] = useState("");
  const [price, setPrice] = useState("");
  const [services, setServices] = useState("");
  const [roomassign, setRoomAssign] = useState("");
  const [staffList, setStaffList] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  // Fetch existing room data by ID
  useEffect(() => {
    if (!location.state || !location.state.id) return;

    fetch("http://localhost:5000/demo/roomedit", {
      method: 'POST',
      headers: {
        Accept: "application/json",
        'Content-Type': "application/json"
      },
      body: JSON.stringify({ id: location.state.id })
    })
      .then((res) => res.json())
      .then((result) => {
        setType(result.type || "");
        setBed(result.bed || "");
        setRoom(result.room || "");
        setFloor(result.floor || "");
        setWashroom(result.washroom || "");
        setRoomName(result.roomname || "");
        setPrice(result.price || "");
        setServices(result.services || "");
        setRoomAssign(result.roomassign || "");
      })
      .catch(err => console.error('Fetch error:', err));
  }, [location.state]);

  // Fetch approved staff for dropdown
  useEffect(() => {
    fetch("http://localhost:5000/demo/approval")
      .then((res) => res.json())
      .then((data) => setStaffList(data))
      .catch((err) => console.error("Error fetching staff:", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const param = {
      id: location.state.id,
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

    fetch("http://localhost:5000/demo/roomupdate", {
      method: 'POST',
      headers: {
        Accept: "application/json",
        'Content-Type': "application/json"
      },
      body: JSON.stringify(param)
    })
      .then((res) => res.json())
      .then(() => {
        alert("✅ Room updated successfully");
        navigate('/ManageRoom');
      })
      .catch((err) => {
        alert("❌ Failed to update room: " + err.message);
      });
  };

  return (
    <div className="container-xxl position-relative bg-white d-flex p-0">
      <Side />
      <div className="content">
        <AdminNav />
        <div style={containerStyle}>
          <h2 style={titleStyle}>🏨 Update Room Assignment</h2>

          <AnimatePresence>
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              style={formStyle}
            >
              <InputBlock label="📛 Room Name:" value={roomname} onChange={setRoomName} placeholder="Enter room name" />
              <InputBlock label="💲 Price:" type="number" value={price} onChange={setPrice} placeholder="Enter price" />
              <InputBlock label="🏢 Floor:" value={floor} onChange={setFloor} placeholder="Enter floor number" />
              <InputBlock label="🔢 Room Number:" value={room} onChange={setRoom} placeholder="Enter room number" />
              <InputBlock label="💼 Services:" value={services} onChange={setServices} placeholder="e.g. WiFi, AC, Heater" />

              {/* Bed Type */}
              <div style={{ marginBottom: '15px' }}>
                <label style={labelStyle}>🛏️ Bed Type:</label>
                <div style={radioContainerStyle}>
                  {["Single Bed 🛏️", "Bed 🛌", "Dormitory 🧍‍♂️🧍‍♀️", "Double Bed 👨‍👩‍👧‍👦"].map(option => (
                    <label key={option} style={radioLabelStyle}>
                      <input
                        type="radio"
                        name="bed"
                        value={option}
                        checked={bed === option}
                        onChange={(e) => setBed(e.target.value)}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>

              {/* Bathroom Facility */}
              <div style={{ marginBottom: '15px' }}>
                <label style={labelStyle}>🚽 Bathroom Facility:</label>
                <div style={radioContainerStyle}>
                  {["Attached 🚿", "Common 🚻"].map(option => (
                    <label key={option} style={radioLabelStyle}>
                      <input
                        type="radio"
                        name="washroom"
                        value={option}
                        checked={washroom === option}
                        onChange={(e) => setWashroom(e.target.value)}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>

              {/* Staff Dropdown */}
              <div style={{ marginBottom: '15px' }}>
                <label style={labelStyle}>🧑‍🔧 Room Assigned To:</label>
                <select
                  value={roomassign}
                  onChange={(e) => setRoomAssign(e.target.value)}
                  style={inputStyle}
                  required
                >
                  <option value="">-- Select Staff Member --</option>
                  {staffList.map((staff, idx) => (
                    <option key={idx} value={staff._id}>{staff.name}</option>
                  ))}
                </select>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                style={submitButtonStyle}
              >
                🔄 Update Room
              </motion.button>
            </motion.form>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const InputBlock = ({ label, value, onChange, placeholder, type = "text" }) => (
  <div style={{ marginBottom: '15px' }}>
    <label style={labelStyle}>{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={inputStyle}
      required
    />
  </div>
);

// Styling (same as insert page for consistency)
const containerStyle = {
  padding: '2rem',
  maxWidth: '700px',
  margin: '0 auto',
};

const titleStyle = {
  textAlign: 'center',
  marginBottom: '1.5rem',
  color: '#2c3e50',
};

const formStyle = {
  background: 'linear-gradient(to right, #f3e5f5, #ce93d8)',
  padding: '2rem',
  borderRadius: '12px',
  boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
};

const labelStyle = {
  display: 'block',
  marginBottom: '5px',
  fontWeight: 'bold',
  color: '#333',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '15px',
};

const radioContainerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '15px',
  marginTop: '5px',
};

const radioLabelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  fontSize: '14px',
};

const submitButtonStyle = {
  marginTop: '20px',
  padding: '12px 25px',
  backgroundColor: '#6a1b9a',
  color: '#fff',
  fontWeight: 'bold',
  fontSize: '16px',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  width: '100%',
};

export default RoomUpdate;
