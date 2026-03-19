import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button, Navbar as BootstrapNavbar, Container, Nav, Badge, Dropdown, ListGroup } from 'react-bootstrap';
import {
    FaEye, FaAdjust, FaSignOutAlt, FaHome, FaHistory, FaTrophy,
    FaHeartbeat, FaComment, FaRunning, FaGraduationCap,
    FaBell, FaPills, FaClock, FaShieldVirus, FaCheckCircle
} from 'react-icons/fa';
import { useAccessibility } from './AccessibilityContext';
import { fetchMedications, fetchSchedule } from '../services/adultApi';
import axios from 'axios';

const AdultNavbar = () => {
    const {
        highContrast, textColor, toggleContrast, increaseFont
    } = useAccessibility();

    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [prevIds, setPrevIds] = useState(new Set());
    const [showNotifications, setShowNotifications] = useState(false);
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    const loginId = user?._id;
    const profileId = user?.regid;

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (loginId || profileId) {
            loadNotifications();
            // Refresh notifications every 5 minutes
            const interval = setInterval(loadNotifications, 300000);
            return () => clearInterval(interval);
        }
    }, [loginId, profileId]);

    const loadNotifications = async () => {
        try {
            const notifs = [];
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();

            // Fetch medications (Internal logic)
            if (loginId) {
                const meds = await fetchMedications({ adultId: loginId });
                if (meds && Array.isArray(meds)) {
                    meds.forEach(med => {
                        const lastTaken = med.takenHistory?.length ? med.takenHistory[med.takenHistory.length - 1] : null;
                        const takenToday = lastTaken && new Date(lastTaken.date).toDateString() === now.toDateString();

                        if (!takenToday && med.time) {
                            const [medHour, medMinute] = med.time.split(':').map(Number);
                            const timeDiff = (currentHour * 60 + currentMinute) - (medHour * 60 + medMinute);
                            if (timeDiff >= -30 && timeDiff <= 60) {
                                notifs.push({
                                    id: `med-${med._id}`,
                                    type: 'medication',
                                    title: 'Medication Reminder',
                                    message: `Time to take ${med.name} (${med.dosage})`,
                                    time: med.time,
                                    icon: <FaPills />,
                                    urgent: timeDiff > 0,
                                    internal: true
                                });
                            }
                        }
                    });
                }
            }

            // Fetch schedule/activities (Internal logic)
            if (profileId) {
                const schedule = await fetchSchedule();
                if (schedule && Array.isArray(schedule)) {
                    schedule.forEach(activity => {
                        if (activity.time) {
                            const timeMatch = activity.time.match(/(\d+):(\d+)/);
                            if (timeMatch) {
                                const [_, actHour, actMinute] = timeMatch.map(Number);
                                const timeDiff = (currentHour * 60 + currentMinute) - (actHour * 60 + actMinute);
                                if (timeDiff >= -30 && timeDiff <= 15) {
                                    notifs.push({
                                        id: `activity-${activity._id || activity.activityName}`,
                                        type: 'activity',
                                        title: 'Upcoming Activity',
                                        message: `${activity.activityName} starts at ${activity.time}`,
                                        time: activity.time,
                                        icon: <FaClock />,
                                        urgent: timeDiff > -10,
                                        internal: true
                                    });
                                }
                            }
                        }
                    });
                }
            }

            // Fetch Backend Persistent Notifications
            if (loginId) {
                const res = await axios.post("http://localhost:5000/demo/get-notifications", { userId: loginId });
                const backendNotifs = res.data;
                const unreadBackend = backendNotifs.filter(n => !n.read);

                unreadBackend.forEach(n => {
                    notifs.push({
                        id: n._id,
                        type: n.type,
                        title: n.type === 'health' ? 'Health Alert' : 'Medicine Reminder',
                        message: n.message,
                        time: new Date(n.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        icon: n.type === 'health' ? <FaHeartbeat /> : <FaPills />,
                        urgent: true,
                        backend: true
                    });
                });

                // Consolidated Alert Logic for new Medication Reminders
                const newMedAlerts = unreadBackend.filter(n =>
                    (n.type === 'medication_reminder' || n.type === 'guardian_med_reminder') && !prevIds.has(n._id)
                );

                if (newMedAlerts.length > 0) {
                    const messages = newMedAlerts.map(n => `💊 ${n.message}`).join('\n\n');
                    window.alert(`📢 MEDICINE REMINDERS:\n\n${messages}`);

                    const updatedIds = new Set(prevIds);
                    newMedAlerts.forEach(n => updatedIds.add(n._id));
                    setPrevIds(updatedIds);
                }

                // Sync initial IDs
                if (prevIds.size === 0 && backendNotifs.length > 0) {
                    setPrevIds(new Set(backendNotifs.map(n => n._id)));
                }
            }

            setNotifications(notifs);
        } catch (err) {
            console.error('Error loading notifications:', err);
        }
    };

    const markAsRead = async (notif) => {
        if (notif.backend && loginId) {
            try {
                await axios.post("http://localhost:5000/demo/mark-notification-read", {
                    userId: loginId,
                    notificationId: notif.id
                });
                loadNotifications();
            } catch (err) {
                console.error("Error marking read:", err);
            }
        }
        setShowNotifications(false);
        navigate(notif.type === 'health' ? '/adult/health' : '/adult/dashboard');
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        window.location.href = "/login";
    };

    const navItems = [
        { path: "/adult/dashboard", label: "Dashboard", icon: <FaHome /> },
        { path: "/adult/activities", label: "Activities", icon: <FaRunning /> },
        { path: "/adult/quiz", label: "Quiz", icon: <FaGraduationCap /> },
        { path: "/adult/health", label: "Health", icon: <FaHeartbeat /> },
        { path: "/adult/communication", label: "Messages", icon: <FaComment /> },
        { path: "/adult/immunization", label: "Vaccines", icon: <FaShieldVirus /> },
    ];

    return (
        <>
            <style>{`
                .premium-nav {
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    backdrop-filter: ${highContrast ? 'none' : 'blur(15px)'};
                    background: ${highContrast ? '#000' : (scrolled ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.8)')};
                    border-bottom: ${highContrast ? '2px solid #FFD700' : '1px solid rgba(255, 255, 255, 0.3)'} !important;
                    padding: ${scrolled ? '10px 0' : '20px 0'} !important;
                }

                .nav-link-custom {
                    position: relative;
                    color: ${textColor} !important;
                    font-weight: 600;
                    padding: 10px 15px !important;
                    margin: 0 5px;
                    border-radius: 12px;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .nav-link-custom:hover {
                    background: ${highContrast ? '#333' : 'rgba(102, 126, 234, 0.1)'};
                    transform: translateY(-2px);
                }

                .nav-link-custom.active {
                    background: ${highContrast ? '#FFD700' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
                    color: ${highContrast ? '#000' : '#fff'} !important;
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
                }

                .nav-brand-container {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    text-decoration: none;
                }

                .nav-logo-icon {
                    width: 45px;
                    height: 45px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 1.5rem;
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                    transition: all 0.3s ease;
                }

                .nav-brand-container:hover .nav-logo-icon {
                    transform: rotate(-10deg) scale(1.1);
                }

                .nav-brand-text {
                    color: ${textColor};
                    font-size: 1.4rem;
                    font-weight: 800;
                    letter-spacing: -0.5px;
                }

                .nav-action-btn {
                    border-radius: 12px;
                    padding: 8px 16px;
                    font-weight: 700;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .nav-action-btn:hover {
                    transform: scale(1.05);
                }

                .notification-badge {
                    position: relative;
                }

                @keyframes bellShake {
                    0% { transform: rotate(0); }
                    15% { transform: rotate(15deg); }
                    30% { transform: rotate(-15deg); }
                    45% { transform: rotate(10deg); }
                    60% { transform: rotate(-10deg); }
                    100% { transform: rotate(0); }
                }

                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }

                .bell-icon:hover {
                    animation: bellShake 0.6s ease-in-out;
                }

                .notification-dropdown {
                    min-width: 380px;
                    max-height: 500px;
                    overflow-y: auto;
                    border-radius: 20px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.15);
                    border: ${highContrast ? '2px solid #FFD700' : 'none'};
                }

                .notification-item {
                    padding: 15px;
                    border-bottom: 1px solid #f1f5f9;
                    transition: all 0.2s ease;
                    cursor: pointer;
                }

                .notification-item:hover {
                    background: ${highContrast ? '#222' : '#f8fafc'};
                }

                .notification-item.urgent {
                    background: ${highContrast ? '#331111' : '#fef2f2'};
                    border-left: 4px solid #ef4444;
                }

                .notification-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                }

                .pulse-badge {
                    animation: pulse 2s infinite;
                }
            `}</style>

            <BootstrapNavbar
                expand="lg"
                fixed="top"
                className="premium-nav"
            >
                <Container fluid className="px-lg-5">
                    <Link to="/adult/dashboard" className="nav-brand-container">
                        <div className="nav-logo-icon">
                            <FaHeartbeat />
                        </div>
                        <span className="nav-brand-text d-none d-sm-block">CareSync</span>
                    </Link>

                    <BootstrapNavbar.Toggle aria-controls="adult-navbar-nav" className="border-0 shadow-none" />

                    <BootstrapNavbar.Collapse id="adult-navbar-nav">
                        <Nav className="mx-auto mt-3 mt-lg-0">
                            {navItems.map((item) => (
                                <Nav.Link
                                    key={item.path}
                                    as={Link}
                                    to={item.path}
                                    className={`nav-link-custom ${location.pathname === item.path ? 'active' : ''}`}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </Nav.Link>
                            ))}
                        </Nav>

                        <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
                            <div className="notification-badge d-none d-md-block">
                                <Dropdown show={showNotifications} onToggle={(isOpen) => setShowNotifications(isOpen)}>
                                    <Dropdown.Toggle
                                        as={Button}
                                        variant="link"
                                        className="p-0 text-muted bell-icon border-0"
                                        style={{ fontSize: '1.4rem', color: textColor, background: 'transparent' }}
                                    >
                                        <FaBell />
                                        {notifications.length > 0 && (
                                            <Badge
                                                bg="danger"
                                                pill
                                                className="position-absolute top-0 start-100 translate-middle pulse-badge"
                                                style={{ fontSize: '0.7rem', padding: '4px 6px' }}
                                            >
                                                {notifications.length}
                                            </Badge>
                                        )}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu className="notification-dropdown" align="end">
                                        <div className="px-3 py-2 border-bottom">
                                            <h6 className="mb-0 fw-bold">Notifications</h6>
                                            <small className="text-muted">You have {notifications.length} reminder{notifications.length !== 1 ? 's' : ''}</small>
                                        </div>

                                        {notifications.length > 0 ? (
                                            <ListGroup variant="flush">
                                                {notifications.map((notif) => (
                                                    <ListGroup.Item
                                                        key={notif.id}
                                                        className={`notification-item ${notif.urgent ? 'urgent' : ''}`}
                                                        onClick={() => markAsRead(notif)}
                                                    >
                                                        <div className="d-flex gap-3 align-items-start">
                                                            <div
                                                                className="notification-icon"
                                                                style={{
                                                                    background: notif.type === 'medication' ? '#fef3c7' : '#dbeafe',
                                                                    color: notif.type === 'medication' ? '#f59e0b' : '#3b82f6'
                                                                }}
                                                            >
                                                                {notif.icon}
                                                            </div>
                                                            <div className="flex-grow-1">
                                                                <div className="d-flex justify-content-between align-items-start mb-1">
                                                                    <strong style={{ fontSize: '0.95rem' }}>{notif.title}</strong>
                                                                    <Badge
                                                                        bg={notif.urgent ? 'danger' : 'secondary'}
                                                                        pill
                                                                        style={{ fontSize: '0.7rem' }}
                                                                    >
                                                                        {notif.time}
                                                                    </Badge>
                                                                </div>
                                                                <p className="mb-0 text-muted small">{notif.message}</p>
                                                            </div>
                                                        </div>
                                                    </ListGroup.Item>
                                                ))}
                                            </ListGroup>
                                        ) : (
                                            <div className="text-center py-5 text-muted">
                                                <FaCheckCircle size={40} className="mb-3 opacity-50" />
                                                <p className="mb-0">All caught up!</p>
                                                <small>No pending reminders</small>
                                            </div>
                                        )}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>

                            <div className="vr d-none d-lg-block mx-2" style={{ height: '30px', opacity: 0.2 }}></div>

                            <Button
                                variant={highContrast ? "warning" : "outline-primary"}
                                onClick={increaseFont}
                                className="nav-action-btn"
                                size="sm"
                            >
                                <FaEye /> <span className="d-none d-xl-inline">Size</span>
                            </Button>

                            <Button
                                variant={highContrast ? "outline-warning" : "outline-dark"}
                                onClick={toggleContrast}
                                className="nav-action-btn"
                                size="sm"
                            >
                                <FaAdjust /> <span className="d-none d-xl-inline">Mode</span>
                            </Button>

                            <Button
                                variant="danger"
                                className="nav-action-btn ms-lg-2"
                                onClick={handleLogout}
                            >
                                <FaSignOutAlt /> <span className="d-none d-md-inline">Logout</span>
                            </Button>
                        </div>
                    </BootstrapNavbar.Collapse>
                </Container>
            </BootstrapNavbar>
        </>
    );
};

export default AdultNavbar;
