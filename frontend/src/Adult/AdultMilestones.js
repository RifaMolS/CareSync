import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { useAccessibility } from './AccessibilityContext';
import AdultNavbar from './AdultNavbar';
import axios from 'axios';
import { FaTrophy, FaCheckCircle, FaStar, FaArrowLeft, FaAward, FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdultMilestones = () => {
    const {
        highContrast, fontSize, bgColor, textColor, cardBg,
        subTextColor, mutedTextColor, accentColor
    } = useAccessibility();

    const [milestones, setMilestones] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    const adultId = user?._id;

    useEffect(() => {
        const fetchMilestones = async () => {
            try {
                if (!adultId) return;
                const res = await axios.post("http://localhost:5000/demo/adult/milestones/self", { adultId });
                setMilestones(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchMilestones();
    }, [adultId]);

    const fontStyle = {
        fontSize: fontSize === 'large' ? '1.25rem' : fontSize === 'extra-large' ? '1.5rem' : '1rem'
    };

    return (
        <>
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .milestone-card {
                    animation: fadeInUp 0.5s ease-out forwards;
                    border-radius: 30px;
                    transition: all 0.3s ease;
                    border: none;
                }

                .milestone-card:hover {
                    transform: scale(1.02);
                    box-shadow: 0 15px 40px rgba(0,0,0,0.1) !important;
                }

                .milestone-icon {
                    width: 60px;
                    height: 60px;
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    background: ${highContrast ? '#FFD700' : '#f0fdf4'};
                    color: ${highContrast ? '#000' : '#22c55e'};
                    margin-bottom: 20px;
                }

                .page-header-premium {
                    background: ${highContrast ? '#000' : 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'};
                    padding: 80px 0;
                    margin-bottom: 50px;
                    border-radius: 0 0 60px 60px;
                    color: ${highContrast ? '#FFD700' : 'white'};
                    text-align: center;
                    position: relative;
                    overflow: hidden;
                    border-bottom: ${highContrast ? '4px solid #FFD700' : 'none'};
                }

                .decorative-star {
                    position: absolute;
                    opacity: 0.1;
                    animation: rotate 20s linear infinite;
                }

                @keyframes rotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                .timeline-line {
                    position: absolute;
                    left: 50%;
                    width: 4px;
                    height: 100%;
                    background: ${highContrast ? '#FFD700' : '#e2e8f0'};
                    transform: translateX(-50%);
                    z-index: 0;
                }
            `}</style>

            <div style={{ backgroundColor: bgColor, minHeight: "100vh", color: textColor, transition: "0.3s", paddingTop: '70px' }}>
                <AdultNavbar />

                <div className="page-header-premium shadow-lg">
                    <FaStar className="decorative-star" style={{ top: '20px', left: '10%', fontSize: '100px' }} />
                    <FaStar className="decorative-star" style={{ bottom: '40px', right: '15%', fontSize: '150px' }} />

                    <Container style={{ position: 'relative', zIndex: 1 }}>
                        <div className="d-flex align-items-center justify-content-center gap-3 mb-3">
                            <FaAward size={50} color="#f59e0b" />
                            <h1 style={{ fontWeight: 900, fontSize: '3.5rem', marginBottom: 0 }}>Wall of Fame</h1>
                        </div>
                        <p style={{ fontSize: '1.4rem', opacity: highContrast ? 1 : 0.8, maxWidth: '700px', margin: '0 auto', color: highContrast ? '#FFFFFF' : 'inherit' }}>
                            A record of your wonderful achievements and the progress you've made on your wellness journey.
                        </p>
                        <Button
                            variant={highContrast ? "warning" : "outline-light"}
                            className="mt-4 px-4 py-2"
                            style={{ borderRadius: '15px', color: highContrast ? '#000' : 'white' }}
                            onClick={() => navigate(-1)}
                        >
                            <FaArrowLeft className="me-2" /> Back
                        </Button>
                    </Container>
                </div>

                <Container className="pb-5" style={fontStyle}>
                    <Row className="justify-content-center">
                        <Col lg={9}>
                            {loading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}></div>
                                    <h4 className="mt-3">Polishing your trophies...</h4>
                                </div>
                            ) : milestones.length > 0 ? (
                                <div style={{ position: 'relative' }}>
                                    {/* Optional: Add a timeline look if more than 2 milestones */}
                                    {milestones.length > 2 && <div className="timeline-line d-none d-md-block"></div>}

                                    {milestones.map((m, idx) => (
                                        <Card
                                            key={idx}
                                            className="milestone-card mb-5 shadow-sm"
                                            style={{
                                                backgroundColor: cardBg,
                                                color: textColor,
                                                background: highContrast ? '#000' : 'white',
                                                border: highContrast ? '2px solid #FFD700' : 'none',
                                                zIndex: 1
                                            }}
                                        >
                                            <Card.Body className="p-5">
                                                <Row className="align-items-center">
                                                    <Col md={2} className="text-center text-md-start">
                                                        <div className="milestone-icon mx-auto mx-md-0">
                                                            <FaTrophy />
                                                        </div>
                                                    </Col>
                                                    <Col md={7}>
                                                        <div className="mb-2 d-flex align-items-center gap-2">
                                                            <Badge bg={highContrast ? "warning" : "success"} text={highContrast ? "dark" : "white"} pill style={{ padding: '8px 15px' }}>OFFICIAL RECORD</Badge>
                                                            <div className="fw-bold" style={{ color: mutedTextColor, fontSize: '0.9rem' }}>
                                                                <FaCalendarAlt className="me-1" />
                                                                {new Date(m.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                                            </div>
                                                        </div>
                                                        <h2 style={{ fontWeight: 900, color: highContrast ? '#FFD700' : '#1e293b' }}>
                                                            {m.milestoneType.charAt(0).toUpperCase() + m.milestoneType.slice(1)} Achievement
                                                        </h2>
                                                        <div className="mt-4">
                                                            {m.milestones.map((item, i) => (
                                                                <div key={i} className="mb-3 d-flex align-items-center gap-3" style={{ fontSize: '1.2rem' }}>
                                                                    <div style={{ background: highContrast ? '#333' : '#fef3c7', padding: '8px', borderRadius: '50%', color: highContrast ? '#FFD700' : '#f59e0b' }}>
                                                                        <FaCheckCircle />
                                                                    </div>
                                                                    <span style={{ fontWeight: 600, color: subTextColor }}>{item}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </Col>
                                                    <Col md={3} className="text-center">
                                                        <div style={{ opacity: 0.1 }}>
                                                            <FaTrophy size={120} />
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-5 mt-5" style={{
                                    background: highContrast ? '#000' : '#f8fafc',
                                    borderRadius: '40px',
                                    padding: '80px',
                                    border: highContrast ? '4px dashed #FFD700' : '2px dashed #cbd5e1'
                                }}>
                                    <FaTrophy size={100} style={{ color: mutedTextColor }} className="mb-4" />
                                    <h2 style={{ fontWeight: 900 }}>Your Journey is Just Beginning!</h2>
                                    <p style={{ fontSize: '1.2rem', color: subTextColor, marginBottom: '25px' }}>
                                        Participate in daily activities, take your medications on time, and complete quizzes to see your name here!
                                    </p>
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        style={{ borderRadius: '15px', padding: '15px 40px', fontWeight: 800 }}
                                        onClick={() => navigate('/adult/dashboard')}
                                    >
                                        Start Your First Activity
                                    </Button>
                                </div>
                            )}
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
};

export default AdultMilestones;
