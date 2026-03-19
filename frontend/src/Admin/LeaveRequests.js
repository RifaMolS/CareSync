import React, { useEffect, useState } from 'react';
import Side from './Side';
import AdminNav from './AdminNav';
import { Modal, Button, Form, Table, Badge, Alert } from 'react-bootstrap';
import axios from 'axios';
import { FaCheck, FaTimes, FaExchangeAlt } from 'react-icons/fa';

export default function LeaveRequests() {
    const [leaves, setLeaves] = useState([]);
    const [alternates, setAlternates] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [actionType, setActionType] = useState(''); // 'approve' or 'reject'
    const [formData, setFormData] = useState({
        adminResponse: '',
        substituteStaffId: ''
    });
    const [msg, setMsg] = useState("");

    useEffect(() => {
        fetchLeaves();
        fetchAlternates();
    }, []);

    const fetchLeaves = async () => {
        try {
            const res = await axios.get("http://localhost:5000/demo/get-leaves");
            setLeaves(res.data);
        } catch (err) {
            console.error("Error fetching leaves", err);
        }
    };

    const fetchAlternates = async () => {
        try {
            const res = await axios.get("http://localhost:5000/demo/get-alternate-staff");
            setAlternates(res.data);
        } catch (err) {
            console.error("Error fetching alternates", err);
        }
    };

    const handleAction = (leave, type) => {
        setSelectedLeave(leave);
        setActionType(type);
        setFormData({ adminResponse: '', substituteStaffId: '' });
        setShowModal(true);
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                leaveId: selectedLeave._id,
                status: actionType === 'approve' ? 'approved' : 'rejected',
                adminResponse: formData.adminResponse,
                substituteStaffId: formData.substituteStaffId
            };

            if (actionType === 'approve' && !formData.substituteStaffId) {
                alert("Please select an alternate staff.");
                return;
            }

            await axios.post("http://localhost:5000/demo/update-leave-status", payload);
            setMsg(`Leave ${actionType === 'approve' ? 'Approved' : 'Rejected'} successfully!`);
            setShowModal(false);
            fetchLeaves();
            setTimeout(() => setMsg(""), 3000);
        } catch (err) {
            console.error("Error updating leave", err);
            alert("Failed to update leave status.");
        }
    };

    const handleImageError = (e) => {
        e.target.src = "https://via.placeholder.com/40"; // Fallback image
    };

    return (
        <div className="min-vh-100 bg-light">
            <Side />
            <div className="content">
                <AdminNav />
                <div className="container-fluid pt-4 px-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h3 className="text-primary fw-bold mb-0">Leave Requests Management</h3>
                    </div>

                    {msg && <Alert variant={msg.includes("Approved") ? "success" : "danger"} className="shadow-sm border-0 rounded-3 mb-4">{msg}</Alert>}

                    <div className="card border-0 shadow-sm rounded-4 p-4">
                        <div className="table-responsive">
                            <Table hover className="align-middle mb-0">
                                <thead className="bg-light">
                                    <tr className="text-secondary">
                                        <th className="border-0 py-3 ps-3">Staff Member</th>
                                        <th className="border-0 py-3">Date Range</th>
                                        <th className="border-0 py-3" style={{ width: '30%' }}>Reason</th>
                                        <th className="border-0 py-3 text-center">Status</th>
                                        <th className="border-0 py-3">Alternate</th>
                                        <th className="border-0 py-3 text-end pe-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaves.map((leave) => (
                                        <tr key={leave._id} className="border-bottom">
                                            <td className="ps-3">
                                                <div className="d-flex align-items-center">
                                                    <div className="position-relative me-3">
                                                        <img
                                                            src={leave.staffId?.image ? `http://localhost:5000/${leave.staffId.image}` : "https://via.placeholder.com/40"}
                                                            alt=""
                                                            onError={handleImageError}
                                                            className="rounded-circle object-fit-cover shadow-sm"
                                                            style={{ width: 45, height: 45 }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <h6 className="mb-0 fw-semibold text-dark">{leave.staffId?.name || "Unknown"}</h6>
                                                        <small className="text-muted">{leave.staffId?.role || "Staff"}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="d-flex flex-column">
                                                    <span className="fw-medium text-dark">
                                                        {new Date(leave.startDate).toLocaleDateString()}
                                                    </span>
                                                    <small className="text-muted">to</small>
                                                    <span className="fw-medium text-dark">
                                                        {new Date(leave.endDate).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="text-wrap text-muted small" style={{ lineHeight: '1.5' }}>
                                                    {leave.reason}
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                <Badge bg={leave.status === 'approved' ? 'success' : leave.status === 'rejected' ? 'danger' : 'warning'} className="px-3 py-2 rounded-pill fw-normal">
                                                    {leave.status.toUpperCase()}
                                                </Badge>
                                            </td>
                                            <td>
                                                {leave.substituteStaffId ? (
                                                    <div className="d-flex align-items-center text-primary">
                                                        <FaExchangeAlt className="me-2 text-muted small" />
                                                        <span className="fw-medium">{leave.substituteStaffId.name}</span>
                                                    </div>
                                                ) : <span className="text-muted">-</span>}
                                            </td>
                                            <td className="text-end pe-3">
                                                {leave.status === 'pending' ? (
                                                    <div className="d-flex justify-content-end gap-2">
                                                        <Button
                                                            variant="success"
                                                            size="sm"
                                                            className="d-flex align-items-center justify-content-center rounded-circle shadow-sm"
                                                            style={{ width: 32, height: 32 }}
                                                            title="Approve"
                                                            onClick={() => handleAction(leave, 'approve')}
                                                        >
                                                            <FaCheck size={14} />
                                                        </Button>
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            className="d-flex align-items-center justify-content-center rounded-circle shadow-sm"
                                                            style={{ width: 32, height: 32 }}
                                                            title="Reject"
                                                            onClick={() => handleAction(leave, 'reject')}
                                                        >
                                                            <FaTimes size={14} />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted small fst-italic">Completed</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {leaves.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="text-center py-5 text-muted">
                                                <div className="mb-2" style={{ fontSize: '2rem' }}>📭</div>
                                                No pending leave requests found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </div>

                    <Modal show={showModal} onHide={() => setShowModal(false)} centered backdrop="static">
                        <Modal.Header closeButton className="border-0 pb-0">
                            <Modal.Title className={`fw-bold ${actionType === 'approve' ? 'text-success' : 'text-danger'}`}>
                                {actionType === 'approve' ? 'Approve Leave Request' : 'Reject Leave Request'}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="pt-2">
                            <p className="text-muted mb-4 small">
                                {actionType === 'approve'
                                    ? "You are about to approve this leave request. Please assign an alternate staff member to cover the shift."
                                    : "You are about to reject this leave request. Please provide a reason."}
                            </p>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold small text-uppercase text-secondary">Admin Response / Note</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        className="bg-light border-0"
                                        placeholder="Add a note (optional)..."
                                        value={formData.adminResponse}
                                        onChange={(e) => setFormData({ ...formData, adminResponse: e.target.value })}
                                    />
                                </Form.Group>

                                {actionType === 'approve' && (
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-semibold small text-uppercase text-secondary">Assign Alternate Staff <span className="text-danger">*</span></Form.Label>
                                        <Form.Select
                                            value={formData.substituteStaffId}
                                            className="bg-light border-0 py-2"
                                            onChange={(e) => setFormData({ ...formData, substituteStaffId: e.target.value })}
                                        >
                                            <option value="">-- Select Alternate Staff --</option>
                                            {alternates
                                                .filter(staff => staff._id !== selectedLeave?.staffId?._id)
                                                .map(staff => (
                                                    <option key={staff._id} value={staff._id}>{staff.name} ({staff.role})</option>
                                                ))}
                                        </Form.Select>
                                        <Form.Text className="text-muted small">
                                            <FaExchangeAlt className="me-1" /> Only staff marked as "Alternate" are available.
                                        </Form.Text>
                                    </Form.Group>
                                )}
                            </Form>
                        </Modal.Body>
                        <Modal.Footer className="border-0 pt-0">
                            <Button variant="light" className="rounded-pill px-4" onClick={() => setShowModal(false)}>Cancel</Button>
                            <Button
                                variant={actionType === 'approve' ? 'success' : 'danger'}
                                className="rounded-pill px-4 fw-bold shadow-sm"
                                onClick={handleSubmit}
                            >
                                Confirm {actionType === 'approve' ? 'Approval' : 'Rejection'}
                            </Button>
                        </Modal.Footer>
                    </Modal>

                </div>
            </div>
        </div>
    );
}
