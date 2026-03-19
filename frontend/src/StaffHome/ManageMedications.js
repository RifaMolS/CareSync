import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import StaffNav from "./StaffNav";
import StaffSide from "./StaffSide";

const ManageMedications = () => {
    const auth = JSON.parse(localStorage.getItem("user"));
    const [medications, setMedications] = useState([]);
    const [msg, setMsg] = useState("");

    const fetchMedications = async () => {
        try {
            const res = await axios.post("http://localhost:5000/demo/adult/get-medications-by-staff", { staffId: auth._id });
            setMedications(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (auth?._id) {
            fetchMedications();
        }
    }, [auth?._id]);

    const handleMarkAsViewed = async (id) => {
        try {
            await axios.post("http://localhost:5000/demo/adult/mark-medication-viewed", { medicationId: id });
            setMsg("Medication marked as viewed! Notification sent to guardian. ✅");
            fetchMedications(); // Refresh list
        } catch (err) {
            console.error(err);
            setMsg("Error marking medication as viewed.");
        }
    };

    return (
        <div className="container-fluid position-relative bg-white d-flex p-0">
            <StaffSide />
            <div className="content">
                <StaffNav />
                <Container fluid className="pt-4 px-4">
                    <Row className="g-4">
                        <Col sm={12}>
                            <Card className="rounded h-100 p-4 shadow-sm border-0">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h3 className="mb-0 text-primary">Patient Medications 📋</h3>
                                    <span className="text-muted">View medications added by guardians</span>
                                </div>
                                {msg && <Alert variant="success" onClose={() => setMsg("")} dismissible>{msg}</Alert>}
                                {medications.length > 0 ? (
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Patient Name</th>
                                                    <th>Medicine Name</th>
                                                    <th>Dosage</th>
                                                    <th>Scheduled Time</th>
                                                    <th>Instructions</th>
                                                    <th>Status</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {medications.map((med) => {
                                                    const patientName = med.childId?.regid?.childname || med.adultId?.regid?.adultname || "Unknown";

                                                    return (
                                                        <tr key={med._id}>
                                                            <td><span className="fw-bold">{patientName}</span></td>
                                                            <td>{med.name}</td>
                                                            <td><span className="badge bg-info-subtle text-info border border-info-subtle">{med.dosage}</span></td>
                                                            <td><span className="text-primary fw-medium">{med.time}</span></td>
                                                            <td><small className="text-muted">{med.instructions || "N/A"}</small></td>
                                                            <td>
                                                                {med.isViewed ? (
                                                                    <span className="badge bg-success">Viewed ✅</span>
                                                                ) : (
                                                                    <span className="badge bg-warning text-dark">Pending Review ⏳</span>
                                                                )}
                                                            </td>
                                                            <td>
                                                                {!med.isViewed ? (
                                                                    <Button
                                                                        variant="primary"
                                                                        size="sm"
                                                                        className="rounded-pill px-3"
                                                                        onClick={() => handleMarkAsViewed(med._id)}
                                                                    >
                                                                        Mark as Viewed
                                                                    </Button>
                                                                ) : (
                                                                    <Button
                                                                        variant="outline-secondary"
                                                                        size="sm"
                                                                        className="rounded-pill px-3"
                                                                        disabled
                                                                    >
                                                                        Acknowledged
                                                                    </Button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-5">
                                        <p className="text-muted mb-0">No medications found for your assigned patients.</p>
                                    </div>
                                )}
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
};


export default ManageMedications;
