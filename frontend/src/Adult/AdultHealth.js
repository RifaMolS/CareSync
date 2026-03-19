import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { useAccessibility } from './AccessibilityContext';
import AdultNavbar from './AdultNavbar';
import axios from 'axios';
import { FaHeartbeat, FaWeight, FaRulerVertical, FaNotesMedical, FaArrowLeft, FaCalendarCheck, FaChartLine } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdultHealth = () => {
    const {
        highContrast, fontSize, bgColor, textColor, cardBg,
        subTextColor, mutedTextColor, accentColor
    } = useAccessibility();

    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    const adultProfileId = user?.regid;

    useEffect(() => {
        const fetchHealth = async () => {
            try {
                if (!adultProfileId) return;
                const res = await axios.post("http://localhost:5000/demo/adult/health/self", { id: adultProfileId });
                setReports(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchHealth();
    }, [adultProfileId]);

    const fontStyle = {
        fontSize: fontSize === 'large' ? '1.25rem' : fontSize === 'extra-large' ? '1.5rem' : '1rem'
    };

    return (
        <>
            <style>{`
                .health-card {
                    border-radius: 30px;
                    transition: all 0.3s ease;
                    border: none;
                    overflow: hidden;
                    background: ${highContrast ? '#000' : 'white'};
                }

                .health-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.1) !important;
                }

                .health-stat-box {
                    background: ${highContrast ? '#333' : '#f8fafc'};
                    padding: 20px;
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    margin-bottom: 15px;
                }

                .page-header-health {
                    background: ${highContrast ? '#000' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'};
                    padding: 60px 0;
                    margin-bottom: 40px;
                    border-radius: 0 0 50px 50px;
                    color: white;
                }

                .health-icon-circle {
                    width: 50px;
                    height: 50px;
                    border-radius: 15px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                }
            `}</style>

            <div style={{ backgroundColor: bgColor, minHeight: "100vh", color: textColor, transition: "0.3s", paddingTop: '70px' }}>
                <AdultNavbar />

                <div className="page-header-health shadow-lg">
                    <Container>
                        <div className="d-flex align-items-center justify-content-center gap-3 mb-3">
                            <FaHeartbeat size={50} />
                            <h1 style={{ fontWeight: 900, fontSize: '3.5rem', marginBottom: 0 }}>Wellness Center</h1>
                        </div>
                        <p style={{ fontSize: '1.3rem', opacity: highContrast ? 1 : 0.9 }}>Your health is your greatest treasure. Keep track of your vitals and progress here.</p>
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
                    <Row>
                        {loading ? (
                            <Col className="text-center py-5">
                                <div className="spinner-border text-danger" style={{ width: '3rem', height: '3rem' }}></div>
                                <h3 className="mt-3">Collecting your health data...</h3>
                            </Col>
                        ) : reports.length > 0 ? (
                            reports.map((report, idx) => (
                                <Col md={6} lg={4} key={idx} className="mb-4">
                                    <Card className="health-card h-100 shadow-sm" style={{
                                        border: highContrast ? '2px solid #FFD700' : 'none'
                                    }}>
                                        <Card.Header className="bg-transparent border-0 p-4 d-flex justify-content-between align-items-center">
                                            <div className="d-flex align-items-center gap-2">
                                                <FaCalendarCheck color={highContrast ? "#FFD700" : "#ef4444"} />
                                                <h5 className="mb-0 fw-bold">
                                                    {new Date(report.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </h5>
                                            </div>
                                            <Badge pill bg={highContrast ? "warning" : "dark"} text={highContrast ? "dark" : "white"} style={{ padding: '8px 15px' }}>
                                                {new Date(report.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </Badge>
                                        </Card.Header>
                                        <Card.Body className="p-4 pt-0">
                                            <div className="health-stat-box">
                                                <div className="health-icon-circle" style={{ background: highContrast ? '#FFD700' : '#dbeafe', color: highContrast ? '#000' : '#3b82f6' }}>
                                                    <FaRulerVertical />
                                                </div>
                                                <div>
                                                    <div className="small fw-bold" style={{ color: mutedTextColor }}>HEIGHT</div>
                                                    <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>{report.height} <small>cm</small></div>
                                                </div>
                                            </div>

                                            <div className="health-stat-box">
                                                <div className="health-icon-circle" style={{ background: highContrast ? '#FFD700' : '#fef3c7', color: highContrast ? '#000' : '#f59e0b' }}>
                                                    <FaWeight />
                                                </div>
                                                <div>
                                                    <div className="small fw-bold" style={{ color: mutedTextColor }}>WEIGHT</div>
                                                    <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>{report.weight} <small>kg</small></div>
                                                </div>
                                            </div>

                                            <div className="health-stat-box">
                                                <div className="health-icon-circle" style={{ background: highContrast ? '#FFD700' : '#dcfce7', color: highContrast ? '#000' : '#22c55e' }}>
                                                    <FaChartLine />
                                                </div>
                                                <div>
                                                    <div className="small fw-bold" style={{ color: mutedTextColor }}>BMI SCORE</div>
                                                    <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>{report.bmi}</div>
                                                </div>
                                            </div>

                                            {report.incidentDescription && (
                                                <div className="mt-4 p-4 rounded-4" style={{
                                                    background: highContrast ? '#000' : '#fff1f2',
                                                    border: highContrast ? '2px solid #FFD700' : '1px solid #fecaca',
                                                    color: subTextColor
                                                }}>
                                                    <div className="d-flex align-items-center gap-2 mb-2" style={{ color: highContrast ? '#FFD700' : '#be123c' }}>
                                                        <FaNotesMedical /> <strong>Provider Notes:</strong>
                                                    </div>
                                                    <p className="mb-0 small fw-bold" style={{ lineHeight: 1.5 }}>{report.incidentDescription}</p>
                                                </div>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                        ) : (
                            <Col className="text-center py-5">
                                <div style={{
                                    background: highContrast ? '#000' : '#f8fafc',
                                    borderRadius: '30px',
                                    padding: '80px',
                                    border: highContrast ? '4px dashed #FFD700' : '2px dashed #e2e8f0'
                                }}>
                                    <FaHeartbeat size={80} style={{ color: mutedTextColor }} className="mb-4" />
                                    <h2 style={{ fontWeight: 800 }}>No Wellness Checks Yet</h2>
                                    <p style={{ color: subTextColor }}>Your first health report will appear here once your care team completes a check-up.</p>
                                </div>
                            </Col>
                        )}
                    </Row>
                </Container>
            </div>
        </>
    );
};

export default AdultHealth;
