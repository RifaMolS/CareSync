import React, { useEffect, useState } from "react";
import ParentSide from "./ParentSide";
import ParentNav from "./ParentNav";
import { FaPalette, FaRunning, FaMusic } from "react-icons/fa";

export default function ParentActivities() {
    const [activities, setActivities] = useState([]);
    const auth = JSON.parse(localStorage.getItem("user"));
    const parentId = auth?.regid;

    useEffect(() => {
        if (parentId) {
            fetch("http://localhost:5000/demo/getextracurricularbyparentid", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ parentId }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.activities) setActivities(data.activities);
                })
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
            background: "linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)",
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
            height: "100%",
            transition: "transform 0.2s, box-shadow 0.2s",
            border: "1px solid #f3f4f6",
        },
        cardHeader: {
            padding: "1.25rem",
            background: "#f0f9ff",
            borderBottom: "1px solid #e0f2fe",
            display: "flex",
            alignItems: "center"
        },
        cardBody: {
            padding: "1.5rem",
            color: "#475569",
            lineHeight: "1.6",
        }
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
                        <h1 style={{ ...styles.title, fontSize: '2.5rem' }}>Extracurricular Activities 🎨</h1>
                        <p style={{ opacity: 0.9 }}>Discover the exciting programs your loved ones are part of.</p>
                    </div>
                </div>

                <div className="container-fluid px-4" style={{ maxWidth: '1400px', marginBottom: '3rem' }}>
                    {activities.length > 0 ? (
                        <div className="row g-4">
                            {activities.map((activity) => (
                                <div className="col-md-6 col-lg-4" key={activity._id}>
                                    <div
                                        style={styles.card}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.transform = "translateY(-5px)";
                                            e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.05)";
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.transform = "translateY(0)";
                                            e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
                                        }}
                                    >
                                        <div style={styles.cardHeader}>
                                            <div className="bg-white p-2 rounded-circle shadow-sm me-3 text-primary">
                                                {/* Dynamic Icon based on content could go here, generic for now */}
                                                <FaPalette />
                                            </div>
                                            <h4 className="fw-bold m-0 text-dark">{activity.title}</h4>
                                        </div>
                                        <div style={styles.cardBody}>
                                            <p className="mb-3">{activity.description}</p>
                                            <span className="badge bg-secondary-subtle text-secondary border">
                                                {activity.group === 'children' ? '👶 Children' : '👴 Adults'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-5">
                            <div className="bg-white p-5 rounded-circle d-inline-block shadow-sm mb-3">
                                <FaRunning size={40} className="text-muted" />
                            </div>
                            <h3 className="text-secondary">No activities found.</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
