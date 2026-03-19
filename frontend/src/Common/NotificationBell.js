import React, { useState, useEffect, useCallback } from "react";
import { Dropdown, Badge, ListGroup } from "react-bootstrap";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NotificationBell = ({ iconColor = "#fff" }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const auth = JSON.parse(localStorage.getItem("user"));
    const userId = auth?._id;
    const navigate = useNavigate();

    // Use sessionStorage to persist acknowledged alert IDs across navigations in the same session
    const [prevIds, setPrevIds] = useState(() => {
        const saved = sessionStorage.getItem(`acknowledged_alerts_${userId}`);
        return saved ? new Set(JSON.parse(saved)) : new Set();
    });

    // Update sessionStorage whenever prevIds changes
    useEffect(() => {
        if (userId) {
            sessionStorage.setItem(`acknowledged_alerts_${userId}`, JSON.stringify([...prevIds]));
        }
    }, [prevIds, userId]);

    const fetchNotifications = useCallback(async () => {
        if (!userId) return;
        try {
            const res = await axios.post("http://localhost:5000/demo/get-notifications", { userId });
            const data = res.data;
            const sortedData = [...data].reverse();
            setNotifications(sortedData);
            setUnreadCount(data.filter(n => !n.read).length);

            // Immediate Alert Logic for new Medication & Immunization Reminders
            const newAlerts = data.filter(n => !n.read && (
                n.type === 'medication_reminder' ||
                n.type === 'guardian_med_reminder' ||
                n.type === 'immunization_alert' ||
                n.type === 'medication_viewed' ||
                n.type === 'food_viewed'
            ) && !prevIds.has(n._id));

            if (newAlerts.length > 0) {
                const messages = newAlerts.map(n => {
                    const icon = n.type === 'immunization_alert' ? '💉' : (n.type.includes('food') ? '🥗' : '💊');
                    return `${icon} ${n.message}`;
                }).join('\n\n');

                window.alert(`🚨 HEALTH ALERTS:\n\n${messages}`);

                // Mark as seen in session and mark as read on server
                const updatedIds = new Set(prevIds);
                newAlerts.forEach(n => {
                    updatedIds.add(n._id);
                    markAsRead(n._id, false); // Do not refetch inside loop
                });
                setPrevIds(updatedIds);
                // No manual refetch here - the state update will trigger a re-render
                // and the useEffect will take care of it if needed, or the next interval.
            }

            // Do not auto-sync on load to avoid missing potential alerts
            // Only current session tracking matters now
            if (prevIds.size === 0 && data.length > 0) {
                // Optionally populate with already read notifications to keep Set clean
                const readIds = data.filter(n => n.read).map(n => n._id);
                setPrevIds(new Set(readIds));
            }

        } catch (err) {
            console.error("Error fetching notifications:", err);
        }
    }, [userId, prevIds]);

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 20000); // Check every 20s for more responsiveness
        return () => clearInterval(interval);
    }, [fetchNotifications]); // Re-run when fetchNotifications changes (e.g. when prevIds updates)

    const markAsRead = async (notificationId, shouldRefetch = true) => {
        try {
            await axios.post("http://localhost:5000/demo/mark-notification-read", {
                userId,
                notificationId
            });
            if (shouldRefetch) {
                // Manually trigger a refresh of the unread count/list
                const res = await axios.post("http://localhost:5000/demo/get-notifications", { userId });
                setNotifications(res.data.reverse());
                setUnreadCount(res.data.filter(n => !n.read).length);
            }
        } catch (err) {
            console.error("Error marking notification as read:", err);
        }
    };

    const handleNotificationClick = async (n) => {
        if (!n.read) await markAsRead(n._id);

        if (n.type === "medication_taken" && auth?.regType === "staff") {
            navigate("/managemedications");
        } else if (n.type === "medication_reminder" && auth?.regType === "adult") {
            navigate("/adult/dashboard");
        } else if ((n.type === "guardian_med_reminder" || n.type === "medication_viewed") && auth?.regType === "parent") {
            navigate("/parentmedications");
        } else if (n.type === "food_viewed" && auth?.regType === "parent") {
            navigate("/nutritionfeed");
        } else if (n.type === "food_added" && auth?.regType === "staff") {
            navigate("/nutritionalfood");
        }
    };

    return (
        <Dropdown align="end">
            <Dropdown.Toggle as="div" className="position-relative cursor-pointer" id="notification-dropdown" style={{ cursor: 'pointer' }}>
                <FaBell size={24} color={iconColor} />
                {unreadCount > 0 && (
                    <Badge
                        pill
                        bg="danger"
                        className="position-absolute top-0 start-100 translate-middle"
                        style={{ fontSize: '0.65rem' }}
                    >
                        {unreadCount}
                    </Badge>
                )}
            </Dropdown.Toggle>

            <Dropdown.Menu className="shadow-lg border-0 mt-2 p-0" style={{ width: '300px', maxHeight: '400px', overflowY: 'auto', borderRadius: '12px' }}>
                <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-light" style={{ borderRadius: '12px 12px 0 0' }}>
                    <h6 className="mb-0 fw-bold">Notifications</h6>
                    {unreadCount > 0 && <small className="text-primary">{unreadCount} new</small>}
                </div>
                <ListGroup variant="flush">
                    {notifications.length > 0 ? (
                        notifications.map((n) => (
                            <ListGroup.Item
                                key={n._id}
                                className={`p-3 border-0 ${!n.read ? 'bg-aliceblue' : ''}`}
                                style={{ backgroundColor: !n.read ? '#f0f7ff' : '#fff', cursor: 'pointer', fontSize: '0.9rem' }}
                                onClick={() => handleNotificationClick(n)}
                            >
                                <div className="d-flex justify-content-between">
                                    <span className={`fw-${!n.read ? 'bold' : 'normal'}`}>{n.type === 'health' ? '🏥' : '💊'} {n.message}</span>
                                </div>
                                <div className="text-muted small mt-1">
                                    {new Date(n.date).toLocaleString()}
                                </div>
                            </ListGroup.Item>
                        ))
                    ) : (
                        <div className="p-4 text-center text-muted">
                            <p className="mb-0">No notifications yet</p>
                        </div>
                    )}
                </ListGroup>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default NotificationBell;
