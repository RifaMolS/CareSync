import React, { useState, useEffect } from 'react';
import Navbar from '../UserHome/Navbar';
import axios from 'axios';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaPalette, FaMusic, FaFutbol, FaTheaterMasks, FaSearch, FaGamepad } from 'react-icons/fa';

const ChildActivities = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user) return;

            // 1. Get Assigned Staff for this child (using Validation ID: _id)
            const staffRes = await axios.post("http://localhost:5000/demo/child/get-staff", { childId: user._id });
            const staffId = staffRes.data?.staffId?._id || staffRes.data?.staffId;

            // 2. Fetch Activities filtered by that Staff ID
            const res = await axios.post("http://localhost:5000/demo/viewactivity", { staffId });

            // Filter only children related activities
            const childActivities = res.data.filter(a => a.group === 'children' || a.group === 'child');
            setActivities(childActivities);
        } catch (err) {
            console.error("Failed to fetch activities", err);
        } finally {
            setLoading(false);
        }
    };

    const getActivityIcon = (title) => {
        const t = title.toLowerCase();
        if (t.includes('art') || t.includes('draw') || t.includes('paint')) return <FaPalette size={40} color="#E91E63" />;
        if (t.includes('music') || t.includes('sing') || t.includes('dance')) return <FaMusic size={40} color="#9C27B0" />;
        if (t.includes('sport') || t.includes('game') || t.includes('play')) return <FaFutbol size={40} color="#4CAF50" />;
        if (t.includes('drama') || t.includes('act')) return <FaTheaterMasks size={40} color="#FF9800" />;
        return <FaGamepad size={40} color="#2196F3" />;
    };

    return (
        <div style={{ backgroundColor: "#E0F7FA", minHeight: "100vh", paddingBottom: "50px", fontFamily: "'Comic Sans MS', sans-serif" }}>
            <Navbar />
            <div style={{ paddingTop: "120px" }}>
                <Container>
                    <div className="text-center mb-5">
                        <h1 style={{ fontSize: "3rem", fontWeight: "bold", color: "#006064" }}>🚀 Fun Activities Club</h1>
                        <p style={{ fontSize: "1.2rem", color: "#00838F" }}>Explore amazing workshops, games, and events just for you!</p>
                    </div>

                    {loading ? (
                        <h2 className="text-center text-muted">Loading fun stuff... 🎈</h2>
                    ) : (
                        <Row>
                            {activities.length > 0 ? (
                                activities.map((activity, idx) => (
                                    <Col md={4} sm={6} xs={12} key={activity._id || idx} className="mb-4">
                                        <Card className="h-100 shadow border-0" style={{ borderRadius: "20px", overflow: "hidden", transition: "transform 0.3s" }}
                                            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                                            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
                                            <div style={{ height: "150px", background: "linear-gradient(45deg, #FFF9C4, #FFCC80)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                {getActivityIcon(activity.title)}
                                            </div>
                                            <Card.Body className="text-center">
                                                <h3 style={{ fontWeight: "bold", color: "#E65100" }}>{activity.title}</h3>
                                                <p className="text-muted mt-2">{activity.description}</p>
                                                {/* <Button variant="outline-success" className="rounded-pill mt-3 w-100">Click for More ✨</Button> */}
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))
                            ) : (
                                <div className="text-center w-100">
                                    <h3>No activities found right now. Check back later! 🎪</h3>
                                </div>
                            )}
                        </Row>
                    )}
                </Container>
            </div>
        </div>
    );
};

export default ChildActivities;
