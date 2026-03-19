import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import { FaRunning, FaArrowLeft, FaPalette, FaUsers, FaMusic, FaBook, FaPuzzlePiece, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAccessibility } from "./AccessibilityContext";
import AdultNavbar from "./AdultNavbar";
import { awardReward } from '../services/adultApi';

const AdultActivities = () => {
    const {
        highContrast, fontSize, bgColor, textColor, cardBg, btnPrimary, btnText,
        subTextColor, mutedTextColor, accentColor
    } = useAccessibility();

    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [participated, setParticipated] = useState({});
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    const profileId = user?.regid;

    useEffect(() => {
        fetchActivities();
    }, [profileId]);

    const fetchActivities = async () => {
        try {
            if (!profileId) return;
            const res = await fetch('http://localhost:5000/demo/adult/get-extra-curricular', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ adultId: profileId })
            });
            const data = await res.json();
            setActivities(data.activities || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleParticipate = async (activityId, title) => {
        if (participated[activityId]) return;

        try {
            await awardReward({
                adultId: profileId,
                points: 5,
                badge: `Active in ${title}`
            });
            setParticipated(prev => ({ ...prev, [activityId]: true }));
            // Using a more subtle feedback if possible, but keeping alert for now as per dashboard pattern if needed
            // Actually, I'll just use the state change for visual feedback
        } catch (err) {
            console.error(err);
            alert("Failed to record participation.");
        }
    };

    const fontStyle = {
        fontSize: fontSize === 'large' ? '1.25rem' : fontSize === 'extra-large' ? '1.5rem' : '1rem'
    };

    // Icons mapping for activities
    const getIcon = (category) => {
        const cat = category?.toLowerCase();
        if (cat?.includes('art')) return <FaPalette />;
        if (cat?.includes('music')) return <FaMusic />;
        if (cat?.includes('reading')) return <FaBook />;
        if (cat?.includes('game') || cat?.includes('puzzle')) return <FaPuzzlePiece />;
        if (cat?.includes('group')) return <FaUsers />;
        return <FaRunning />;
    };

    return (
        <>
            <style>{`
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .activity-card {
                    animation: slideIn 0.5s ease-out forwards;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    border-radius: 25px;
                    overflow: hidden;
                    border: none;
                }

                .activity-card:hover {
                    transform: translateY(-10px) scale(1.02);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.15) !important;
                }

                .icon-container {
                    width: 60px;
                    height: 60px;
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    transition: all 0.3s ease;
                }

                .activity-card:hover .icon-container {
                    transform: rotate(15deg) scale(1.1);
                }

                .btn-participate {
                    border-radius: 15px;
                    padding: 12px 25px;
                    font-weight: 800;
                    transition: all 0.3s ease;
                }

                .btn-participate:hover:not(:disabled) {
                    transform: scale(1.05);
                    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                }

                .page-header {
                    background: ${highContrast ? '#000' : 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)'};
                    padding: 60px 0;
                    margin-bottom: 40px;
                    border-radius: 0 0 50px 50px;
                    color: ${highContrast ? '#FFD700' : 'white'};
                    box-shadow: ${highContrast ? '0 0 20px #FFD700' : '0 10px 30px rgba(99, 102, 241, 0.2)'};
                    border-bottom: ${highContrast ? '4px solid #FFD700' : 'none'};
                }
            `}</style>

            <div style={{ backgroundColor: bgColor, minHeight: "100vh", color: textColor, transition: "0.3s", paddingTop: '70px' }}>
                <AdultNavbar />

                <div className="page-header">
                    <Container>
                        <div className="d-flex align-items-center gap-4 mb-3">
                            <Button
                                variant={highContrast ? "warning" : "outline-light"}
                                onClick={() => navigate(-1)}
                                style={{ borderRadius: '15px', padding: '10px 20px', color: highContrast ? '#000' : 'white' }}
                            >
                                <FaArrowLeft className="me-2" /> Back
                            </Button>
                            <h1 style={{ fontWeight: 900, marginBottom: 0, fontSize: '3rem' }}>Discovery Center</h1>
                        </div>
                        <p style={{ fontSize: '1.2rem', opacity: highContrast ? 1 : 0.9, color: highContrast ? '#FFFFFF' : 'inherit' }}>Join exciting activities, learn new skills, and connect with your community while earning points!</p>
                    </Container>
                </div>

                <Container className="pb-5" style={fontStyle}>
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : activities.length > 0 ? (
                        <Row className="g-4">
                            {activities.map((activity, idx) => (
                                <Col md={6} lg={4} key={idx}>
                                    <Card className="activity-card h-100 shadow-sm" style={{
                                        backgroundColor: cardBg,
                                        color: textColor,
                                        background: highContrast ? '#000' : 'white',
                                        border: highContrast ? '2px solid #FFD700' : 'none'
                                    }}>
                                        <Card.Body className="p-4 d-flex flex-column">
                                            <div className="d-flex justify-content-between align-items-start mb-4">
                                                <div className="icon-container" style={{
                                                    backgroundColor: highContrast ? '#FFD700' : '#f0f5ff',
                                                    color: highContrast ? '#000' : '#4f46e5'
                                                }}>
                                                    {getIcon(activity.category)}
                                                </div>
                                                <Badge pill bg={participated[activity._id] ? "success" : "primary"} style={{ padding: '8px 15px', fontSize: '0.9rem' }}>
                                                    {participated[activity._id] ? "Completed" : "+5 Points"}
                                                </Badge>
                                            </div>

                                            <h3 style={{ fontWeight: 800, marginBottom: '15px' }}>{activity.title}</h3>
                                            <p style={{ opacity: highContrast ? 1 : 0.8, lineHeight: 1.6, flexGrow: 1, color: subTextColor }}>
                                                {activity.description}
                                            </p>

                                            <div className="mt-4 pt-4 border-top d-flex justify-content-between align-items-center">
                                                <div className="fw-bold" style={{ color: mutedTextColor, fontSize: '0.9rem' }}>
                                                    <FaUsers className="me-1" /> Adult Program
                                                </div>
                                                <Button
                                                    className="btn-participate"
                                                    variant={participated[activity._id] ? "success" : (highContrast ? "warning" : "primary")}
                                                    onClick={() => handleParticipate(activity._id, activity.title)}
                                                    disabled={participated[activity._id]}
                                                    style={{
                                                        background: participated[activity._id] ? '#22c55e' : (highContrast ? '#FFD700' : '#6366f1'),
                                                        border: 'none',
                                                        color: highContrast && !participated[activity._id] ? '#000' : '#fff'
                                                    }}
                                                >
                                                    {participated[activity._id] ? "Done ✅" : "Join Now"}
                                                </Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <div className="text-center mt-5 py-5" style={{
                            background: highContrast ? '#222' : '#f8fafc',
                            borderRadius: '30px',
                            border: highContrast ? '2px dashed #FFD700' : '2px dashed #e2e8f0'
                        }}>
                            <FaRunning size={80} style={{ color: mutedTextColor }} className="mb-4" />
                            <h2 style={{ fontWeight: 800 }}>No New Discoveries Today</h2>
                            <p style={{ fontSize: '1.2rem', color: subTextColor }}>Check back soon for upcoming workshops and events!</p>
                            <Button variant="primary" className="mt-3 px-5 py-3" style={{ borderRadius: '15px', fontWeight: 'bold' }} onClick={() => navigate('/adult/dashboard')}>
                                Return to Dashboard
                            </Button>
                        </div>
                    )}
                </Container>
            </div>
        </>
    );
};

export default AdultActivities;
