import React, { useEffect, useState } from 'react';
import StaffSide from './StaffSide';
import StaffNav from './StaffNav';

export default function Staffroom() {
  const [roomData, setRoomData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem('user'));
    const staffId = auth?.regid;

    if (!staffId) {
      setError('Staff ID not found in localStorage.');
      setLoading(false);
      return;
    }

    fetch('http://localhost:5000/demo/roomidview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ staffId }),
    })
      .then(res => res.json())
      .then(result => {
        if (result.error) {
          setError(result.error);
        } else if (!Array.isArray(result) || result.length === 0) {
          setError('No rooms assigned to you.');
        } else {
          setRoomData(result);
        }
      })
      .catch(err => {
        console.error('Error fetching rooms:', err);
        setError('Failed to fetch room data.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container-xxl position-relative bg-white d-flex p-0">
      <StaffSide />
      <div className="content">
        <StaffNav />
        <h3 style={{ marginTop: '2rem', textAlign: 'center', color: '#333' }}>
          📄 My Assigned Rooms
        </h3>

        {loading ? (
          <p style={{ textAlign: 'center', marginTop: '2rem' }}>⏳ Loading...</p>
        ) : error ? (
          <p style={{ textAlign: 'center', marginTop: '2rem', color: 'red' }}>{error}</p>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              marginTop: '2rem',
              padding: '0 2rem',
            }}
          >
            {roomData.map(item => (
              <div
                key={item._id}
                style={{
                  border: '2px solid #eee',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  background: '#f9f9f9',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
                }}
              >
                {[
                  { label: '🛏️ Room Type:', value: item.bed },
                  { label: '🏢 Floor:', value: item.floor },
                  { label: '🔢 Room Number:', value: item.room },
                  { label: '🚽 Bathroom:', value: item.washroom },
                  { label: '📛 Room Name:', value: item.roomname },
                  { label: '💲 Price:', value: item.price },
                  { label: '💼 Services:', value: item.services },
                  { label: '👤 Assigned To:', value: item?.roomassign?.name || 'N/A' },
                ].map((field, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '12px',
                    }}
                  >
                    <label
                      style={{
                        width: '160px',
                        fontWeight: 'bold',
                        fontSize: '15px',
                      }}
                    >
                      {field.label}
                    </label>
                    <input
                      type="text"
                      value={field.value || ''}
                      disabled
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '6px',
                        border: '1px solid #ccc',
                        backgroundColor: '#f2f2f2',
                      }}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
