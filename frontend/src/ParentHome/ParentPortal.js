import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function ParentPortal() {
  const [email, setEmail] = useState('');
  const [childName, setChildName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const storedEmail = localStorage.getItem('parentEmail');
    if (storedEmail) {
      setEmail(storedEmail);
      setIsLoggedIn(true);
      fetchChildName(storedEmail);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/parent-login', { email });
      if (res.data.success) {
        localStorage.setItem('parentEmail', email);
        setIsLoggedIn(true);
        fetchChildName(email);
      } else {
        alert('Login failed. Invalid parent email.');
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Error during login.');
    }
  };

  const fetchChildName = async (email) => {
    try {
      const res = await axios.get(`/api/child-by-parent-email/${email}`);
      if (res.data && res.data.childName) {
        setChildName(res.data.childName);
      }
    } catch (err) {
      console.error('Fetch child name error:', err);
    }
  };

  return (
    <div style={pageStyle}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={formContainer}
      >
        {!isLoggedIn ? (
          <>
            <h2 style={headingStyle}>Parent Login</h2>
            <form onSubmit={handleLogin}>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={inputStyle}
              />
              <button type="submit" style={buttonStyle}>Login</button>
            </form>
          </>
        ) : (
          <>
            <h2 style={headingStyle}>Welcome, Parent!</h2>
            <div style={fieldStyle}>
              <label style={labelStyle}>Parent Email</label>
              <input type="email" value={email} readOnly style={inputStyle} />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Child Name</label>
              <input type="text" value={childName} readOnly style={inputStyle} />
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

// Styling
const pageStyle = {
  minHeight: '100vh',
  background: 'linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const formContainer = {
  background: '#ffffff',
  padding: '30px',
  borderRadius: '15px',
  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
  width: '90%',
  maxWidth: '400px',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '8px',
  border: '1px solid #ccc',
  marginBottom: '15px',
};

const buttonStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: '8px',
  border: 'none',
  background: '#1e88e5',
  color: 'white',
  fontWeight: 'bold',
  cursor: 'pointer',
};

const headingStyle = { textAlign: 'center', marginBottom: '20px', color: '#333' };
const fieldStyle = { marginBottom: '20px' };
const labelStyle = { display: 'block', marginBottom: '5px', color: '#555' };
