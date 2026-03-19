import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Alert, ListGroup, Badge, Tabs, Tab } from "react-bootstrap";
import axios from "axios";
import StaffNav from "./StaffNav";
import StaffSide from "./StaffSide";
import { FaTrash, FaStar, FaMedal, FaGift, FaMale, FaChild as FaChildIcon } from "react-icons/fa";

const AssignRewards = () => {
    const auth = JSON.parse(localStorage.getItem("user"));
    const staffId = auth?._id;

    const [childAssignments, setChildAssignments] = useState([]);
    const [adultAssignments, setAdultAssignments] = useState([]);
    const [selectedMember, setSelectedMember] = useState("");
    const [memberType, setMemberType] = useState("child"); // 'child' or 'adult'
    const [points, setPoints] = useState(0);
    const [badge, setBadge] = useState("");
    const [msg, setMsg] = useState("");
    const [memberData, setMemberData] = useState(null);

    // Fetch Assignments
    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const response = await axios.get("http://localhost:5000/demo/assignments");
                const data = response.data;
                const myStaffId = String(staffId);

                const children = data.filter(item => {
                    const isMyStaff = String(item.staffId?._id) === myStaffId ||
                        String(item.staffId?.regid) === myStaffId ||
                        String(item.staffId) === myStaffId;
                    return isMyStaff && (item.childId?.regType === 'child' || (item.childId?.regid && item.childId?.regid.childname));
                });

                const adults = data.filter(item => {
                    const isMyStaff = String(item.staffId?._id) === myStaffId ||
                        String(item.staffId?.regid) === myStaffId ||
                        String(item.staffId) === myStaffId;
                    return isMyStaff && (item.adultId?.regType === 'adult' || (item.adultId?.regid && item.adultId?.regid.adultname));
                });

                setChildAssignments(children);
                setAdultAssignments(adults);
            } catch (error) {
                console.error("Error fetching assignments:", error);
            }
        };

        if (staffId) {
            fetchAssignments();
        }
    }, [staffId]);

    // Fetch Gamified Data when selected
    useEffect(() => {
        if (!selectedMember) {
            setMemberData(null);
            return;
        }

        const fetchMemberData = async () => {
            try {
                const endpoint = memberType === "child" ? "child/gamified-data" : "adult/gamified-data";
                const res = await axios.post(`http://localhost:5000/demo/${endpoint}`, { id: selectedMember });
                setMemberData(res.data);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };
        fetchMemberData();
    }, [selectedMember, memberType]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = memberType === "child" ? "child/reward" : "adult/reward";
            const payload = {
                [memberType === "child" ? "childId" : "adultId"]: selectedMember,
                points,
                badge: badge || undefined
            };
            const res = await axios.post(`http://localhost:5000/demo/${endpoint}`, payload);
            setMsg(res.data.message);
            setPoints(0);
            setBadge("");

            // Refresh data
            const refreshEndpoint = memberType === "child" ? "child/gamified-data" : "adult/gamified-data";
            const updatedRes = await axios.post(`http://localhost:5000/demo/${refreshEndpoint}`, { id: selectedMember });
            setMemberData(updatedRes.data);

            setTimeout(() => setMsg(""), 3000);
        } catch (err) {
            console.error(err);
            setMsg("Error assigning reward: " + (err.response?.data?.error || err.message));
        }
    };

    const handleDeleteBadge = async (badgeId, badgeName) => {
        if (!badgeId || typeof badgeId !== 'string') {
            alert("Cannot delete legacy badge via this interface.");
            return;
        }

        if (!window.confirm(`Are you sure you want to remove "${badgeName}"?`)) return;

        try {
            const endpoint = memberType === "child" ? "child/badge/delete" : "adult/badge/delete";
            const payload = {
                [memberType === "child" ? "childId" : "adultId"]: selectedMember,
                badgeId: badgeId
            };
            const res = await axios.post(`http://localhost:5000/demo/${endpoint}`, payload);
            setMsg(res.data.message);
            setMemberData(prev => ({ ...prev, badges: res.data.badges, rewards: res.data.rewards }));
            setTimeout(() => setMsg(""), 3000);
        } catch (err) {
            setMsg("Error deleting badge: " + (err.response?.data?.error || err.message));
        }
    };

    const handleTabSelect = (key) => {
        setMemberType(key);
        setSelectedMember("");
        setMemberData(null);
    };

    return (
        <div className="container-fluid position-relative bg-light d-flex p-0" style={{ minHeight: '100vh' }}>
            <StaffSide />
            <div className="content">
                <StaffNav />
                <Container fluid className="pt-4 px-4">
                    <Row className="g-4">
                        <Col xs={12}>
                            <div className="text-center mb-4">
                                <h2 className="fw-bold text-primary"><FaGift className="me-2 mb-1" />Rewards & Recognition</h2>
                                <p className="text-muted">Motivate your assigned members with points and badges!</p>
                            </div>
                        </Col>

                        {/* Assign Form */}
                        <Col md={12} lg={5} xl={4}>
                            <Card className="rounded-4 h-100 p-0 shadow border-0 overflow-hidden">
                                <div className="p-4 bg-primary text-white text-center">
                                    <h4 className="mb-0 fw-bold">🏆 Give a Reward</h4>
                                </div>
                                <div className="p-4">
                                    {msg && <Alert variant={msg.includes("Error") ? "danger" : "success"} className="mb-3 rounded-3 shadow-sm">{msg}</Alert>}

                                    <Tabs
                                        activeKey={memberType}
                                        onSelect={handleTabSelect}
                                        className="mb-4 custom-tabs"
                                        fill
                                    >
                                        <Tab eventKey="child" title={<span><FaChildIcon className="me-2" />Children</span>}>
                                            <Form.Group className="mt-3 mb-4">
                                                <Form.Label className="fw-bold text-secondary">Select Child</Form.Label>
                                                <Form.Select
                                                    value={selectedMember}
                                                    onChange={(e) => setSelectedMember(e.target.value)}
                                                    required={memberType === 'child'}
                                                    className="bg-light border-0 py-3 rounded-3"
                                                >
                                                    <option value="">-- Choose Child --</option>
                                                    {childAssignments.map((item) => (
                                                        <option key={item.childId?.regid?._id} value={item.childId?.regid?._id}>
                                                            👶 {item.childId?.regid?.childname || "Child"}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </Form.Group>
                                        </Tab>
                                        <Tab eventKey="adult" title={<span><FaMale className="me-2" />Adults</span>}>
                                            <Form.Group className="mt-3 mb-4">
                                                <Form.Label className="fw-bold text-secondary">Select Adult</Form.Label>
                                                <Form.Select
                                                    value={selectedMember}
                                                    onChange={(e) => setSelectedMember(e.target.value)}
                                                    required={memberType === 'adult'}
                                                    className="bg-light border-0 py-3 rounded-3"
                                                >
                                                    <option value="">-- Choose Adult --</option>
                                                    {adultAssignments.map((item) => (
                                                        <option key={item.adultId?.regid?._id} value={item.adultId?.regid?._id}>
                                                            🧑 {item.adultId?.regid?.adultname || "Adult"}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </Form.Group>
                                        </Tab>
                                    </Tabs>

                                    <Form onSubmit={handleSubmit}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-bold text-secondary">Star Points</Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={points}
                                                onChange={(e) => setPoints(e.target.value)}
                                                className="bg-light border-0 py-3 rounded-3"
                                                min="0"
                                                placeholder="e.g 20"
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-bold text-secondary">Badge Name (Optional)</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="e.g. Health Champion, Social Star"
                                                value={badge}
                                                onChange={(e) => setBadge(e.target.value)}
                                                className="bg-light border-0 py-3 rounded-3"
                                            />
                                        </Form.Group>

                                        <Button
                                            variant="primary"
                                            type="submit"
                                            disabled={!selectedMember}
                                            className="w-100 py-3 rounded-pill fw-bold shadow hover-scale transition-all"
                                        >
                                            Assign Reward ✨
                                        </Button>
                                    </Form>
                                </div>
                            </Card>
                        </Col>

                        {/* View Current Rewards */}
                        <Col md={12} lg={7} xl={8}>
                            {selectedMember && memberData ? (
                                <Card className="rounded-4 h-100 shadow border-0 bg-white">
                                    <Card.Body className="p-4 p-lg-5">
                                        <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
                                            <h3 className="fw-bold text-dark mb-0">
                                                {memberData.childname || memberData.adultname || "Member"}'s Achievements
                                            </h3>
                                            <Badge bg="warning" text="dark" className="fs-5 px-3 py-2 rounded-pill shadow-sm">
                                                <FaStar className="me-2 mb-1" /> {memberData.rewards || 0} Total
                                            </Badge>
                                        </div>

                                        <h5 className="mb-4 text-secondary fw-bold text-uppercase small ls-1"><FaMedal className="me-2" /> Badges Collection</h5>

                                        {memberData.badges && memberData.badges.length > 0 ? (
                                            <Row className="g-3">
                                                {memberData.badges.map((b, idx) => (
                                                    <Col xs={12} md={6} xl={4} key={b._id || idx}>
                                                        <div className="p-3 bg-light rounded-4 border d-flex justify-content-between align-items-center shadow-sm h-100">
                                                            <div className="d-flex align-items-center overflow-hidden">
                                                                <div className="bg-white p-2 rounded-circle text-warning shadow-sm me-3 fs-4">
                                                                    <FaMedal />
                                                                </div>
                                                                <div className="overflow-hidden">
                                                                    <span className="fw-bold text-dark d-block text-truncate" title={typeof b === 'string' ? b : b.name}>
                                                                        {typeof b === 'string' ? b : b.name}
                                                                    </span>
                                                                    {typeof b !== 'string' && b.points > 0 && (
                                                                        <small className="text-muted">
                                                                            <FaStar className="text-warning me-1" size={10} />
                                                                            {b.points} pts
                                                                        </small>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <Button
                                                                variant="link"
                                                                className="text-danger p-0 ms-2 opacity-50 hover-opacity-100"
                                                                onClick={() => handleDeleteBadge(b._id, typeof b === 'string' ? b : b.name)}
                                                            >
                                                                <FaTrash />
                                                            </Button>
                                                        </div>
                                                    </Col>
                                                ))}
                                            </Row>
                                        ) : (
                                            <div className="text-center py-5 rounded-4 bg-light text-muted border border-dashed">
                                                <FaMedal size={40} className="mb-3 opacity-25" />
                                                <p className="mb-0">No badges earned yet.</p>
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            ) : (
                                <Card className="rounded-4 h-100 shadow-sm border-0 d-flex align-items-center justify-content-center text-center p-5 bg-white">
                                    <div className="opacity-50">
                                        <div className="bg-light p-4 rounded-circle mb-4 d-inline-block">
                                            <FaStar size={60} className="text-warning" />
                                        </div>
                                        <h4 className="fw-bold text-secondary">Choose a Member</h4>
                                        <p className="text-muted" style={{ maxWidth: '300px' }}>Select a child or adult from the left to manage their rewards.</p>
                                    </div>
                                </Card>
                            )}
                        </Col>
                    </Row>
                </Container>
            </div>
            <style>{`
                .custom-tabs .nav-link {
                    border: none !important;
                    color: #6c757d;
                    background: #f8f9fa;
                    padding: 12px;
                    border-radius: 10px;
                    margin: 0 5px;
                    transition: all 0.3s;
                }
                .custom-tabs .nav-link.active {
                    background: #6366f1 !important;
                    color: white !important;
                    box-shadow: 0 4px 10px rgba(99, 102, 241, 0.3);
                }
                .hover-scale:hover {
                    transform: scale(1.02);
                }
            `}</style>
        </div>
    );
};

export default AssignRewards;
