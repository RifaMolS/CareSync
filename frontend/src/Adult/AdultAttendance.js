import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button } from 'react-bootstrap';
import { useAccessibility } from './AccessibilityContext';
import AdultNavbar from './AdultNavbar';
import axios from 'axios';
import { FaCalendarAlt, FaArrowLeft, FaHistory, FaCheckCircle, FaUserCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdultAttendance = () => {
    const {
        highContrast, fontSize, bgColor, textColor, cardBg
    } = useAccessibility();

    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    const adultId = user?._id;

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                if (!adultId) return;
                const res = await axios.post("http://localhost:5000/demo/adult/attendance/self", { adultId });
                setAttendance(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAttendance();
    }, [adultId]);

    const fontStyle = {
        fontSize: fontSize === 'large' ? '1.25rem' : fontSize === 'extra-large' ? '1.5rem' : '1rem'
    };

    return (
        <>
            <style>{`
                .attendance-card {
                    border-radius: 30px;
                    border: none;
                    background: ${highContrast ? '#000' : 'white'};
                    overflow: hidden;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
                }

                .attendance-table {
                    margin-bottom: 0;
                }

                .attendance-table thead th {
                    background: ${highContrast ? '#333' : '#f8fafc'};
                    border-bottom: 2px solid ${highContrast ? '#FFD700' : '#e2e8f0'};
                    padding: 20px;
                    font-weight: 800;
                    text-transform: uppercase;
                    font-size: 0.9rem;
                    letter-spacing: 1px;
                }

                .attendance-table tbody td {
                    padding: 20px;
                    vertical-align: middle;
                    border-bottom: 1px solid #f1f5f9;
                }

                .page-header-attendance {
                    background: ${highContrast ? '#000' : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'};
                    padding: 60px 0;
                    margin-bottom: 40px;
                    border-radius: 0 0 50px 50px;
                    color: white;
                    text-align: center;
                }

                .status-badge {
                    padding: 8px 15px;
                    border-radius: 12px;
                    font-weight: 700;
                    font-size: 0.9rem;
                }
            `}</style>

            <div style={{ backgroundColor: bgColor, minHeight: "100vh", color: textColor, transition: "0.3s", paddingTop: '70px' }}>
                <AdultNavbar />

                <div className="page-header-attendance shadow-lg">
                    <Container>
                        <div className="d-flex align-items-center justify-content-center gap-3 mb-3">
                            <FaUserCheck size={50} />
                            <h1 style={{ fontWeight: 900, fontSize: '3.5rem', marginBottom: 0 }}>Attendance Log</h1>
                        </div>
                        <p style={{ fontSize: '1.3rem', opacity: 0.9 }}>Your reliable record of participation and community engagement.</p>
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
                    <Row className="justify-content-center">
                        <Col lg={10}>
                            <Card className="attendance-card shadow-lg">
                                <Card.Body className="p-0">
                                    {loading ? (
                                        <div className="text-center py-5">
                                            <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}></div>
                                            <h4 className="mt-3">Loading your records...</h4>
                                        </div>
                                    ) : attendance.length > 0 ? (
                                        <Table responsive hover className="attendance-table">
                                            <thead>
                                                <tr>
                                                    <th><FaCalendarAlt className="me-2" /> DATE</th>
                                                    <th><FaHistory className="me-2" /> TIME</th>
                                                    <th><FaCheckCircle className="me-2" /> STATUS</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {attendance.map((record, index) => (
                                                    <tr key={index}>
                                                        <td style={{ fontWeight: 700 }}>
                                                            {new Date(record.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                                        </td>
                                                        <td className="text-muted">
                                                            {new Date(record.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </td>
                                                        <td>
                                                            <Badge
                                                                className="status-badge"
                                                                bg={record.status.toLowerCase().includes('absent') ? 'danger' : 'success'}
                                                            >
                                                                {record.status.toUpperCase()}
                                                            </Badge>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    ) : (
                                        <div className="text-center py-5">
                                            <FaHistory size={80} className="mb-4 text-muted opacity-20" />
                                            <h3 style={{ fontWeight: 800 }}>No Check-ins Recorded</h3>
                                            <p className="text-muted">Your daily check-ins will be logged here automatically.</p>
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
};

export default AdultAttendance;
