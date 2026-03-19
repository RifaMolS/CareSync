import React, { useEffect, useState } from 'react';
import StaffNav from './StaffNav';
import StaffSide from './StaffSide';
import axios from 'axios';
import { Form, Button, Table, Alert, Badge } from 'react-bootstrap';

export default function MyLeave() {
    const [leaves, setLeaves] = useState([]);
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        reason: ''
    });
    const [msg, setMsg] = useState("");
    const [user] = useState(JSON.parse(localStorage.getItem("user")) || {});

    // Robust ID retrieval
    const staffId = user?.regid || user?._id;

    useEffect(() => {
        if (staffId) {
            fetchMyLeaves();
        }
    }, [staffId]);

    const fetchMyLeaves = async () => {
        try {
            if (!staffId) return;
            const res = await axios.post("http://localhost:5000/demo/get-my-leaves", { staffId });
            setLeaves(res.data);
        } catch (err) {
            console.error("Error fetching leaves", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!staffId) {
            setMsg("User session invalid. Please relogin.");
            return;
        }
        try {
            await axios.post("http://localhost:5000/demo/apply-leave", {
                staffId,
                ...formData
            });
            setMsg("Leave requested successfully!");
            setFormData({ startDate: '', endDate: '', reason: '' });
            fetchMyLeaves();
        } catch (err) {
            console.error(err);
            setMsg("Failed to request leave.");
        }
    };

    return (
        <div className="d-flex min-vh-100 bg-light">
            <StaffSide />
            <div className="content w-100">
                <StaffNav />
                <div className="container-fluid pt-4 px-4">
                    <h3 className="mb-4 text-primary fw-bold">My Leave Requests</h3>

                    {msg && <Alert variant={msg.includes("success") ? "success" : "danger"}>{msg}</Alert>}

                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="card border-0 shadow-sm rounded-4 p-4">
                                <h5 className="mb-3 fw-bold">Request Leave</h5>
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Start Date</Form.Label>
                                        <Form.Control
                                            type="date"
                                            required
                                            value={formData.startDate}
                                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>End Date</Form.Label>
                                        <Form.Control
                                            type="date"
                                            required
                                            value={formData.endDate}
                                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Reason</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            required
                                            value={formData.reason}
                                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                        />
                                    </Form.Group>
                                    <Button variant="primary" type="submit" className="w-100 rounded-pill fw-bold">Submit Request</Button>
                                </Form>
                            </div>
                        </div>

                        <div className="col-md-8">
                            <div className="card border-0 shadow-sm rounded-4 p-4">
                                <h5 className="mb-3 fw-bold">History</h5>
                                <Table responsive hover className="align-middle">
                                    <thead className="bg-light">
                                        <tr>
                                            <th>Date Range</th>
                                            <th>Reason</th>
                                            <th>Status</th>
                                            <th>Admin Note</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {leaves.map(leave => (
                                            <tr key={leave._id}>
                                                <td>
                                                    {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                                </td>
                                                <td>{leave.reason}</td>
                                                <td>
                                                    <Badge bg={leave.status === 'approved' ? 'success' : leave.status === 'rejected' ? 'danger' : 'warning'}>
                                                        {leave.status.toUpperCase()}
                                                    </Badge>
                                                </td>
                                                <td>{leave.adminResponse || "-"}</td>
                                            </tr>
                                        ))}
                                        {leaves.length === 0 && <tr><td colSpan="4" className="text-center text-muted py-4">No leave history.</td></tr>}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
