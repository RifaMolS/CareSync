import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import { FaUserMd, FaArrowLeft, FaPhone, FaEnvelope, FaClock, FaIdBadge } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAccessibility } from "./AccessibilityContext";
import AdultNavbar from "./AdultNavbar";

const AssignedStaff = () => {
    const {
        highContrast, fontSize, bgColor, textColor, cardBg, btnPrimary, btnText
    } = useAccessibility();

    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    const profileId = user?.regid;
    const loginId = user?._id;

    useEffect(() => {
        fetchStaff();
    }, [loginId]);

    const fetchStaff = async () => {
        try {
            if (!loginId) return;
            const res = await fetch('http://localhost:5000/demo/adult/get-staff', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ adultId: loginId })
            });
            const data = await res.json();
            setStaffList(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fontStyle = {
        fontSize: fontSize === 'large' ? '1.25rem' : fontSize === 'extra-large' ? '1.5rem' : '1rem'
    };

    return (
        <>
            <style>{`
                .staff-card {
                    border-radius: 30px;
                    overflow: hidden;
                    border: none;
                    transition: all 0.4s ease;
                    background: ${highContrast ? '#000' : 'white'};
                    position: relative;
                }

                .staff-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.15) !important;
                }

                .image-container {
                    height: 250px;
                    overflow: hidden;
                    position: relative;
                }

                .image-container img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.5s ease;
                }

                .staff-card:hover .image-container img {
                    transform: scale(1.1);
                }

                .staff-info-overlay {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    padding: 20px;
                    background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
                    color: white;
                }

                .page-header-staff {
                    background: ${highContrast ? '#000' : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'};
                    padding: 60px 0;
                    margin-bottom: 40px;
                    border-radius: 0 0 50px 50px;
                    color: white;
                    text-align: center;
                }

                .contact-btn {
                    border-radius: 15px;
                    padding: 12px;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    transition: all 0.3s ease;
                }

                .contact-btn:hover {
                    transform: scale(1.03);
                }
            `}</style>

            <div style={{ backgroundColor: bgColor, minHeight: "100vh", color: textColor, transition: "0.3s", paddingTop: '70px' }}>
                <AdultNavbar />

                <div className="page-header-staff shadow-lg">
                    <Container>
                        <div className="d-flex align-items-center justify-content-center gap-3 mb-3">
                            <FaIdBadge size={50} />
                            <h1 style={{ fontWeight: 900, fontSize: '3.5rem', marginBottom: 0 }}>Your Care Team</h1>
                        </div>
                        <p style={{ fontSize: '1.3rem', opacity: 0.9 }}>Qualified professionals dedicated to your health, happiness, and wellbeing.</p>
                        <Button
                            variant="outline-light"
                            className="mt-4 px-4 py-2"
                            style={{ borderRadius: '15px' }}
                            onClick={() => navigate(-1)}
                        >
                            <FaArrowLeft className="me-2" /> Back
                        </Button>
                    </Container>
                </div>

                <Container className="pb-5" style={fontStyle}>
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}></div>
                            <h3 className="mt-3">Gathering your team...</h3>
                        </div>
                    ) : staffList.length > 0 ? (
                        <Row className="g-4">
                            {staffList.map((staff, idx) => (
                                <Col md={6} lg={4} key={idx}>
                                    <Card className="staff-card h-100 shadow-sm" style={{
                                        border: highContrast ? '2px solid #FFD700' : 'none'
                                    }}>
                                        <div className="image-container">
                                            {staff.image ? (
                                                <img src={`http://localhost:5000/${staff.image}`} alt={staff.name} />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <FaUserMd size={100} color="#94a3b8" />
                                                </div>
                                            )}
                                            <div className="staff-info-overlay text-center">
                                                <h3 style={{ fontWeight: 900, marginBottom: 5 }}>{staff.name}</h3>
                                                <Badge pill bg="primary" style={{ background: '#6366f1', padding: '8px 15px' }}>{staff.role}</Badge>
                                            </div>
                                        </div>
                                        <Card.Body className="p-4">
                                            <div className="mb-4">
                                                <div className="d-flex align-items-center gap-2 mb-2">
                                                    <FaClock color="#6366f1" />
                                                    <span className="fw-bold">CURRENT SHIFT:</span>
                                                </div>
                                                <p className="text-muted mb-0">{staff.shift} Shift</p>
                                            </div>

                                            <div className="d-grid gap-3">
                                                <Button
                                                    className="contact-btn"
                                                    variant={highContrast ? "warning" : "primary"}
                                                    style={{ background: highContrast ? '#FFD700' : '#4f46e5', border: 'none' }}
                                                    href={`tel:${staff.phone}`}
                                                >
                                                    <FaPhone /> CALL STAFF
                                                </Button>
                                                <Button
                                                    className="contact-btn"
                                                    variant="outline-info"
                                                    style={{ border: '2px solid #0ea5e9', color: '#0ea5e9' }}
                                                    href={`mailto:${staff.email}`}
                                                >
                                                    <FaEnvelope /> SEND EMAIL
                                                </Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <div className="text-center py-5">
                            <div style={{
                                background: highContrast ? '#222' : '#f8fafc',
                                borderRadius: '30px',
                                padding: '80px',
                                border: '2px dashed #e2e8f0'
                            }}>
                                <FaUserMd size={80} className="mb-4 text-muted opacity-30" />
                                <h2 style={{ fontWeight: 800 }}>Team Assignment Pending</h2>
                                <p className="text-muted">Your care team is being assigned by the facility. Please check back later.</p>
                            </div>
                        </div>
                    )}
                </Container>
            </div>
        </>
    );
};

export default AssignedStaff;
