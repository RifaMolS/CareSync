import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button } from 'react-bootstrap';
import { useAccessibility } from './AccessibilityContext';
import AdultNavbar from './AdultNavbar';
import axios from 'axios';
import { FaShieldVirus, FaCalendarCheck, FaUserMd, FaArrowLeft, FaClock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdultImmunization = () => {
    const {
        highContrast, fontSize, bgColor, textColor, cardBg
    } = useAccessibility();

    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    const adultId = user?.regid;

    const fetchRecords = async () => {
        try {
            if (!adultId) return;
            const res = await axios.post("http://localhost:5000/demo/get-immunizations", { adultId });
            setRecords(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, [adultId]);

    const handleComplete = async (id) => {
        try {
            await axios.post("http://localhost:5000/demo/update-immunization-status", { id, status: "completed" });
            fetchRecords();
        } catch (err) {
            console.error(err);
        }
    };

    const fontStyle = {
        fontSize: fontSize === 'large' ? '1.25rem' : fontSize === 'extra-large' ? '1.5rem' : '1.1rem'
    };

    return (
        <>
            <style>{`
                .immunization-card {
                    border-radius: 40px;
                    border: none;
                    background: ${highContrast ? '#000' : 'white'};
                    overflow: hidden;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.1);
                    border: ${highContrast ? '4px solid #FFD700' : 'none'};
                }

                .imm-table thead th {
                    background: ${highContrast ? '#333' : '#f8fafc'};
                    color: ${highContrast ? '#FFD700' : '#475569'};
                    padding: 25px;
                    font-weight: 800;
                    border-bottom: 2px solid ${highContrast ? '#FFD700' : '#e2e8f0'};
                }

                .imm-table tbody td {
                    padding: 25px;
                    vertical-align: middle;
                    border-bottom: 1px solid #f1f5f9;
                }

                .page-header-premium {
                    background: ${highContrast ? '#000' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)'};
                    padding: 80px 0;
                    margin-bottom: 50px;
                    border-radius: 0 0 60px 60px;
                    color: white;
                    text-align: center;
                    border-bottom: ${highContrast ? '5px solid #FFD700' : 'none'};
                }

                .vaccine-name {
                    font-weight: 900;
                    font-size: 1.3rem;
                    color: ${highContrast ? '#FFD700' : '#064e3b'};
                }
            `}</style>

            <div style={{ backgroundColor: bgColor, minHeight: "100vh", color: textColor, transition: "0.4s", paddingTop: '70px' }}>
                <AdultNavbar />

                <div className="page-header-premium shadow-lg">
                    <Container>
                        <div className="d-flex align-items-center justify-content-center gap-4 mb-3">
                            <FaShieldVirus size={60} />
                            <h1 style={{ fontWeight: 900, fontSize: '4rem', marginBottom: 0 }}>Immunization Shield</h1>
                        </div>
                        <p style={{ fontSize: '1.5rem', opacity: 0.9 }}>Your complete record of vaccinations and preventative health measures.</p>
                        <Button
                            variant="outline-light"
                            className="mt-4 px-5 py-3 fw-bold"
                            style={{ borderRadius: '20px', fontSize: '1.2rem' }}
                            onClick={() => navigate(-1)}
                        >
                            <FaArrowLeft className="me-2" /> Back to Safety
                        </Button>
                    </Container>
                </div>

                <Container className="pb-5" style={fontStyle}>
                    <Row className="justify-content-center">
                        <Col lg={11}>
                            <Card className="immunization-card">
                                <Card.Body className="p-0">
                                    {loading ? (
                                        <div className="text-center py-5">
                                            <div className="spinner-border text-success" style={{ width: '4rem', height: '4rem' }}></div>
                                            <h3 className="mt-3">Reviewing your shield...</h3>
                                        </div>
                                    ) : records.length > 0 ? (
                                        <Table responsive hover className="imm-table mb-0">
                                            <thead>
                                                <tr>
                                                    <th>VACCINE NAME</th>
                                                    <th>DATE GIVEN</th>
                                                    <th>ADMINISTERED BY</th>
                                                    <th>NEXT DUE DATE</th>
                                                    <th>STATUS</th>
                                                    <th>ACTION</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {records.map((record, index) => (
                                                    <tr key={index}>
                                                        <td className="vaccine-name">{record.vaccineName}</td>
                                                        <td style={{ fontWeight: 600 }}>
                                                            <FaCalendarCheck className="me-2 text-success" />
                                                            {new Date(record.dateAdministered).toLocaleDateString()}
                                                        </td>
                                                        <td className="text-muted">
                                                            <FaUserMd className="me-2" />
                                                            {record.administeredBy || "Staff Specialist"}
                                                        </td>
                                                        <td style={{ color: record.status === 'due' ? '#ef4444' : 'inherit', fontWeight: '700' }}>
                                                            <FaClock className="me-2" />
                                                            {record.nextDueDate ? new Date(record.nextDueDate).toLocaleDateString() : "N/A"}
                                                        </td>
                                                        <td>
                                                            <Badge
                                                                pill
                                                                bg={record.status === 'completed' ? 'success' : record.status === 'due' ? 'danger' : 'warning'}
                                                                className="px-3 py-2"
                                                                style={{ fontSize: '0.9rem' }}
                                                            >
                                                                {record.status.toUpperCase()}
                                                            </Badge>
                                                        </td>
                                                        <td>
                                                            {record.status !== 'completed' && (
                                                                <Button
                                                                    variant="success"
                                                                    size="sm"
                                                                    className="rounded-pill px-3"
                                                                    onClick={() => handleComplete(record._id)}
                                                                >
                                                                    Done ✅
                                                                </Button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    ) : (
                                        <div className="text-center py-5">
                                            <FaShieldVirus size={100} className="mb-4 text-muted opacity-25" />
                                            <h2 style={{ fontWeight: 900 }}>Your Shield is Active</h2>
                                            <p className="text-muted fs-4">No vaccination records found. Please contact the care team for updates.</p>
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>

                            {/* Info Card */}
                            <Card className="mt-5 border-0 shadow-sm" style={{ borderRadius: '30px', background: highContrast ? '#111' : '#ecfdf5' }}>
                                <Card.Body className="p-5 d-flex align-items-center gap-4">
                                    <div style={{ background: '#059669', color: 'white', padding: '20px', borderRadius: '20px' }}>
                                        <FaUserMd size={40} />
                                    </div>
                                    <div>
                                        <h3 className="fw-900 mb-2">Need a Vaccination?</h3>
                                        <p className="mb-0 fs-5 text-muted">Contact our health department to schedule your regular check-up or vaccination update.</p>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
};

export default AdultImmunization;
