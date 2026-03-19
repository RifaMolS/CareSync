import React, { useState, useEffect } from 'react';
import Footerpage from './Footerpage';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

const NotificationPage = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [notifications, setNotifications] = useState([]);

  const [newNotification, setNewNotification] = useState(null);

  const [user] = useState(JSON.parse(localStorage.getItem("user")));

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      if (!user) return;
      // Using axios if available or fetch
      const res = await fetch("http://localhost:5000/demo/get-notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id }) // passing emailModel _id which is user._id
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        // Add icons based on type/category logic if needed, or default
        const mapped = data.map(n => ({
          id: n._id,
          category: n.type || 'General',
          icon: n.type === 'Leave Status' ? '📅' : n.type === 'Assignment' ? '📋' : '🔔',
          title: n.type,
          description: n.message,
          time: new Date(n.date).toLocaleString(),
          urgent: false,
          read: n.read
        })).reverse();
        setNotifications(mapped);
      }
    } catch (err) {
      console.error("Error fetching notifications", err);
    }
  };

  const markAllRead = async () => {
    try {
      if (!user) return;
      await fetch("http://localhost:5000/demo/mark-all-notifications-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id })
      });
      fetchNotifications();
    } catch (err) {
      console.error("Error marking all read", err);
    }
  };

  const filteredNotifications =
    activeTab === 'All'
      ? notifications
      : notifications.filter((notif) => notif.category === activeTab);

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Navbar />
      <div className="container py-5 mt-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div style={{ display: 'flex', backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', marginBottom: '2rem' }}>
              {['All', 'Food', 'Medicine', 'General'].map((tab) => (
                <div
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    flex: 1,
                    padding: '1.2rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    fontWeight: '600',
                    color: activeTab === tab ? 'white' : '#495057',
                    backgroundColor: activeTab === tab ? '#007bff' : 'white',
                    transition: 'all 0.2s ease',
                    borderBottom: activeTab === tab ? 'none' : '1px solid #dee2e6'
                  }}
                >
                  {tab}
                  {tab !== 'All' && (
                    <span className={`badge ms-2 ${activeTab === tab ? 'bg-white text-primary' : 'bg-primary'}`}>
                      {notifications.filter((notif) => notif.category === tab).length}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)', padding: '2rem' }}>
              <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                <h2 className="mb-0 fw-bold text-dark d-flex align-items-center gap-3">
                  <span className="bg-primary-subtle p-2 rounded-circle">📬</span>
                  Full Notification History
                </h2>
                <div className="d-flex gap-2">
                  <button
                    onClick={markAllRead}
                    className="btn btn-outline-primary rounded-pill px-4"
                  >
                    Mark All Read
                  </button>
                </div>
              </div>

              <div className="d-flex flex-column gap-3">
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 rounded-4 d-flex gap-3 align-items-start transition-all ${!notif.read ? 'border-start border-4 border-primary shadow-sm' : 'border'}`}
                      style={{
                        backgroundColor: !notif.read ? '#f0f7ff' : '#fff',
                        transition: '0.2s'
                      }}
                    >
                      <div className="rounded-circle bg-light d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '50px', height: '50px', fontSize: '1.4rem' }}>
                        {notif.icon}
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <h6 className={`mb-0 ${!notif.read ? 'fw-bold' : 'text-dark'}`}>{notif.title}</h6>
                          <span className="text-muted small">{notif.time}</span>
                        </div>
                        <p className="text-muted small mb-0">{notif.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-5">
                    <div className="fs-1 mb-3 opacity-25">📭</div>
                    <p className="text-muted">No notifications found in this category.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footerpage />
    </div>
  );
};

export default NotificationPage;