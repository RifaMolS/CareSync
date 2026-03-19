import React, { useEffect, useState } from "react";
import ParentSide from "./ParentSide";
import ParentNav from "./ParentNav";
import { FaPills, FaClipboardList, FaClock, FaPlus, FaUser } from "react-icons/fa";
import { Modal, Button, Form } from "react-bootstrap";

export default function ParentMedications() {
    const [medications, setMedications] = useState([]);
    const [wards, setWards] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        dosage: "",
        time: "",
        instructions: "",
        wardId: ""
    });

    const auth = JSON.parse(localStorage.getItem("user"));
    const parentId = auth?.regid;

    const fetchMedications = () => {
        if (parentId) {
            fetch("http://localhost:5000/demo/getmedicationsbyparentid", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ parentId }),
            })
                .then((res) => res.json())
                .then((data) => setMedications(data))
                .catch((err) => console.error(err));
        }
    };

    const fetchWards = async () => {
        try {
            const childRes = await fetch("http://localhost:5000/demo/getChildrenByParentId", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ parentId }),
            });
            const children = await childRes.json();

            const adultRes = await fetch("http://localhost:5000/demo/getAdultsByParentId", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ parentId }),
            });
            const adults = await adultRes.json();

            const combined = [
                ...children.map(c => ({ id: c._id, name: c.childname, type: 'child', validationId: c._id })),
                ...adults.map(a => ({ id: a._id, name: a.adultname, type: 'adult', validationId: a._id }))
            ];
            setWards(combined);
        } catch (err) {
            console.error("Error fetching wards:", err);
        }
    };

    useEffect(() => {
        fetchMedications();
        fetchWards();
    }, [parentId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const selectedWard = wards.find(w => w.id === formData.wardId);
        if (!selectedWard) return alert("Please select a family member.");

        const payload = {
            name: formData.name,
            dosage: formData.dosage,
            time: formData.time,
            instructions: formData.instructions,
            childId: selectedWard.type === 'child' ? selectedWard.id : undefined,
            adultId: selectedWard.type === 'adult' ? selectedWard.id : undefined
        };

        try {
            const res = await fetch("http://localhost:5000/demo/adult/add-medication", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                alert("Medication added successfully! Staff will be notified. 💊");
                setShowModal(false);
                setFormData({ name: "", dosage: "", time: "", instructions: "", wardId: "" });
                fetchMedications();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const styles = {
        container: {
            backgroundColor: "#f3f4f6",
            minHeight: "100vh",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        },
        header: {
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "white",
            padding: "2.5rem 2rem",
            borderRadius: "1.5rem",
            marginBottom: "2rem",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
        },
        card: {
            background: "white",
            borderRadius: "1rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
            marginBottom: "1rem",
            borderTop: "5px solid #10b981",
            transition: "transform 0.2s",
        },
        statusBadge: {
            padding: "0.5rem 1rem",
            borderRadius: "2rem",
            fontSize: "0.85rem",
            fontWeight: "600"
        }
    };

    return (
        <div className="container-fluid p-0" style={{ ...styles.container, overflow: 'hidden' }}>
            <ParentSide />
            <div className="content" style={{
                marginLeft: "260px",
                flex: 1,
                overflowY: "auto",
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#f8fafc',
                minHeight: '100vh'
            }}>
                <ParentNav />

                <div className="container-fluid px-4 py-4" style={{ maxWidth: '1400px' }}>
                    {/* Header Section */}
                    <div style={styles.header} className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                        <div>
                            <h1 className="fw-bold mb-1">Medication Management 💊</h1>
                            <p className="mb-0 opacity-90">Add and monitor medications for your family members.</p>
                        </div>
                        <button
                            className="btn btn-white text-success fw-bold px-4 py-2 rounded-pill shadow-sm bg-white"
                            onClick={() => setShowModal(true)}
                        >
                            <FaPlus className="me-2" /> Add Medicine
                        </button>
                    </div>

                    {medications.length > 0 ? (
                        <div className="row g-4">
                            {medications.map((med) => (
                                <div className="col-md-6 col-lg-4" key={med._id}>
                                    <div style={styles.card} className="h-100 p-4 d-flex flex-column">
                                        <div className="d-flex align-items-start justify-content-between mb-4">
                                            <div className="d-flex align-items-center">
                                                <div className="bg-success-subtle p-3 rounded-circle text-success me-3">
                                                    <FaPills size={22} />
                                                </div>
                                                <div>
                                                    <h5 className="fw-bold mb-0 text-dark">{med.name}</h5>
                                                    <span className="text-muted small">{med.dosage}</span>
                                                </div>
                                            </div>
                                            <div className="text-end">
                                                <div className="badge bg-primary-subtle text-primary mb-1 border border-primary-subtle d-block">
                                                    <FaUser className="me-1 small" />
                                                    {med.childId?.regid?.childname || med.adultId?.regid?.adultname || "Unknown"}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <div className="d-flex align-items-center text-secondary small mb-1">
                                                <FaClock className="me-2" />
                                                <span className="text-uppercase fw-bold ls-1">Scheduled Time</span>
                                            </div>
                                            <div className="fs-5 fw-medium text-dark">{med.time}</div>
                                        </div>

                                        <div className="mb-3 flex-grow-1">
                                            <div className="d-flex align-items-center text-secondary small mb-1">
                                                <FaClipboardList className="me-2" />
                                                <span className="text-uppercase fw-bold ls-1">Instructions</span>
                                            </div>
                                            <p className="text-secondary small mb-0">{med.instructions || "No specific instructions."}</p>
                                        </div>

                                        <div className="mt-auto pt-3 border-top d-flex align-items-center justify-content-between">
                                            <span className="small text-muted fw-bold">STAFF STATUS:</span>
                                            {med.isViewed ? (
                                                <span className="text-success fw-bold small">
                                                    Acknowledged ✅
                                                </span>
                                            ) : (
                                                <span className="text-warning fw-bold small">
                                                    Waiting Review ⏳
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-5 bg-white rounded-4 shadow-sm">
                            <div className="bg-light p-5 rounded-circle d-inline-block mb-3">
                                <FaPills size={50} className="text-muted" />
                            </div>
                            <h3 className="text-secondary">No active medications found.</h3>
                            <p className="text-muted">Click the "Add Medicine" button to get started.</p>
                        </div>
                    )}
                </div>

                {/* Add Medication Modal */}
                <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
                    <Modal.Header closeButton className="border-0 pb-0">
                        <Modal.Title className="fw-bold text-success">Add New Medication 💊</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={handleSubmit}>
                        <Modal.Body className="p-4">
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Select Family Member</Form.Label>
                                <Form.Select
                                    name="wardId"
                                    value={formData.wardId}
                                    onChange={handleChange}
                                    required
                                    className="rounded-3 py-2"
                                >
                                    <option value="">-- Choose Member --</option>
                                    {wards.map(ward => (
                                        <option key={ward.id} value={ward.id}>
                                            {ward.name} ({ward.type.charAt(0).toUpperCase() + ward.type.slice(1)})
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Medicine Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    placeholder="e.g. Paracetamol"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="rounded-3 py-2"
                                />
                            </Form.Group>

                            <div className="row">
                                <div className="col-md-6">
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Dosage</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="dosage"
                                            placeholder="e.g. 500mg / 1 Tablet"
                                            value={formData.dosage}
                                            onChange={handleChange}
                                            required
                                            className="rounded-3 py-2"
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-md-6">
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Preferred Time</Form.Label>
                                        <Form.Control
                                            type="time"
                                            name="time"
                                            value={formData.time}
                                            onChange={handleChange}
                                            required
                                            className="rounded-3 py-2"
                                        />
                                    </Form.Group>
                                </div>
                            </div>

                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Special Instructions</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="instructions"
                                    placeholder="e.g. Take after breakfast"
                                    value={formData.instructions}
                                    onChange={handleChange}
                                    className="rounded-3"
                                />
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer className="border-0 pt-0">
                            <Button variant="light" onClick={() => setShowModal(false)} className="rounded-pill px-4">
                                Cancel
                            </Button>
                            <Button variant="success" type="submit" className="rounded-pill px-4 shadow-sm">
                                Save Medication
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </div>
        </div >
    );
}

