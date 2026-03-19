import React, { useEffect, useState } from "react";
import ParentSide from "./ParentSide";
import ParentNav from "./ParentNav";
import { FaCalendarCheck, FaClock, FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from "react-icons/fa";

export default function ParentAttendance() {
    const [attendance, setAttendance] = useState([]);
    const auth = JSON.parse(localStorage.getItem("user"));
    const parentId = auth?.regid;

    useEffect(() => {
        if (parentId) {
            fetch("http://localhost:5000/demo/getattendancebyparentid", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ parentId }),
            })
                .then((res) => res.json())
                .then((data) => setAttendance(data))
                .catch((err) => console.error(err));
        }
    }, [parentId]);

    const styles = {
        container: {
            backgroundColor: "#f3f4f6",
            minHeight: "100vh",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        },
        header: {
            background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
            color: "white",
            padding: "3rem 1.5rem",
            borderRadius: "0 0 2rem 2rem",
            marginBottom: "2rem",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
        },
        title: {
            fontSize: "2.5rem",
            fontWeight: "800",
            marginBottom: "0.5rem",
        },
        card: {
            background: "white",
            borderRadius: "1rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
            marginBottom: "1rem",
            borderLeft: "5px solid #e5e7eb",
        },
        presentCard: { borderLeftColor: "#22c55e" },
        absentCard: { borderLeftColor: "#ef4444" },
        lateCard: { borderLeftColor: "#f59e0b" },
        checkinCard: { borderLeftColor: "#3b82f6" },
    };

    const getStatusStyle = (status) => {
        if (status.includes("Present")) return styles.presentCard;
        if (status.includes("Absent")) return styles.absentCard;
        if (status.includes("Late")) return styles.lateCard;
        return styles.checkinCard;
    };

    const getStatusIcon = (status) => {
        if (status.includes("Present")) return <FaCheckCircle className="text-success" />;
        if (status.includes("Absent")) return <FaTimesCircle className="text-danger" />;
        return <FaClock className="text-info" />;
    };

    return (
        <div className="container-fluid p-0" style={{ ...styles.container, overflow: 'hidden' }}>
            <ParentSide />
            <div className="content" style={{
                marginLeft: "260px",
                flex: 1,
                overflowY: "auto",
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#f8fafc'
            }}>
                <ParentNav />

                {/* Header Section */}
                <div style={{ padding: '1.5rem 2rem' }}>
                    <div style={{
                        ...styles.header,
                        margin: 0,
                        padding: '3rem 2rem',
                        borderRadius: '24px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                        textAlign: 'left'
                    }}>
                        <h1 style={{ ...styles.title, fontSize: '2.5rem' }}>Attendance Records 📅</h1>
                        <p style={{ opacity: 0.9 }}>Track daily attendance and check-in times.</p>
                    </div>
                </div>

                <div className="container-fluid px-4" style={{ maxWidth: '1400px', marginBottom: '3rem' }}>
                    {attendance.length > 0 ? (
                        <div className="row">
                            {attendance.map((record) => (
                                <div className="col-md-6 col-lg-4" key={record._id}>
                                    <div style={{ ...styles.card, ...getStatusStyle(record.status) }}>
                                        <div className="p-4">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <span className="badge bg-light text-secondary border">
                                                    {new Date(record.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                                </span>
                                                {getStatusIcon(record.status)}
                                            </div>
                                            <h4 className="fw-bold text-dark mb-1">{record.childName}</h4>
                                            <p className="text-muted small mb-3">Recorded by: {record.staffName || "Staff"}</p>

                                            <div className="d-flex align-items-center bg-light rounded p-2">
                                                <div className="fw-bold text-dark flex-grow-1 text-center">
                                                    {record.status}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-5">
                            <div className="bg-white p-5 rounded-circle d-inline-block shadow-sm mb-3">
                                <FaCalendarCheck size={40} className="text-muted" />
                            </div>
                            <h3 className="text-secondary">No attendance records found.</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
